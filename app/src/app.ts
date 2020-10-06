import {ImageTraceSimulation} from "./ImageTraceSimulation";
import {ImageExpandoConfig, ImageExpandoSimulation} from "./ImageExpandoSimulation";
import {BaseFrameworkError, getRGBAImageFromImageData, ISimulation, RGBAImage} from "canvas-framework/dist";

// Simulation constants
const particleCount = 2000;
const sourceImage = 'IMG_4155.png';
const updateFrameRate = 60;
const drawFrameRate = 60;
const sizeMultiplier = 1.4;
const sprayStep = 1;

const colorPalettes: string[][] = [
    ["#f3b700", "#faa300", "#e57c04", "#ff6201", "#f63e02"],
    ["#ed6a5a", "#f4f1bb", "#9bc1bc", "#5ca4a9", "#e6ebe0"],
    ["#50514f", "#f25f5c", "#ffe066", "#247ba0", "#70c1b3"],
    ["#edc4b3", "#e6b8a2", "#deab90", "#d69f7e", "#cd9777", "#c38e70", "#b07d62", "#9d6b53", "#8a5a44", "#774936"],
    ["#673c4f", "#7f557d", "#726e97", "#7698b3", "#83b5d1"],
    ["#e8aeb7", "#b8e1ff", "#a9fff7", "#94fbab", "#82aba1"]
];

function createDrawCanvas(image: RGBAImage, width: number, height: number) {

    console.log(`trying now with width ${width} height ${height}`);

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

    // const sim: ISimulation = new ImageTraceSimulation(ctx);
    // sim.init({
    //         colorPalettes,
    //         particleCount: particleCount,
    //         image,
    //         imageSpread: 4
    //     });

    const expandoConfig: ImageExpandoConfig = {
        background: 'black',
        image,
        maintainAspectRatio: true,
        imageSpread: 3,
        stepsInCycle: 40,
        sprayStep: sprayStep,
        screenMaxSize: {
            width: 1900,
            height: 1200
        }
    }
    const sim: ISimulation = new ImageExpandoSimulation(ctx, expandoConfig);


    const updateAndDraw = (timestamp: number) => {
        sim.update({});
        sim.draw(ctx);

        requestAnimationFrame(updateAndDraw);
    }

    requestAnimationFrame(updateAndDraw);
    // setInterval(() => {
    //         sim.update({});
    //         sim.draw(ctx);
    //
    //     },
    //     1000 / updateFrameRate
    // );

    // setInterval(() => {
    //         sim.draw(ctx);
    //     },
    //     1000 / drawFrameRate
    // );
}

function bootstrapper() {

    console.log("called bootstrapper");

    // create image element to load the jpg
    const image: HTMLImageElement = new window.Image();
    if (!image) {
        console.error('no image');
        return;
    }
    image.crossOrigin = 'Anonymous';
    image.onload = (e) => {
        console.log('loaded image');
        //const width = image.width;
        //const height = image.height;
        const imageCanvas = document.createElement('canvas');
        //document.body.appendChild(imageCanvas);
        imageCanvas.height = image.height;
        imageCanvas.width = image.width;
        const imageCtx: CanvasRenderingContext2D | null = imageCanvas.getContext('2d');
        if (!imageCtx) {
            console.error('no canvas');
            throw new BaseFrameworkError("can't create image canvas");
        }
        imageCtx.drawImage(image, 0, 0, image.width, image.height);
        createDrawCanvas(getRGBAImageFromImageData(imageCtx.getImageData(0,0,image.width,image.height)), image.width * sizeMultiplier, image.height * sizeMultiplier);
    }
    image.src = sourceImage;

}

console.log("calling boobootstrapper");
bootstrapper();