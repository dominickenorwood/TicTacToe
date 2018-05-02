
import NullMatrix from '../../builders/Matrix/NullMatrix/NullMatrix';
import GameBoardUI from '../../builders/UI/GameBoardUI/GameBoardUI';

class TicTacToe {
    constructor(config) {
        // Component config, properties the Component must have
        // in order to initialize.
        this.config = config;

        // HTML representation of the Component
        this.boardUI = new GameBoardUI(this.config.size);

        // Abstract variables that can change as the definition
        // of the component changes.
        this.abstracts = {
            LINE_ROW : 'row',
            LINE_COL : 'column',
            DRAW : 'draw',
            RESET: 'reset game'
        }

        // Component state, properties that change throughout
        // the components life cycle
        this.state = {
            player1_turn: 0,
            player2_turn: 0,
            current_player: 1,
            turns: Math.pow(this.config.size, 2),
            matrix: new NullMatrix(this.config.size).render
        }

        // Bind callbacks in order to define 'this'.
        this.blockClicked = this.blockClicked.bind(this);
        this.resetButtonClicked = this.resetButtonClicked.bind(this);
    }

    // Return class from game board depeding on current player.
    get playerClass() {
        return this.state.current_player === 1 ? this.boardUI.classes.player_one : this.boardUI.classes.player_two;
    }

    // Return the current players turn count.
    get playerTurn() {
        return this.state.current_player === 1 ? this.state.player1_turn : this.state.player2_turn;
    }

    // Compare current player (1 or 0) to either
    // row or columns index in matrix.
    lineCheck(match, line) {
        return new Promise((resolve, reject) => {
            let _start = 0;
            const _end = this.config.size;

            while(_start < _end){
                const _matches = [];
                for(let i = 0; i < _end; i++){
                    // Check row or column
                    const _pickedLine = (line !== this.abstracts.LINE_COL) ? this.state.matrix[_start][i] : this.state.matrix[i][_start];

                    if( _pickedLine !== match){
                        // If no match found break the loop and start a new line.
                        break;

                    } else {
                        // Match has been found, push flattened index to winning list.
                        const _flatIndex = (line !== this.abstracts.LINE_COL) ? (_start * _end) + i : (i * _end) + _start;
                        _matches.push(_flatIndex);

                        // If a winner is found return list of winning UI element indexes
                        //if(_matches.length === _end) reject(_matches);
                        if(_matches.length === _end) reject(_matches);
                    }
                }

                _start++;
            }

            // If while loop completes no winner is found
            resolve(false);
        });
    }

    // Compare current player (1 or 0) by stepping
    // through matrix from left then right.
    diagnolCheck(match) {
        return new Promise((resolve, reject) => {
            const _matchesLeft = [];
            let _startLeft = 0;
            const _endLeft = this.config.size;

            // Start from the top left and move one right and down
            // if a match is found.
            for(let i = _startLeft; i <= _endLeft; i++){
                if(this.state.matrix[_startLeft][i] !== match) {
                    // If no match is found break loop and move on
                    break;
                } else {
                    // Push match to list of winning flattened indexes
                    // and increment column.
                    _matchesLeft.push((i * _endLeft) + _startLeft);
                    _startLeft++;

                    // If a winner is found return a list of winning UI indexes.
                    if(_matchesLeft.length === _endLeft) reject(_matchesLeft);
                }
            }

            const _matchesRight = [];
            let _startRight = 0;
            const _endRight = this.config.size;

            // Start from the top left and move one left and down
            // if a match is found.
            for(let i = _endRight - 1; i >= 0; i--){
                if(this.state.matrix[_startRight][i] !== match) {
                    break;
                } else {
                    _matchesRight.push((i * _endRight) + _startRight);
                    _startRight++;

                    if(_matchesRight.length === _endRight) reject(_matchesRight);
                }
            }

            resolve(false);
        });
    }

    // Promise to check if Matrix can be updated
    updateMatrix(index) {
        return new Promise((resolve, reject) => {
            // Get index of proposed slot to change.
            const _row = Math.floor(index / this.config.size);
            const _slot = index - (_row * this.config.size);

            // If slot is NOT null then update state's matrix.
            if(this.state.matrix[_row][_slot] === -1){
                const _matrix = [...this.state.matrix];
                _matrix[_row][_slot] = this.state.current_player;
                this.state.matrix = _matrix;
                resolve(this.state.matrix);
            } else {
                reject(`No Move Occupied by ${this.state.current_player === 1 ? 'X' : 'O'}`)
            }
        });
    }

