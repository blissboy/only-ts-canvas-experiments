import {Point} from "../entities/types";
import {ABCTree} from "./types";
import TreeModel, {Node} from "tree-model";

export function convertPointTree<T>(referenceTree: ABCTree<Point>, converter: (point: Point) => T) : ABCTree<T> {

    const newTree: TreeModel = new TreeModel();
    const newRoot: Node<T> = newTree.parse<T>(converter(getPointFromNode(referenceTree.root)));

    const nodeMap: Map<Node<Point>,Node<T>> = new Map();
    nodeMap.set(referenceTree.root, newRoot);

    referenceTree.root.walk((referenceNode) => {
        const transformedNode: Node<T> | undefined = nodeMap.get(referenceNode);
        if (transformedNode) {
            if (referenceNode.hasChildren()) {
                // this isn't perfect, but :shrug:
                if ((!transformedNode.hasChildren()) || ! referenceNode.children.length == transformedNode.chidren.length) {
                    referenceNode.children.forEach((referencePointNode: Node<Point>) => {
                        const newNode = newTree.parse<T>(converter(getPointFromNode(referencePointNode)));
                        nodeMap.set(referencePointNode, newNode);
                        transformedNode.addChild(newNode);
                    });
                }
            }
        }
        return true;
    });

    return {
        tree: newTree,
        root: newRoot
    }
}

export function getPointFromNode(node: Node<any>): Point {
    return {
        x: node.model.x,
        y: node.model.y,
        z: node.model.z,
    } as Point
}