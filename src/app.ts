import {ImageTraceSimulation} from "./ImageTraceSimulation";
import {ISimulation, RGBAImage} from "./framework/types";
import {BaseFrameworkError} from "./framework/error/BaseFrameworkError";
import {getRGBAImageFromImageData} from "./framework/utils";

// Simulation constants
const particleCount = 2500;
const colorPalettes: string[][] = [
    ["#f3b700", "#faa300", "#e57c04", "#ff6201", "#f63e02"],
    ["#ed6a5a", "#f4f1bb", "#9bc1bc", "#5ca4a9", "#e6ebe0"],
    ["#50514f", "#f25f5c", "#ffe066", "#247ba0", "#70c1b3"],
    ["#edc4b3", "#e6b8a2", "#deab90", "#d69f7e", "#cd9777", "#c38e70", "#b07d62", "#9d6b53", "#8a5a44", "#774936"],
    ["#673c4f", "#7f557d", "#726e97", "#7698b3", "#83b5d1"],
    ["#e8aeb7", "#b8e1ff", "#a9fff7", "#94fbab", "#82aba1"]
];

function createDrawCanvas(image: RGBAImage, width: number, height: number) {
    const updateFrameRate = 700;
    const drawFrameRate = 700;

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    document.body.appendChild(canvas);

    if (!canvas) {
        return;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const sim: ISimulation = new ImageTraceSimulation(ctx);
    sim.init({
            colorPalettes,
            particleCount: 500,
            image
        });

    setInterval(() => {
            sim.update({});
        },
        1000 / updateFrameRate
    );

    setInterval(() => {
            sim.draw(ctx);
        },
        1000 / drawFrameRate
    );
}

function bootstrapper() {

    console.log("called bootstrapper");
    let width: number = 800;
    let height: number = 800;

    // create image element to load the jpg
    const image: HTMLImageElement = new window.Image();
    if (!image) {
        console.error('no image');
        return;
    }
    image.crossOrigin = 'Anonymous';
    image.onload = (e) => {
        width = image.width;
        height = image.height;
        const imageCanvas = document.createElement('canvas');
        //document.body.appendChild(imageCanvas);
        imageCanvas.height = height;
        imageCanvas.width = width;
        const imageCtx: CanvasRenderingContext2D | null = imageCanvas.getContext('2d');
        if (!imageCtx) {
            console.error('no canvas');
            throw new BaseFrameworkError("can't create image canvas");
        }
        imageCtx.drawImage(image, 0, 0, width, height);
        createDrawCanvas(getRGBAImageFromImageData(imageCtx.getImageData(0,0,width,height)), width, height);
    }
    image.src = 'lp_image.png';

}

console.log("calling bootstrapper");
bootstrapper();