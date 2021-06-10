import {
    ABCTree, ColorRGB,
    ColorRGBA,
    createRandomPointTree, DrawableTree,
    ImageBackedParticle,
    IntPoint,
    ISimulation,
    Point,
    randomPoint,
    roundToInt
} from "canvas-framework";
import TreeModel, {Node} from "tree-model";

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

    private trees: DrawableTree<Point>[] = [];
    private drawContext: CanvasRenderingContext2D;
    private screenWidth: number;
    private screenHeight: number;

    private particles: ImageBackedParticle[] = [];
    private config: ForesterSimConfig;
    private backgroundDrawn = false;

    private tick: number = 0;


    constructor(drawContext: CanvasRenderingContext2D, config: ForesterSimConfig) {
        console.log( 'setting up Forrester Sim');
        this.drawContext = drawContext;
        this.config = config;
        this.screenWidth = this.drawContext.canvas.width;
        this.screenHeight = this.drawContext.canvas.height;
        const screenCenter: IntPoint = {
            x: roundToInt(this.screenWidth / 2),
            y: roundToInt(this.screenHeight / 2)
        }

        console.log(`will create ${config.numTrees} Flower Trees`);
        while (this.trees.length < config.numTrees) {
            const abcTree: ABCTree<Point> = createRandomPointTree(
                randomPoint(config.width, config.height),
                7,
                2,
                config.width
            );
            const flowerTree = new FlowerTree(abcTree, this.config.beginColorPalette);
            // @ts-ignore - no idea why necessary
            this.trees.push(flowerTree);
        }
        console.log(`completed setup of Forrester Sim. Has ${this.trees.length} trees`)
    }

    init() {
    };

    update() {
        this.tick++;
        console.log(`${new Date().toLocaleTimeString()} finished tick ${this.tick}.`);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.trees.forEach((tree) => {
            console.log(`drawing treex`);
            tree.draw(ctx, {x: roundToInt(0), y: roundToInt(0)})
        })
        ctx.restore();
    }

    start() {

    }
}


export class FlowerTree implements DrawableTree<Point> {
    readonly draw: (ctx: CanvasRenderingContext2D, offset: Point) => void;
    // @ts-ignore
    readonly tree: TreeModel;
    readonly root: Node<Point>;
    readonly palette: ColorRGB[];

    constructor(tree: ABCTree<Point>, palette: ColorRGB[]) {
        console.log('creating new Flower tree');
        this.tree = tree.tree as unknown as TreeModel;  // no idea why needed
        this.root = tree.root;
        this.palette = palette;
        this.draw = (ctx: CanvasRenderingContext2D, offset: Point) => {
            console.log('drawing treee....');
            ctx.save();
            const grd = ctx.createLinearGradient(0, 0, 170, 0);
            grd.addColorStop(0, "blue");
            grd.addColorStop(1, "red");
            // first the dots
            this.root.walk((node) => {
                ctx.fillStyle = this.palette[Math.floor(Math.random() * palette.length)].cssColor;
                //ctx.fillStyle = "#FFFFAA";
                let circle = new Path2D();
                circle.arc(node.model.x, node.model.y, 4, 0, 2 * Math.PI);
                ctx.fill(circle);
                console.log(`drew circle at ${node.model.x},${node.model.y}`);
                return true;
            });
            ctx.beginPath();
            ctx.moveTo(this.root.model.x, this.root.model.y);
            ctx.strokeStyle = grd;
            this.root.walk( (node) => {
                if ( ! node.isRoot()) {
                    ctx.moveTo(node.model.x, node.model.y);
                    ctx.quadraticCurveTo(this.root.model.x, this.root.model.y, node.parent.model.x, node.parent.model.y);
                }
                return true;
            })
            ctx.stroke();
            ctx.restore();
            return;
        }
        console.log('created tree');
    }
}