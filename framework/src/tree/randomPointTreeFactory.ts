import {ABCTree, DrawableTree, Factory, utilAddChildrenToNode} from "./types";
import {Point, randomPoint} from "../entities/types";
import TreeModel, {Node} from "tree-model";
import {SimpleValue} from "../changers/types";

export function createRandomPointTree(
    basePoint: Point,
    levels: SimpleValue | number = 5,
    branchLimit: SimpleValue | number = 5,
    pointScaleX: number = 640,
    pointScaleY: number = pointScaleX,
    pointScaleZ: number = pointScaleY
): ABCTree<Point> {
    const tree = new TreeModel();
    const root: Node<Point> = tree.parse<Point>({...basePoint});
    addLevelsToNode<Point>(
        tree,
        root,
        {create: () => randomPoint(pointScaleX, pointScaleY, pointScaleZ)},
        levels,
        branchLimit
    );
    return {
        tree,
        root
    } as ABCTree<Point>
}

/**
 * Function that will recursively add children to a tree. Effective at grinding your computer to a halt if you ask too much.
 * @param tree
 * @param parent
 * @param childFactory
 * @param numberOfLevels
 * @param numberOfChildren
 */
function addLevelsToNode<T>(tree: TreeModel, parent: Node<T>, childFactory: Factory<T>, numberOfLevels: number | SimpleValue, numberOfChildren: number | SimpleValue) {
    
    //const realizedNumberOfChildren: number = typeof numberOfChildren == 'number' ? numberOfChildren : numberOfChildren();
    const realizedNumberOfLevels: number = typeof numberOfLevels == 'number' ? numberOfLevels : numberOfLevels();
    console.log(`adding ${typeof numberOfChildren == 'number' ? numberOfChildren : `variable number of`} children to node, ${realizedNumberOfLevels} deep`);
    const children: Node<T>[] = utilAddChildrenToNode(tree, parent, childFactory, typeof numberOfChildren == 'number' ? numberOfChildren : numberOfChildren() );
    //console.log(`created children: ${JSON.stringify(children)}`);
    if ( realizedNumberOfLevels > 1 ) {
        console.log(`need more levels...`);
        children.forEach( child => {
            addLevelsToNode<T>(tree, child, childFactory, realizedNumberOfLevels - 1, numberOfChildren);
        });
    }
    return children;
}
