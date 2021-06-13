export * from './randomPointTreeFactory';
export * from './utils';

import {Point} from "../entities/types";
import TreeModel, {Node} from "tree-model";

export interface ABCTree<T> {
    tree: TreeModel;
    root: Node<T>;
}

export interface DrawableTree<T> extends ABCTree<T> {
    draw: (ctx: CanvasRenderingContext2D, offset: Point, pattern: CanvasPattern, time?: number) => void;
}

export interface PointTree<Point> extends ABCTree<Point> {
}

// export interface NodeGenerator<T> {
//     generateNodes<T>(tree: TreeModel, baseForNewNodes: Node<T>): Node<T>[];
// }

export function utilAddChildrenToNode<T>(tree: TreeModel, node: Node<T>, creator: Factory<T>, numberToAdd: number): Node<T>[] {
    console.log(`adding ${numberToAdd} children to node`);
    for (let i=0; i < numberToAdd; i++) {
        node.addChild(tree.parse(creator.create()));
    }
    return node.children;
}

export interface Factory<T> {
    create: () => T;
}