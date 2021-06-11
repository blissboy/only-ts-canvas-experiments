import {BaseFrameworkError} from "../error/BaseFrameworkError";
import {getRGBAImageFromImageData} from "../utils";
import {RGBAImage} from "../types";

export function loadImageAndCallFunctionWithThePixelsFromThatImage(sourceImage: string, doc: Document, win: Window & typeof globalThis, callback: (image: RGBAImage) => any): undefined | BaseFrameworkError {
    const image: HTMLImageElement = new win.Image();
    if (!image) {
        console.error('no image');
        return new BaseFrameworkError(`no image HTML element`);
    }
    image.crossOrigin = 'Anonymous';
    image.onload = (e) => {
        console.log(`loaded image ${sourceImage}`);
        const imageCanvas = doc.createElement('canvas');
        //document.body.appendChild(imageCanvas);
        imageCanvas.height = image.height;
        imageCanvas.width = image.width;
        const imageCtx: CanvasRenderingContext2D | null = imageCanvas.getContext('2d');
        if (!imageCtx) {
            console.error('no canvas');
            throw new BaseFrameworkError("can't create image canvas");
        }
        imageCtx.drawImage(image, 0, 0, image.width, image.height);
        callback(getRGBAImageFromImageData(imageCtx.getImageData(0,0,image.width,image.height)));
    }
    image.src = sourceImage;

}

