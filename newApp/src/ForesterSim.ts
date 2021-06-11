import {
    ABCTree, ColorRGB,
    ColorRGBA, createCirclingPoint, createDynamicPoint,
    createRandomPointTree, DrawableTree, DynamicPoint,
    ImageBackedParticle,
    IntPoint,
    ISimulation,
    Point,
    randomPoint,
    roundToInt
} from "canvas-framework";
import TreeModel, {Node} from "tree-model";
import {convertPointTree} from "canvas-framework";


export type ForesterSimConfig = {
    numTrees:               number,
    treeDepth:              number,
    treeBranches:           number,
    height:                 number,
    width:                  number,
    circleRadius:           number,
    circlePeriod:           number,
    circlePeriodVariance:   number,
    numberOfFrames:         number,
    beginColorPalette:      ColorRGBA[],
    endColorPalette:        ColorRGBA[],
    imageElement:           string
}

/**
 * uses DOM window, document
 */
export class ForesterSim implements ISimulation {

    private trees: FlowerTree[] = [];
    private drawContext: CanvasRenderingContext2D;
    private screenWidth: number;
    private screenHeight: number;

    private config: ForesterSimConfig;
    private imagePattern: CanvasPattern;
    private requestAnimationFrame;

    private tick: number = 0;


    constructor(
        drawContext: CanvasRenderingContext2D,
        imageElement: HTMLImageElement,
        doc: Document,
        config: ForesterSimConfig)
    {
        console.log('setting up Forrester Sim');
        this.drawContext = drawContext;
        this.config = config;
        this.screenWidth = this.drawContext.canvas.width;
        this.screenHeight = this.drawContext.canvas.height;
        this.imagePattern = drawContext.createPattern(imageElement, "no-repeat");
        drawContext.save();
        drawContext.fillStyle = "#000000";
        drawContext.fillRect(0,0,config.width,config.height);
        drawContext.restore();

        console.log(`will create ${config.numTrees} Flower Trees`);
        while (this.trees.length < config.numTrees) {
            const abcTree: ABCTree<Point> = createRandomPointTree(
                randomPoint(config.width, config.height),
                config.treeDepth,
                config.treeBranches,
                config.width
            );

            const flowerTree = new FlowerTree(abcTree, {
                palette: this.config.beginColorPalette,
                circleRadius: this.config.circleRadius,
                circlePeriod: this.config.circlePeriod,
                circlePeriodVariance: this.config.circlePeriodVariance,
            });
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

    draw(ctx: CanvasRenderingContext2D, time: number) {
        console.log('sim draw');
        ctx.save();
        this.trees.forEach((tree) => {
            console.log(`drawing treex`);
            tree.draw(ctx, {x: roundToInt(0), y: roundToInt(0)}, this.imagePattern, time);
        })
        ctx.restore();
    }

    start() {

    }

    updateAndDraw(callTime: DOMHighResTimeStamp) {
        console.log(`starting updateAndDraw at ${callTime}`);
        this.update();
        this.draw(this.drawContext, callTime.valueOf());
        if ( this.config.numberOfFrames > 0 && this.tick < this.config.numberOfFrames) {
            requestAnimationFrame(this.updateAndDraw.bind(this));
        } else {
            console.log('&&***************** Done');
        }
    }

    startSim(requestAnimationFrameFunction: (callback: (callTime: DOMHighResTimeStamp) => void) => void) {
        this.requestAnimationFrame = requestAnimationFrameFunction;
        requestAnimationFrameFunction(this.updateAndDraw.bind(this));
    }
}


export type FlowerTreeConfig = {
    palette: ColorRGB[],
    circlePeriod: number,   // todo: make changeable?
    circleRadius: number,  // todo: make changeable?
    circlePeriodVariance: number
}

export class FlowerTree implements DrawableTree<Point> {
    readonly draw: (ctx: CanvasRenderingContext2D, offset: Point, pattern: CanvasPattern, time: number) => any;
    // @ts-ignore
    readonly tree: ABCTree<DynamicPoint>;
    //readonly root: Node<Point>;
    readonly dynamicRoot: Node<DynamicPoint>;
    readonly palette: ColorRGB[];

    constructor(tree: ABCTree<Point>, flowerConfig: FlowerTreeConfig) {
        console.log('creating new Flower tree');
        const circlingPointConverter = (point: Point) => {
            return createCirclingPoint(point, flowerConfig.circlePeriod + Math.floor((0.5 - Math.random()) * flowerConfig.circlePeriodVariance ), flowerConfig.circleRadius);
        }
        this.tree = convertPointTree<DynamicPoint>(tree, circlingPointConverter);
        this.dynamicRoot = this.tree.root;
        this.palette = flowerConfig.palette;
        this.draw = (ctx: CanvasRenderingContext2D, offset: Point, pattern: CanvasPattern, time: number) => {
            ctx.save();
            // const grd = ctx.createLinearGradient(0, 0, 170, 0);
            // grd.addColorStop(0, "blue");
            // grd.addColorStop(1, "red");
            // first the dots
            this.dynamicRoot.walk((node) => {
                ctx.fillStyle = this.palette[Math.floor(Math.random() * flowerConfig.palette.length)].cssColor;
                ctx.fillStyle = pattern;
                //ctx.fillStyle = "#FFFFAA";
                let circle = new Path2D();
                const point = node.model.getPoint(time);
                circle.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                ctx.fill(circle);
                //console.log(`drew circle at ${point.x},${point.y}`);
                return true;
            });
            const rootPoint: Point = this.dynamicRoot.model.getPoint(time);
            ctx.beginPath();
            ctx.moveTo(rootPoint.x, rootPoint.y);
            ctx.strokeStyle = pattern;
            this.dynamicRoot.walk((node) => {
                if (!node.isRoot()) {
                    const point: Point = node.model.getPoint(time);
                    const parentPoint = node.parent.model.getPoint(time);
                    ctx.moveTo(point.x, point.y);

                    ctx.quadraticCurveTo(rootPoint.x, rootPoint.y, parentPoint.x, parentPoint.y);
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