    // Update current player state.
    updateCurrentPlayer() {
        if(this.state.current_player === 1) this.state.player1_turn++;
        else this.state.player2_turn++;
        this.state.current_player = this.state.current_player === 1 ? 0 : 1;
    }

    // Async function that updates the matrix, UI, and checks for a winner.
    async updateBoard(index, element) {
        try {
            const _updateMatrix = await this.updateMatrix(index);

            // Update UI game baord
            const _piece = this.state.current_player === 1 ? this.boardUI.pieces.cross : this.boardUI.pieces.circle;
            this.boardUI.addClass(element, this.playerClass);
            this.boardUI.addElement(element, _piece);

            // If current player has not reached enough turns for winning check
            if(this.playerTurn < this.config.size - 1){
                this.updateCurrentPlayer();
                return false;
            }

            // Disable board until all checks are completed
            this.removeDocumentListener('click', this.blockClicked);
            this.removeDocumentListener('click', this.resetButtonClicked);

            // Check matrix rows
            const _rowCheck = await this.lineCheck(this.state.current_player, this.abstracts.LINE_ROW);

            // Check matrix columns
            const _columnCheck = await this.lineCheck(this.state.current_player, this.abstracts.LINE_COL);

            // Check matrix steps
            const _diagnolCheck = await this.diagnolCheck(this.state.current_player);

            // Check if all turns have been taken and no winner found
            if(this.state.player1_turn + this.state.player2_turn === this.state.turns - 1) return this.abstracts.DRAW;

            // No winner found update player turn
            this.updateCurrentPlayer();

            // Enable board events
            this.addDocumentListener('click', this.blockClicked);
            this.addDocumentListener('click', this.resetButtonClicked);

            return false;
        } catch(error) {
            // If error then a winner has been found;
            return error;
        }
    }

    // Depending on the status end the game or continue
    gameStatus(status) {
    // If status is an array then a winner has been found
        if(Array.isArray(status)){
            console.log('Found a winner');
            this.showWinners(status);
            this.addDocumentListener('click', this.resetButtonClicked);

            // If status is a draw
        } else if(status === this.abstracts.DRAW) {
            console.log('Game is a Draw!');
            this.addDocumentListener('click', this.resetButtonClicked);

        } else if(status) {
            console.log('[Unknown Status]', status);
        }
    }

    // Update UI to highligt winning slots or indexes
    showWinners(list){
        const _game = document.getElementsByClassName(this.boardUI.classes.board)[0];
        for(const index of list){
            _game.childNodes[index].classList.add(this.boardUI.classes.winner)
        }
    }

    // Reset state for new game
    resetState() {
        this.state.player1_turn = 0;
        this.state.player2_turn = 0;
        this.state.current_player = 1;
        this.state.turns = Math.pow(this.config.size, 2);
        this.state.matrix = [...new NullMatrix(this.config.size).render];
    }

    // Reset the game and start a new one
    resetGame() {
    // Remove document event listeners
        this.removeDocumentListener('click', this.blockClicked);
        this.removeDocumentListener('click', this.resetButtonClicked);

        // Empty game board and rebuild a new one.
        const _game = document.getElementsByClassName(this.boardUI.classes.board)[0];
        this.boardUI.removeChildren(_game);
        this.boardUI.addElement(_game, this.boardUI.buildCells);

        // Reset component state to default
        this.resetState();

        // Add document event listeners
        this.addDocumentListener('click', this.blockClicked);
        this.addDocumentListener('click', this.resetButtonClicked);
    }

    // Listen for an element with the class name button
    resetButtonClicked(event) {
        if(event.target.classList.contains(this.boardUI.classes.button)){
            this.resetGame();
        }
    }

    // Listen for an element with the class name block
    blockClicked(event) {
        if(event.target.classList.contains(this.boardUI.classes.block)) {
            // Find the targets child index.
            const _elIndex = [...event.target.parentNode.children].indexOf(event.target);

            // Update game.
            this.updateBoard(_elIndex, event.target)
                .then(result => this.gameStatus(result));
        }
    }

    // Remove or disable event from document
    removeDocumentListener(event, callback) {
        document.removeEventListener(event, callback)
    }

    // Add an event listener to document
    addDocumentListener(event, callback) {
        document.addEventListener(event, callback)
    }

    render() {
    // Build board and set up game button
        this.boardUI.addElement(this.config.bootstrap, this.boardUI.render);
        this.boardUI.addElement(document.getElementsByClassName(this.boardUI.classes.button)[0], this.abstracts.RESET);

        // Add document event listeners
        this.addDocumentListener('click', this.blockClicked);
        this.addDocumentListener('click', this.resetButtonClicked);
    }
}

export default TicTacToe;