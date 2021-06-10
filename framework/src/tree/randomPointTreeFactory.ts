import {ABCTree, DrawableTree, Factory, utilAddChildrenToNode} from "./types";
import {Point, randomPoint} from "../entities/types";
import TreeModel, {Node} from "tree-model";

export function createRandomPointTree(basePoint: Point, levels: number = 5, branchLimit: number = 5, pointScale: number = 640): ABCTree<Point> {
    const tree = new TreeModel();
    const root: Node<Point> = tree.parse<Point>({...basePoint});
    addLevelsToNode<Point>(tree, root, {create: () => randomPoint(pointScale)}, levels, branchLimit);
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
function addLevelsToNode<T>(tree: TreeModel, parent: Node<T>, childFactory: Factory<T>, numberOfLevels: number, numberOfChildren: number) {
    console.log(`adding ${numberOfChildren} to node, ${numberOfLevels} deep`);
    const children: Node<T>[] = utilAddChildrenToNode(tree, parent, childFactory, numberOfChildren);
    //console.log(`created children: ${JSON.stringify(children)}`);
    if ( numberOfLevels > 1 ) {
        console.log(`need more levels...`);
        children.forEach( child => {
            addLevelsToNode<T>(tree, child, childFactory, numberOfLevels - 1, numberOfChildren);
        });
    }
    return children;
}
