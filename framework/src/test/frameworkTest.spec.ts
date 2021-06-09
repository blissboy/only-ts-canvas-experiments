import {getNinetyDegreeBounceEdgeDetector, ORIGIN,} from "../utils";
import {expect} from 'chai';
import {EdgeAvoidanceFunction, Int, IntPoint, MovingEntity} from "../types";

var Victor1 = require('victor');

describe('test 90 edge detector', () => {

    const minPoint: IntPoint = ORIGIN;
    const maxPoint: IntPoint = {x: 100 as Int, y: 72 as Int};
    const edgeDetector: EdgeAvoidanceFunction = getNinetyDegreeBounceEdgeDetector(minPoint, maxPoint);

    it('no edge cross should carry on', () => {
        const pointInBounds: MovingEntity = {
            location: {x: 50 as Int, y: 60 as Int},
            velocity: new Victor1(3, 2),
            tick: 0
        }
        const [testLoc, testVel] = edgeDetector(pointInBounds);
        expect(testLoc).to.deep.equal(pointInBounds.location);
        expect(testVel).to.deep.equal(pointInBounds.velocity);
    });

    it('cross x edge should stay in bounds and velocity change', () => {
        const pointOutOfBoundsX: MovingEntity = {
            location: {x: 110 as Int, y: 50 as Int},
            velocity: new Victor1(2, 2),
            tick: 0
        }
        // note, don't test reflection function here, done in utils test
        const [testLoc, testVel] = edgeDetector(pointOutOfBoundsX);
        expect(testLoc.x).to.not.equal(pointOutOfBoundsX.location.x);
        expect(testLoc.y).to.equal(pointOutOfBoundsX.location.y);
        expect(testVel.y).to.equal(pointOutOfBoundsX.velocity.y);
        expect(testVel.x).to.equal(-1 * pointOutOfBoundsX.velocity.x);
    });

    it('cross y edge should stay in bounds and velocity change', () => {
        const pointOutOfBoundsY: MovingEntity = {
            location: {x: 50 as Int, y: 100 as Int},
            velocity: new Victor1(3, 2),
            tick: 0
        }
        // note, don't test reflection function here, done in utils test
        const [testLoc, testVel] = edgeDetector(pointOutOfBoundsY);
        expect(testLoc.x).to.equal(pointOutOfBoundsY.location.x);
        expect(testVel.x).to.equal(pointOutOfBoundsY.velocity.x);
        expect(testLoc.y).to.not.equal(pointOutOfBoundsY.location.y)
        expect(testVel.y).to.equal(-1 * pointOutOfBoundsY.velocity.y);
    });

    it('cross xy edge should stay in bounds and velocity change', () => {
        const pointOutOfBoundsXY: MovingEntity = {
            location: {x: 102 as Int, y: 73 as Int},
            velocity: new Victor1(3, 2),
            tick: 0
        }
        // note, don't test reflection function here, done in utils test
        const [testLoc, testVel] = edgeDetector(pointOutOfBoundsXY);
        expect(testLoc.x).to.not.equal(pointOutOfBoundsXY.location.x);
        expect(testLoc.y).to.not.equal(pointOutOfBoundsXY.location.y);
        expect(testVel.x).to.equal(-1 * pointOutOfBoundsXY.velocity.x);
        expect(testVel.y).to.equal(-1 * pointOutOfBoundsXY.velocity.y);
    });

    it('cross xy edge should stay in bounds and velocity change', () => {
        //     {"x":-7,"y":151} vel and {"x":-8.910564089987199,"y":-6.195215295363949}
        const pointOutOfBoundsXY: MovingEntity = {
            location: {x: -7 as Int, y: 151 as Int},
            velocity: new Victor1(-8.910564089987199, -6.195215295363949),
            tick: 0
        }
        // note, don't test reflection function here, done in utils test
        const [testLoc, testVel] = edgeDetector(pointOutOfBoundsXY);
        expect(testLoc.x).to.not.equal(pointOutOfBoundsXY.location.x);
        expect(testLoc.y).to.not.equal(pointOutOfBoundsXY.location.y);
        expect(testVel.x).to.equal(-1 * pointOutOfBoundsXY.velocity.x);
        expect(testVel.y).to.equal(-1 * pointOutOfBoundsXY.velocity.y);
    });

});

