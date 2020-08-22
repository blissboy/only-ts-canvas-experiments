import {
    getRandomInt,
    validateNotNan,
    limitCoordinateToBoundary,
    greaterThan,
    lessThan,
    getReflection, negXAxis, posXAxis, posYAxis, negYAxis,
    //negXAxis
} from "../utils";
import {expect} from 'chai';
import Victor from "victor";
import {Int, roundToInt} from "../types";
import exp from "constants";
var Victor1 = require('victor');

describe('test validateNotANan', () => {

    it('should return true for numbers', () => {
        expect(validateNotNan([64, 61, 38])).to.be.true;
    });

    it('should return false for non-numbers', () => {
        // @ts-ignore('intended test with wrong types')
        expect(validateNotNan(['dog', 'cat', 'fred'])).to.be.false;
    });

    it('should return false for undefined and non-numbers', () => {
        // @ts-ignore('intended test with wrong types')
        expect(validateNotNan(['dog', undefined, 'fred'])).to.be.false;
    });

    it('should return false for undefined only', () => {
        // @ts-ignore('intended test with wrong types')
        expect(validateNotNan([undefined])).to.be.false;
    });

    it('should return false for undefined with numbers', () => {
        // @ts-ignore('intended test with wrong types')
        expect(validateNotNan([9, 10, -10000000, undefined])).to.be.false;
    });

    it('should return true for big numbers', () => {
        // @ts-ignore('intended test with wrong types')
        expect(validateNotNan([9, 10, -100000000000000000000000])).to.be.true;
    });

    it('should return false with NaN included', () => {
        // @ts-ignore('intended test with wrong types')
        expect(validateNotNan([9, 10, NaN])).to.be.false;
    });

    it('0 is a number', () => {
        // @ts-ignore('intended test with wrong types')
        expect(validateNotNan([0, 707, 621, 1280, 960])).to.be.true;
    });

    it('getRandomInt returns mins, max-1, and not max', () => {
        const min = 0;
        const max = 10;
        let gotMin: boolean = false;
        let gotMax: boolean = false;
        let gotMaxMinus1: boolean = false;
        let rando: number;
        for (let i: number = 0; i < 1000; i++) {
            rando = getRandomInt(max, min);
            if (rando === min) {
                gotMin = true;
            } else if (rando === max - 1) {
                gotMaxMinus1 = true;
            } else if (rando === max) {
                gotMax = true;
            }
        }
        expect(!gotMax && gotMin && gotMaxMinus1, `it is very unlikely to not get a min(${gotMin}) and a max minus one(${gotMaxMinus1}) random value. Also should never receive max(${gotMax})`).to.be.true;
    });


});


describe('test getReflection', () => {

    it('x less than 0 should reflect back', () => {
        expect(limitCoordinateToBoundary(-4 as Int, roundToInt(0 as Int), lessThan)).to.equal(4);
    });
    it('x greater than 100 should reflect back', () => {
        expect(limitCoordinateToBoundary(104 as Int, 100 as Int, greaterThan)).to.equal(96);
    });

    /**
     *    \
     *     \
     *      \
     *      /
     *     /
     */
    it( 'incoming (moving positive X) should reflect outgoing off y axis', () => {
        const incoming: Victor = new Victor1(6,-4);
        const reflection: Victor = getReflection(incoming, negXAxis);
        expect(reflection.x).to.equal(-6);
        expect(reflection.y).to.equal(-4);
    });
    /**
     *     /
     *    /
     *    \
     *     \
     *      \
     */
    it( '45 degree incoming (moving neg X) should reflect to 45 outgoing off y axis', () => {
        const incoming: Victor = new Victor1(-5,-1);
        const reflection: Victor = getReflection(incoming, posXAxis);
        expect(reflection.x).to.equal(5);
        expect(reflection.y).to.equal(-1);
    });

    /**
     *  \     /
     *   \   /
     *    \ /
     *     v
     */

    it( '45 degree incoming (moving neg Y) should reflect to 45 outgoing off x axis', () => {
        const incoming: Victor = new Victor1(6,-4);
        const reflection: Victor = getReflection(incoming, posYAxis);
        expect(reflection.x).to.equal(6);
        expect(reflection.y).to.equal(4);
    });
    /**
     *      ^
     *     / \
     *   /    \
     * /       \
     */
    it( 'incoming (moving pos Y) should reflect outgoing off x axis', () => {
        const incoming: Victor = new Victor1(-6,4);
        const reflection: Victor = getReflection(incoming, negYAxis);
        expect(reflection.x).to.equal(-6);
        expect(reflection.y).to.equal(-4);
    });

    it('test reflect does not affect original values', () => {

        const incoming: Victor = new Victor1(-6,4);
        const incomingCopy: Victor = incoming.clone();

        const axisCopy: Victor = negYAxis.clone();

        const reflection: Victor = getReflection(incoming, negYAxis);
        expect(reflection.x).to.equal(-6);
        expect(reflection.y).to.equal(-4);

        expect(incoming).to.deep.equal(incomingCopy);
        expect(negYAxis).to.deep.equal(axisCopy);

    });


});