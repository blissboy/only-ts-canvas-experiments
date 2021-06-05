import TreeModel, {Node} from "tree-model";
import {Point} from "canvas-framework";
import {ColorCMYK, ColorRGBA} from "canvas-framework";

export type SpikyTree = {
    tree: TreeModel,
    draw: (ctx: CanvasRenderingContext2D, rootPoint: Point) => void
}

export type TreeBlueprint = {
    config: TreeConfig,
    getChildNodes: (treeNode: Node<SpikyNode>, config: RunningTreeConfig) => Node<SpikyNode>[],
    getTrunk: (tree: TreeModel) => Node<SpikyNode>[],
    drawTree: (ctx: CanvasRenderingContext2D, offset: Point) => void,
    generateRunningConfig: (seed: number) => RunningTreeConfig
}

export type TreeConfig = {
    heightRange: MinMax,
    widthRange: MinMax,
    numStepsRange: MinMax,
    trunkPercent: number,
    colors: {
        trunk: ColorRGBA | ColorCMYK,
        start: ColorRGBA | ColorCMYK,
        finish: ColorRGBA | ColorCMYK
    }
    numForksAtSplit: MinMax
}

export type RunningTreeConfig = {
    height: number,
    width: number,
    steps: number,
    getTrunk: (tree: TreeModel) => Node<SpikyNode>[]
    draw: (drawContext: CanvasRenderingContext2D, root: Point) => void
}

export type SpikyNode = {
    step: number,
    point: Point,
    width: number,
    color: ColorRGBA
}

export type MinMax = {
    min: number,
    max: number
}

export const generateTree: (blueprint: TreeBlueprint) => SpikyTree = (blueprint: TreeBlueprint) => {
    const tree: TreeModel = new TreeModel();
    const config: RunningTreeConfig = blueprint.generateRunningConfig(23);
    let nodesToFork: Node<SpikyNode>[] = [blueprint.getTrunk(tree)[1]];  // this is the top of the trunk
    while (nodesToFork.length > 0) {
        const nextLevelNodes: Node<SpikyNode>[] = [];
        nodesToFork.forEach((node) => {
            nextLevelNodes.concat( blueprint.getChildNodes(node, config));
        });
        nodesToFork = nextLevelNodes;
    }

    return {
        tree,
        draw: blueprint.drawTree
    }

}