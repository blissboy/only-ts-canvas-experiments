import {ColorRGB, ColorRGBA, getColorRGB, getColorRGBA, getColorRGBAFromNumber, getColorRGBFromNumber} from "./types";
import {expect} from "chai";

describe('test color utils', () => {

    const whiteNoAlpha: ColorRGB = getColorRGB(0xff, 0xff, 0xff);
    const whiteAlpha50: ColorRGBA = getColorRGBA(0xff, 0xff, 0xff,0x80);
    const redNoAlpha: ColorRGB = getColorRGB(0xff, 0x00, 0xf00);
    const redAlpha50: ColorRGBA = getColorRGBA(0xff, 0x00, 0x00,0x80);

    it( 'should get #ffffff for white no alpha', () => {
        expect(whiteNoAlpha.cssColor).to.equal('#ffffff');
    })

    it( 'should get #ffffff80 for white 50% alpha', () => {
        expect(whiteAlpha50.cssColor).to.equal('#ffffff80');
    })

    it( 'should get correct answer for red no alpha', () => {
        expect(redNoAlpha.cssColor).to.equal('#ff0000');
    })

    it( 'should get correct for red 50% alpha', () => {
        expect(redAlpha50.cssColor).to.equal('#ff000080');
    })

    it('single number constructors should create correct colors', () => {
        const colorAsRGB: number = 0xFFAABB;
        const rgbColor: ColorRGB = getColorRGBFromNumber(colorAsRGB);
        expect(rgbColor.r).to.equal(0xFF);
        expect(rgbColor.g).to.equal(0xAA);
        expect(rgbColor.b).to.equal(0xBB);
        const rgbaColor: ColorRGBA = getColorRGBAFromNumber(colorAsRGB);
        expect(rgbaColor.r).to.equal(0x00);
        expect(rgbaColor.g).to.equal(0xFF);
        expect(rgbaColor.b).to.equal(0xAA);
        expect(rgbaColor.a).to.equal(0xBB)

        const shortColor: number = 0x0A;
        const shortRgbColor: ColorRGB = getColorRGBFromNumber(shortColor);
        expect(shortRgbColor.r).to.equal(0x00);
        expect(shortRgbColor.g).to.equal(0x00);
        expect(shortRgbColor.b).to.equal(0x0A);
        const shortRgbaColor: ColorRGBA = getColorRGBAFromNumber(shortColor);
        expect(shortRgbaColor.r).to.equal(0x00);
        expect(shortRgbaColor.g).to.equal(0x00);
        expect(shortRgbaColor.b).to.equal(0x00);
        expect(shortRgbaColor.a).to.equal(0x0A)

        const longColor: number = 0x040506070809;
        const longRgbColor: ColorRGB = getColorRGBFromNumber(longColor);
        expect(longRgbColor.r).to.equal(0x07);
        expect(longRgbColor.g).to.equal(0x08);
        expect(longRgbColor.b).to.equal(0x09);
        const longRgbaColor: ColorRGBA = getColorRGBAFromNumber(longColor);
        expect(longRgbaColor.r).to.equal(0x06);
        expect(longRgbaColor.g).to.equal(0x07);
        expect(longRgbaColor.b).to.equal(0x08);
        expect(longRgbaColor.a).to.equal(0x09)

        const nonIntegerColor: number = 123.456;
        const nonIntRgbColor: ColorRGB = getColorRGBFromNumber(nonIntegerColor);
        expect(nonIntRgbColor.r).to.equal(0);
        expect(nonIntRgbColor.g).to.equal(0);
        expect(nonIntRgbColor.b).to.equal(123);
        const nonIntRgbaColor: ColorRGBA = getColorRGBAFromNumber(nonIntegerColor);
        expect(nonIntRgbaColor.r).to.equal(0);
        expect(nonIntRgbaColor.g).to.equal(0);
        expect(nonIntRgbaColor.b).to.equal(0);
        expect(nonIntRgbaColor.a).to.equal(123);

        const nonIntegerColor2: number = 456;
        const nonIntRgbColor2: ColorRGB = getColorRGBFromNumber(nonIntegerColor2);
        expect(nonIntRgbColor2.r).to.equal(0);
        expect(nonIntRgbColor2.g).to.equal(1);
        expect(nonIntRgbColor2.b).to.equal(200);

    })

    it('r g b a constructors should create correct colors', () => {
        const rgbColor: ColorRGB = getColorRGB(0xFF, 0xAA, 0xBB);
        expect(rgbColor.r).to.equal(0xFF);
        expect(rgbColor.g).to.equal(0xAA);
        expect(rgbColor.b).to.equal(0xBB);

        const rgbaColor: ColorRGBA = getColorRGBA(0xff, 0xaa, 0xbb, 0x12);
        expect(rgbaColor.r).to.equal(0xff);
        expect(rgbaColor.g).to.equal(0xaa);
        expect(rgbaColor.b).to.equal(0xbb);
        expect(rgbaColor.a).to.equal(0x12)

        const shortRgbColor: ColorRGB = getColorRGB(500,-10,127);
        expect(shortRgbColor.r).to.equal(0xf4);
        expect(shortRgbColor.g).to.equal(0x0a);
        expect(shortRgbColor.b).to.equal(0x7f);

        const shortRgbaColor: ColorRGBA = getColorRGBA(500,26,127,111);
        expect(shortRgbaColor.r).to.equal(0xF4);
        expect(shortRgbaColor.g).to.equal(0x1A);
        expect(shortRgbaColor.b).to.equal(0x7f);
        expect(shortRgbaColor.a).to.equal(0x6F)

        const nonIntRgbColor: ColorRGB = getColorRGB(27.5, 500.33, 128.99999);
        expect(nonIntRgbColor.r).to.equal(27);
        expect(nonIntRgbColor.g).to.equal(244);
        expect(nonIntRgbColor.b).to.equal(128);

        const nonIntRgbaColor: ColorRGBA = getColorRGBA(27.5, 500.33, 128.99999, -99);
        expect(nonIntRgbaColor.r).to.equal(27);
        expect(nonIntRgbaColor.g).to.equal(244);
        expect(nonIntRgbaColor.b).to.equal(128);
        expect(nonIntRgbaColor.a).to.equal(99);

    })


});