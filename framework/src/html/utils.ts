import {BaseFrameworkError} from "../error/BaseFrameworkError";
import {getRGBAImageFromImageData} from "../utils";
import {RGBAImage} from "../types";

export function loadImageAndCallFunctionWithThePixelsFromThatImage(
    sourceImage: string,
    height: number,
    width: number,
    doc: Document,
    win: Window & typeof globalThis,
    callback: (imageElement: HTMLImageElement, image: RGBAImage) => any): undefined | BaseFrameworkError {
    const image: HTMLImageElement = new win.Image(); //width,height);
    //image.height = height;
    //image.width = width;
    image.id = 'image';
    if (!image) {
        console.error('no image');
        return new BaseFrameworkError(`no image HTML element`);
    }
    image.crossOrigin = null;
    image.onload = (e) => {
        console.log(`loaded image ${sourceImage}`);
        const imageCanvas = doc.createElement('canvas');
        //document.body.appendChild(imageCanvas);
        imageCanvas.height = image.height;
        imageCanvas.width = image.width;
        //imageCanvas.height = height;
        //imageCanvas.width = width;
        const imageCtx: CanvasRenderingContext2D | null = imageCanvas.getContext('2d');
        if (!imageCtx) {
            console.error('no canvas');
            throw new BaseFrameworkError("can't create image canvas");
        }
        imageCtx.drawImage(image, 0, 0, image.width, image.height);
        //imageCtx.drawImage(image, 0, 0, width, height);
        callback(image, getRGBAImageFromImageData(imageCtx.getImageData(0,0,image.width,image.height)));
    }
    image.src = sourceImage;

}

