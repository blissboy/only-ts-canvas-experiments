import {
    AccelerationFunction, ColorCMYK,
    ColorLookupFunction, ColorRGB, ColorRGBA,
    EdgeAvoidanceFunction,
    IColoredParticle2d,
    IParticle2d,
    Point, roundToInt,
    SizeFunction
} from "./types";
import Victor from "victor";
import {getNinetyDegreeBounceEdgeDetector, NoOpAccelerationFunction} from "./utils";

const TWO_PI = Math.PI * 2;
const particleSize: number = 9;

export class BaseColoredParticle2d implements IColoredParticle2d {

    location: Point;
    velocity: Victor;
    tick: number = 0;
    tickCycle: number = 120;

    private accelerators: AccelerationFunction[] = [];

    maxLocation: Point;
    minLocation: Point;
    private edgeAvoider: EdgeAvoidanceFunction;
    private colorLookup: ColorLookupFunction;
    private color: ColorRGB | ColorRGBA | ColorCMYK ;
    private sizeFn: SizeFunction;

    constructor(
        location: Point,
        velocity: Victor,
        minLocation: Point,
        maxLocation: Point,
        sizeFn: SizeFunction,
        edgeAvoidanceFn: EdgeAvoidanceFunction = getNinetyDegreeBounceEdgeDetector(minLocation, maxLocation),
        colorLookupFn: ColorLookupFunction,
        accelerationFunction: AccelerationFunction = NoOpAccelerationFunction
    ) {
        this.location = location;
        this.velocity = velocity;
        this.maxLocation = maxLocation;
        this.minLocation = minLocation;
        this.edgeAvoider = edgeAvoidanceFn;
        this.colorLookup = colorLookupFn;
        this.sizeFn = sizeFn;

        this.color = colorLookupFn(this);

    }

    // edgeCorrector(particle: IParticle2d): [Point, Velocity2d] {
    //     // TODO: make this a 90 degree deflector edge detector
    //     return [this.location, this.velocity];
    // }

    addAccelerator(accelerator: AccelerationFunction): void {
        this.accelerators.push(accelerator);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.experiment1(ctx);
        ctx.restore();
    }

    experiment1(ctx: CanvasRenderingContext2D): void {
        const fillColor: string = this.colorLookup(this).toCssColor();
        //console.log(`color is ${fillColor}`);
        ctx.fillStyle = this.colorLookup(this).toCssColor();
        let circle = new Path2D();
        circle.arc(this.location.x, this.location.y, this.sizeFn(this), 0, TWO_PI);
        ctx.fill(circle);
    }

    init(config: any): void {
    }

    update(updateData: any): void {
        //this.location =

        this.location = {
            x: roundToInt(this.location.x + this.velocity.x),
            y: roundToInt(this.location.y + this.velocity.y)
        };

        //console.log(`avoiding edge with ${JSON.stringify(this.location)} vel and ${JSON.stringify(this.velocity)} vel`);
        [this.location, this.velocity] = this.edgeAvoider(this);
        //console.log(`resulting in ${JSON.stringify(this.location)} vel and ${JSON.stringify(this.velocity)} vel`);

        this.color = this.colorLookup(this);
    }

}
