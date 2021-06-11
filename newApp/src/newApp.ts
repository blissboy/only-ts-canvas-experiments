import {ForesterSim, ForesterSimConfig} from "./ForesterSim";
import {
    BaseFrameworkError,
    ColorRGBA,
    getColorRGBAFromNumber,
    ISimulation,
    loadImageAndCallFunctionWithThePixelsFromThatImage, RGBAImage
} from "canvas-framework";


const width: number = 1440;
const height: number = 1080;

//const sourceImage = '../pic.png';
const sourceImage = '../IMG_1331.jpg';


const colorPalettes: number[][] = [
    [0xf3b700, 0xfaa300, 0xe57c04, 0xff6201, 0xf63e02],
    [0xed6a5a, 0xf4f1bb, 0x9bc1bc, 0x5ca4a9, 0xe6ebe0],
    [0x50514f, 0xf25f5c, 0xffe066, 0x247ba0, 0x70c1b3],
    [0xedc4b3, 0xe6b8a2, 0xdeab90, 0xd69f7e, 0xcd9777, 0xc38e70, 0xb07d62, 0x9d6b53, 0x8a5a44, 0x774936],
    [0x673c4f, 0x7f557d, 0x726e97, 0x7698b3, 0x83b5d1],
    [0xe8aeb7, 0xb8e1ff, 0xa9fff7, 0x94fbab, 0x82aba1]
];

const forestSimConfig: ForesterSimConfig = {
    beginColorPalette: colorPalettes[4].map(color => getColorRGBAFromNumber(color)),
    endColorPalette: colorPalettes[1].map(color => getColorRGBAFromNumber(color)),
    height,
    width,
    numTrees: 1,
    treeDepth: 3,
    treeBranches: 7,
    imageElement: 'image',
    circleRadius: 333,
    circlePeriod: 4000,
    circlePeriodVariance: 300,
    numberOfFrames: 1
}

// Simulation constants
// const sourceImage = '../IMG_4144.png';
// const updateFrameRate = 60;
// const drawFrameRate = 60;
// const sizeMultiplier = 1.4;
// const sprayStep = 1;


function createDrawingContext(doc: Document, width: number, height: number): CanvasRenderingContext2D {

    console.log(`Creating drawing context. width ${width} height ${height}`);

    const canvas: HTMLCanvasElement = doc.createElement('canvas');
    doc.body.appendChild(canvas);

    if (!canvas) {
        throw new BaseFrameworkError('could not create canvas');
    }

    canvas.width = width;
    canvas.height = height;

    return canvas.getContext("2d");
}

function imageCatcher(imageElement: HTMLImageElement, image: RGBAImage) {
    const ctx: CanvasRenderingContext2D = createDrawingContext(document, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const sim: ForesterSim = new ForesterSim(ctx, imageElement, document, forestSimConfig);
    sim.startSim(requestAnimationFrame);
}

function bootstrapper(width: number, height: number) {
    console.log("called bootstrapper");

    loadImageAndCallFunctionWithThePixelsFromThatImage(sourceImage, height, width, document, window, imageCatcher);
}

console.log("calling boobootstrapper");
bootstrapper(1200, 800);