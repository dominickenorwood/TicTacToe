
import TicTacToe from './TicTacToe';
const gameConfig = {size : 3, bootstrap: document.getElementById('game') };
const game = new TicTacToe(gameConfig);
const gameMatrix = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]

describe('Tic-Tac-Toe [Class]', () => {
    test('... is a class.', () => {
        expect(typeof TicTacToe.prototype.constructor).toEqual('function');
    })  

    test('... has properties "config" and "abstracts".', () => {
        expect(game.config).toEqual(gameConfig);
        expect(typeof game.abstracts).toEqual('object');
    })

    test('... has default state.', () => {
        expect(typeof game.state).toEqual('object');
        expect(game.state.player1_turn).toEqual(0);
        expect(game.state.player2_turn).toEqual(0);
        expect(game.state.current_player).toEqual(1);
        expect(game.state.turns).toEqual(9);
        expect(game.state.matrix).toEqual(gameMatrix);
    })

    test('... has a game board UI.', () => {
        expect(typeof game.boardUI).toEqual('object');
    })

    test('... is binding its callback functions.', () => {
        expect(typeof game.blockClicked).toEqual('function');
        expect(typeof game.resetButtonClicked).toEqual('function');
    })
});

describe('Tic-Tac-Toe [Promises]', () => {
    const temp = new TicTacToe(gameConfig);

    describe('... updateMatrix()', () => {
        test('... was able to update matrix.', () => {
            const answer = [[1, -1, -1], [-1, -1, -1], [-1, -1, -1]]
            return temp.updateMatrix(0)
                .then(result => expect(result).toEqual(answer));
        });
        
        test('... was NOT able to update matrix.', () => {
            return temp.updateMatrix(0)
                .catch(error => expect(error).toBeDefined());
        })
    });

    describe('... lineCheck() 3 out of 3 rows', () => {
        test('... found matching row 1.', () => {
            temp.state.matrix = [[0, 0, 0], [-1, -1, -1], [-1, -1, -1]];
            return temp.lineCheck(0, 'row')
                .catch(error => expect(error).toEqual([0, 1, 2]))
        });

        test('... found matching row 2.', () => {
            temp.state.matrix = [[-1, -1, -1], [0, 0, 0], [-1, -1, -1]];
            return temp.lineCheck(0, 'row')
                .catch(error => expect(error).toEqual([3, 4, 5]))
        });

        test('... found matching row 3.', () => {
            temp.state.matrix = [[-1, -1, -1], [-1, -1, -1], [0, 0, 0]];
            return temp.lineCheck(0, 'row')
                .catch(error => expect(error).toEqual([6, 7, 8]))
        });

        test('... did NOT find a matching row.', () => {
            temp.state.matrix = [[0, 0, -1], [0, -1, -1], [0, 0, -1]];
            return temp.lineCheck(0, 'row')
                .then(result => expect(result).toBeFalsy());
        });
    });


    describe('... lineCheck() 3 out of 3 columns', () => {
        test('... found matching column 1.', () => {
            temp.state.matrix = [[0, -1, -1], [0, -1, -1], [0, -1, -1]];
            return temp.lineCheck(0, 'column')
                .catch(error => expect(error).toEqual([0, 3, 6]))
        });

        test('... found matching column 2.', () => {
            temp.state.matrix = [[-1, 0, -1], [-1, 0, -1], [-1, 0, -1]];
            return temp.lineCheck(0, 'column')
                .catch(error => expect(error).toEqual([1, 4, 7]))
        });

        test('... found matching column 3.', () => {
            temp.state.matrix = [[-1, -1, 0], [-1, -1, 0], [-1, -1, 0]];
            return temp.lineCheck(0, 'column')
                .catch(error => expect(error).toEqual([2, 5, 8]))
        });

        test('... did NOT find a matching column.', () => {
            temp.state.matrix = [[0, 0, 0], [0, -1, 0], [-1, -1, -1]];
            return temp.lineCheck(0, 'column')
                .then(result => expect(result).toBeFalsy());
        });
    });

    describe('... diagnolCheck()', () => {

        test('... found match from top left to bottom right.', () => {
            temp.state.matrix = [[0, -1, -1], [-1, 0, -1], [-1, -1, 0]];
            return temp.diagnolCheck(0)
                .catch(error => expect(error).toEqual([0, 4, 8]))
        });

        test('... found match from top right to bottom left.', () => {
            temp.state.matrix = [[-1, -1, 0], [-1, 0, -1], [0, -1, -1]];
            return temp.diagnolCheck(0)
                .catch(error => expect(error).toEqual([6, 4, 2]))
        });

        test('... did NOT find a match.', () => {
            temp.state.matrix = [[0, -1, 0], [-1, 0, -1], [-1, -1, -1]];
            return temp.diagnolCheck(0)
                .then(result => expect(result).toBeFalsy());
        });
    });

});

describe('Tic-Tac-Toe [Utilities]', () => {
    const temp = new TicTacToe(gameConfig);

    test('... get playerClass()', () => {
        expect(temp.playerClass).toEqual('player-one');
    });

    test('... get playerTurn()', () => {
        expect(temp.playerTurn).toEqual(0);
    });

    test('... updateCurrentPlayer() for player 1.', () => {
        temp.updateCurrentPlayer();
        expect(temp.state.current_player).toEqual(0);
        expect(temp.state.player1_turn).toEqual(1);
    });

    test('... updateCurrentPlayer() for player 2.', () => {
        temp.updateCurrentPlayer();
        expect(temp.state.current_player).toEqual(1);
        expect(temp.state.player2_turn).toEqual(1);
    });
});

describe('Tic-Tac-Toe [Functions]', () => {
    const temp = new TicTacToe(gameConfig);
    const defaultState = {
        player1_turn: 0,
        player2_turn: 0,
        current_player: 1,
        turns: 9,
        matrix: [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]
    };

    test('... able to resetStat()', () => {
        const tempState = {
            player1_turn: 2,
            player2_turn: 2,
            current_player: 0,
            turns: 8,
            matrix: [[-1, -1, -1], [0, 0, 0], [-1, -1, -1]]
        };

        temp.state = tempState;
        temp.resetState();
        expect(temp.state).toEqual(defaultState);
    });

    test('... has gameStatus()', () => {
        expect(typeof temp.gameStatus).toEqual('function');
    });

    test('... has resetGame()', () => {
        expect(typeof temp.resetGame).toEqual('function');
    });

    test('... has render()', () => {
        expect(typeof temp.render).toEqual('function');
    });

});

describe('Tic-Tac-Toe [Events]', () => {
    const temp = new TicTacToe(gameConfig);
    

    test('... has resetButtonClicked()', () => {
        expect(typeof temp.resetButtonClicked).toEqual('function');
    });

    test('... has blockClicked()', () => {
        expect(typeof temp.blockClicked).toEqual('function');
    });

    test('... has removeDocumentListener()', () => {
        expect(typeof temp.removeDocumentListener).toEqual('function');
    });

    test('... has addDocumentListener()', () => {
        expect(typeof temp.addDocumentListener).toEqual('function');
    });
});