import {ForesterSim, ForesterSimConfig} from "./ForesterSim";
import {ColorRGBA, getColorRGBAFromNumber, ISimulation} from "canvas-framework";

// Simulation constants
// const sourceImage = '../IMG_4144.png';
// const updateFrameRate = 60;
// const drawFrameRate = 60;
// const sizeMultiplier = 1.4;
// const sprayStep = 1;

const colorPalettes: number[][] = [
    [0xf3b700, 0xfaa300, 0xe57c04, 0xff6201, 0xf63e02],
    [0xed6a5a, 0xf4f1bb, 0x9bc1bc, 0x5ca4a9, 0xe6ebe0],
    [0x50514f, 0xf25f5c, 0xffe066, 0x247ba0, 0x70c1b3],
    [0xedc4b3, 0xe6b8a2, 0xdeab90, 0xd69f7e, 0xcd9777, 0xc38e70, 0xb07d62, 0x9d6b53, 0x8a5a44, 0x774936],
    [0x673c4f, 0x7f557d, 0x726e97, 0x7698b3, 0x83b5d1],
    [0xe8aeb7, 0xb8e1ff, 0xa9fff7, 0x94fbab, 0x82aba1]
];

function createDrawCanvas(width: number, height: number) {

    console.log(`this should only happen once. width ${width} height ${height}`);

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

    console.log(`palette 0 = ${colorPalettes[0]}`);
    colorPalettes[0].forEach(color => console.log(getColorRGBAFromNumber(color)));

    const forestSimConfig: ForesterSimConfig = {
        beginColorPalette: colorPalettes[0].map(color => getColorRGBAFromNumber(color)),
        endColorPalette: colorPalettes[1].map(color => getColorRGBAFromNumber(color)),
        height,
        width,
        numTrees: 12
    }

    const sim: ISimulation = new ForesterSim(ctx, forestSimConfig);


    const updateAndDraw = (timestamp: number) => {
        sim.update({});
        sim.draw(ctx);

        requestAnimationFrame(updateAndDraw);
    }

    requestAnimationFrame(updateAndDraw);
}

function bootstrapper(width: number, height: number) {
    console.log("called bootstrapper");
    createDrawCanvas(width,height);
}

console.log("calling boobootstrapper");
bootstrapper(1200, 800);