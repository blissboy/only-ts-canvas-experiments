import {
    FlowerTree,
    generateTree,
    MinMax,
    RunningTreeConfig,
    SpikyNode,
    SpikyTree,
    TreeBlueprint,
    TreeConfig
} from "./TreeFactory";
import TreeModel, {Node} from "tree-model";
import {
    ColorRGBA,
    getColorRGBA,
    getRandomInt,
    ImageBackedParticle,
    ISimulation,
    IntPoint,
    roundToInt, createRandomPointTree, randomPoint, ABCTree, Point
} from "canvas-framework";


const baseTreeConfig: TreeConfig = {
    heightRange: {
        min: 100,
        max: 800
    },
    widthRange: {
        min: 100,
        max: 500
    },
    numStepsRange: {
        min: 5,
        max: 23
    },
    trunkPercent: 33,
    colors: {
        trunk: getColorRGBA(23, 23, 23, 23),
        start: getColorRGBA(10, 100, 20, 100),
        finish: getColorRGBA(90, 190, 80, 100)
    },
    numForksAtSplit: {
        min: 2,
        max: 5
    },

}

export type TreeAppConfig = {
    treeHeights: MinMax,
    treeWidths: MinMax
}


export type ForesterSimConfig = {
    numTrees: number,
    height: number,
    width: number,
    beginColorPalette: ColorRGBA[],
    endColorPalette: ColorRGBA[]
}


/**
 * uses DOM window, document
 */
export class ForesterSim implements ISimulation {

    private trees: FlowerTree[] = [];
    private drawContext: CanvasRenderingContext2D;
    private screenWidth: number;
    private screenHeight: number;




    private particles: ImageBackedParticle[] = [];
    private config: ForesterSimConfig;
    private backgroundDrawn = false;

    private tick: number = 0;

    private spikyTreeBlueprint: TreeBlueprint = {
        getTrunk: (tree: TreeModel) => {
            return [];
        },
        config: {
            heightRange: {
                min: 100,
                max: 800
            },
            widthRange: {
                min: 100,
                max: 500
            },
            numStepsRange: {
                min: 5,
                max: 25
            },
            trunkPercent: 33,
            colors: {
                trunk: getColorRGBA(23, 23, 23, 23),
                start: getColorRGBA(19, 9, 100, 100),
                finish: getColorRGBA(199, 200, 88, 100)
            },
            numForksAtSplit: {
                min: 2,
                max: 5
            }
        },
        drawTree(ctx: CanvasRenderingContext2D, offset: IntPoint): void {
        },
        generateRunningConfig(seed: number): RunningTreeConfig {
            return {
                height: getRandomInt(this.config.heightRange.max, this.config.heightRange.min),
                width: getRandomInt(this.config.widthRange.max, this.config.widthRange.min),
                steps: getRandomInt(this.config.numStepsRange.max, this.config.numStepsRange.min),
                getTrunk: this.getTrunk,
                draw: this.drawTree
            }
        },
        getChildNodes(parentNode: Node<SpikyNode>, runningConfig: RunningTreeConfig): Node<SpikyNode>[] {
            const newNodes: Node<SpikyNode>[] = [];
            if (parentNode.model.step <= runningConfig.steps) {
                const numForks = getRandomInt(this.config.numForksAtSplit.max, this.config.numForksAtSplit.min);
                let i:number = 0;
                while (i<numForks) {
                    newNodes.push(parentNode.addChild(new Node(undefined,{
                        step: parentNode.model.step + 1,
                        point: {x:3,y:4},
                        width: 44,
                        color: getColorRGBA(12,12,12,12)
                    })));
                    i++;
                }
            }
            return newNodes;
        },
    }

    constructor(drawContext: CanvasRenderingContext2D, config: ForesterSimConfig) {

        this.drawContext = drawContext;
        this.config = config;
        this.screenWidth = this.drawContext.canvas.width;
        this.screenHeight = this.drawContext.canvas.height;
        const screenCenter: IntPoint = {
            x: roundToInt(this.screenWidth / 2),
            y: roundToInt(this.screenHeight / 2)
        }

        let treeIndex: number = 0;
        while (treeIndex < this.config.numTrees) {
            this.trees.push(this.getDrawablePointTree(createRandomPointTree(randomPoint(this.config.width, this.config.height), 7, 3, this.config.height))
            //this.trees.push(this.getRandomTree());
        }
    }

    private getDrawablePointTree(tree: ABCTree<Point>) {
        return {
            tree,
            draw: () => {}
        }
    }


    init() {
    };

    private getRandomTree: () => SpikyTree = () => {
        return this.buildTreeFromBlueprint(this.spikyTreeBlueprint);
    }

    private buildTreeFromBlueprint: (blueprint: TreeBlueprint) => SpikyTree = (blueprint: TreeBlueprint) => {
        return generateTree(blueprint);
    }


    update() {
        this.tick++;
        console.log(`${new Date().toLocaleTimeString()} finished tick ${this.tick}.`);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        this.trees.forEach((tree) => {
            tree.draw(ctx, {x: roundToInt(0), y: roundToInt(0)})
        })
        ctx.restore();
    }

    start() {

    }
}
