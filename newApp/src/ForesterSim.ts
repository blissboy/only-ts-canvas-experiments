import {
    ABCTree, ColorRGB,
    ColorRGBA, createCirclingPoint, createDynamicPoint,
    createRandomPointTree, DrawableTree, DynamicPoint, getSimpleRandomValueFunction,
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
    circleRadiusVariance:   number,
    circlePeriod:           number,
    circlePeriodVariance:   number,
    numberOfFrames:         number,
    beginColorPalette:      ColorRGBA[],
    endColorPalette:        ColorRGBA[],
    imageElement:           string,
    background:             string,
    clearEveryNFrames:      number,
    drawsToKeep:            number,
    treeLifetime:           number,
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
        drawContext.fillStyle = config.background;
        drawContext.fillRect(0,0,config.width,config.height);
        drawContext.restore();

        console.log(`will create ${config.numTrees} Flower Trees`);
        while (this.trees.length < config.numTrees) {
            this.trees.push(this.getFlowerTree(config));
        }
        console.log(`completed setup of Forrester Sim. Has ${this.trees.length} trees`)
    }

    getFlowerTree(config: ForesterSimConfig): FlowerTree {
        const abcTree: ABCTree<Point> = createRandomPointTree(
            randomPoint(config.width, config.height),
            getSimpleRandomValueFunction(1,config.treeDepth),
            getSimpleRandomValueFunction(1,config.treeBranches),
            config.width,
            config.height
        );

        return new FlowerTree(abcTree, {
            palette: this.config.beginColorPalette,
            circleRadius: this.config.circleRadius,
            circlePeriod: this.config.circlePeriod,
            circlePeriodVariance: this.config.circlePeriodVariance,
            circleRadiusVariance: this.config.circleRadiusVariance,
            drawsToKeep: this.config.drawsToKeep,
        }) as FlowerTree;
    }

    init() {
    };

    update() {
        this.tick++;
        console.log(`${new Date().toLocaleTimeString()} finished tick ${this.tick}.`);
        if ( this.config.treeLifetime !== 0 && (this.tick % this.config.treeLifetime) === 0) {
            this.trees.push(this.getFlowerTree(this.config));
            this.trees.shift();
        }
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        //if (this.config.clearEveryNFrames > 0 && (this.tick % this.config.clearEveryNFrames === 0)) {
            ctx.save();
            ctx.fillStyle = this.config.background;
            ctx.fillRect(0,0,this.config.width,this.config.height);
            ctx.restore();
        //}
        ctx.save();
        this.trees.forEach((tree) => {
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
        if ( this.config.numberOfFrames == 0 || this.tick < this.config.numberOfFrames) {
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
    circlePeriodVariance: number,
    circleRadiusVariance: number,
    drawsToKeep: number
}

export interface FlowerTreeDrawCall {
    ctx: CanvasRenderingContext2D,
    offset: Point,
    pattern: CanvasPattern,
    time: number,
}


export class FlowerTree implements DrawableTree<Point> {
    readonly draw: (ctx: CanvasRenderingContext2D, offset: Point, pattern: CanvasPattern, time: number) => any;
    // @ts-ignore
    readonly tree: ABCTree<DynamicPoint>;
    //readonly root: Node<Point>;
    readonly dynamicRoot: Node<DynamicPoint>;
    readonly palette: ColorRGB[];

    readonly drawCalls: FlowerTreeDrawCall[] = [];
    readonly config: FlowerTreeConfig;



    constructor(tree: ABCTree<Point>, flowerConfig: FlowerTreeConfig) {
        console.log('creating new Flower tree');
        this.config = flowerConfig;
        const circlingPointConverter = (point: Point) => {
            return createCirclingPoint(
                point,
                flowerConfig.circlePeriod + Math.floor((0.5 - Math.random()) * flowerConfig.circlePeriodVariance ),
                flowerConfig.circleRadius + Math.floor((0.5 - Math.random()) * flowerConfig.circleRadiusVariance )
            );
        }
        this.tree = convertPointTree<DynamicPoint>(tree, circlingPointConverter);
        this.dynamicRoot = this.tree.root;
        this.palette = flowerConfig.palette;
        this.draw = (ctx: CanvasRenderingContext2D, offset: Point, pattern: CanvasPattern, time: number) => {
            this.drawCalls.push({
                ctx,
                offset,
                pattern,
                time
            });
            if ( this.drawCalls.length > flowerConfig.drawsToKeep ) {this.drawCalls.shift();}
            this.drawCalls.forEach((drawCall) => {
                drawCall.ctx.save();
                this.dynamicRoot.walk((node) => {
                    drawCall.ctx.fillStyle = this.palette[Math.floor(Math.random() * flowerConfig.palette.length)].cssColor;
                    drawCall.ctx.fillStyle = drawCall.pattern;
                    //drawCall.ctx.fillStyle = "#FFFFAA";
                    let circle = new Path2D();
                    const point = node.model.getPoint(drawCall.time);
                    circle.arc(point.x, point.y, 1, 0, 2 * Math.PI);
                    drawCall.ctx.fill(circle);
                    //console.log(`drew circle at ${point.x},${point.y}`);
                    return true;
                });
                const rootPoint: Point = this.dynamicRoot.model.getPoint(drawCall.time);
                drawCall.ctx.beginPath();
                drawCall.ctx.moveTo(rootPoint.x, rootPoint.y);
                drawCall.ctx.strokeStyle = pattern;
                this.dynamicRoot.walk((node) => {
                    if (!node.isRoot()) {
                        const point: Point = node.model.getPoint(drawCall.time);
                        const parentPoint = node.parent.model.getPoint(drawCall.time);
                        drawCall.ctx.moveTo(point.x, point.y);

                        drawCall.ctx.quadraticCurveTo(rootPoint.x, rootPoint.y, parentPoint.x, parentPoint.y);
                    }
                    return true;
                })
                drawCall.ctx.stroke();
                drawCall.ctx.restore();
            });

            return;
        }
        console.log('created tree');
    }
}