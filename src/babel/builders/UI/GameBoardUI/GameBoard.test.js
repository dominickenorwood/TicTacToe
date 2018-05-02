import GameBoardUI from './GameBoardUI';
const board = new GameBoardUI(3);

describe('GameBoardUI [Class]', () => {
    test('... is class', () => {
        expect(typeof GameBoardUI.prototype.constructor).toEqual('function');
    })

    test('... has property size, classes and pieces.', () => {
        expect(board.size).toEqual(3);
        expect(board.classes).toBeDefined();
        expect(board.pieces).toBeDefined();
    })
});

describe('GameBoardUI [Functions]', () => {

    test('... has removeChildren()', () => {
        expect(typeof board.removeChildren).toEqual('function');
    });

    test('... has addElement()', () => {
        expect(typeof board.addElement).toEqual('function');
    });

    test('... gets buildCells()', () => {
        expect(typeof board.buildCells).toEqual('string');
    });

    test('... gets render()', () => {
        expect(typeof board.render).toEqual('string');
    });

    test('... gets percentage()', () => {
        expect(board.percentage).toEqual('33.33');
    })
})