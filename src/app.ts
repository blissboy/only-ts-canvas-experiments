import {ExampleSimulation} from "./ExampleSimulation";
import {ISimulation} from "./framework/types";

const TWO_PI = Math.PI * 2.0;
const dogsSmell = "dogs";

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

const maxParticleSize = 3.0;


function createDrawCanvas(imageCtx: CanvasRenderingContext2D, width: number, height: number) {
    const updateFrameRate = 60;
    const drawFrameRate = 60;

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

    const sim: ISimulation = new ExampleSimulation(width, height, {colorPalettes: colorPalettes, particleCount: 500});
    const imageData = imageCtx.getImageData(0, 0, width, height);

    setInterval(
        () => {
            sim.update(imageData);
        },
        1000 / updateFrameRate
    );

    setInterval(
        () => {
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
        const ctx: CanvasRenderingContext2D | null = imageCanvas.getContext('2d');
        if (!ctx) {
            console.error('no canvas');
            return;
        }
        ctx.drawImage(image, 0, 0, width, height);
        createDrawCanvas(ctx, width, height);
    }
    image.src = 'pic.png';

}

console.log("calling bootstrapper");
bootstrapper();