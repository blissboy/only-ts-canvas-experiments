import {ExistingEntity, IntPoint} from "./types";
import {TWO_PI} from "./utils";

export type LocationFunction = (particle: ExistingEntity) => IntPoint;

export class ImageBackedParticle implements ExistingEntity {

    homeLocation: IntPoint;
    color: string;
    getLocation: LocationFunction;
    tick: number = 0;
    location: IntPoint;

    constructor(
        homeLocation: IntPoint,
        cssColor: string,
        locationFunction: LocationFunction
    ) {
        this.homeLocation = homeLocation;
        this.color = cssColor;
        this.getLocation = locationFunction;
        this.location = locationFunction(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        this.circleAtLocation(ctx);
        ctx.restore();
    }

    circleAtLocation(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        let circle = new Path2D();
        circle.arc(this.location.x, this.location.y, 1, 0, TWO_PI);
        ctx.fill(circle);
    }

    init(config: any): void {
    }

    update(tick: number): void {
        this.tick = tick;
        this.location = this.getLocation(this);
    }
}