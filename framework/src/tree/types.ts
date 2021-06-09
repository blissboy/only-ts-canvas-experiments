export * from './randomPointTreeFactory';

import TreeModel, {Node} from "tree-model";
import {IntPoint} from "../types";

export interface ABCTree<T> {
    tree: TreeModel;
}

export interface DrawableTree<T> extends ABCTree<T> {
    draw: () => void;  // TODO: this will likely change, perhaps to add a drawing context param
}

export interface PointTree<PointNode> extends NodeGenerator<PointNode> {
    tree: TreeModel;
}

export interface NodeGenerator<T> {
    generateNodes<T>(tree: TreeModel, baseForNewNodes: Node<T>): Node<T>[];
}

export function utilAddChildrenToNode<T>(tree: TreeModel, node: Node<T>, creator: Factory<T>, numberToAdd: number): Node<T>[] {
    for (let i=0; i < numberToAdd; i++) {
        node.addChild(tree.parse(creator.create()));
    }
    return node.children;
}

export interface Factory<T> {
    create: () => T;
}