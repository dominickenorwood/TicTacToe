import NullMatrix from './NullMatrix';
const matrix = new NullMatrix(3);
const answer = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];

describe('NullMatrix', () => {
    test('... is class', () => {
        expect(typeof NullMatrix.prototype.constructor).toEqual('function');
    })

    test('... has property size', () => {
        expect(matrix.size).toEqual(3);
    })

    test('... render()', () => {
        expect(matrix.render).toEqual(answer);
    })
})