import {ColorRGB, ColorRGBA, getColorRGB, getColorRGBA, getColorRGBAFromNumber, getColorRGBFromNumber} from "./types";
import {expect} from "chai";

describe('test color utils', () => {

    const whiteNoAlpha: ColorRGB = getColorRGB(0xff, 0xff, 0xff);
    const whiteAlpha50: ColorRGBA = getColorRGBA(0xff, 0xff, 0xff,0x80);
    const redNoAlpha: ColorRGB = getColorRGB(0xff, 0x00, 0xf00);
    const redAlpha50: ColorRGBA = getColorRGBA(0xff, 0x00, 0x00,0x80);
    const whiteHexFullAlpha: string = `#ffffffff`;

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

    it('fromHex RGBA should convert #ffffffff ', () => {

        //expect(ColorRGBA.fromHex())
    })

    it('single number constructors should create 0xFFAABB as correct color', () => {
        const colorAsRGB: number = 0xFFAABB;
        const rgbColor: ColorRGB = getColorRGBFromNumber(colorAsRGB);
        expect(rgbColor.r == 0xFF);
        expect(rgbColor.g == 0xAA);
        expect(rgbColor.b == 0xBB);
        const rgbaColor: ColorRGBA = getColorRGBAFromNumber(colorAsRGB);
        expect(rgbaColor.r == 0xFF);
        expect(rgbaColor.g == 0xAA);
        expect(rgbaColor.b == 0xBB);
        expect(rgbaColor.a == 0xFF)
    })


});