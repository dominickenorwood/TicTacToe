
class GameBoardUI {
    constructor(size){
        this.size = size;
        this.classes = {
            board: 'game-board',
            block: 'game-board__block',
            player_one: 'player-one',
            player_two: 'player-two',
            winner: 'u-winner',
            button: 'game-button',
            pieces: {
                circle: 'game-board__piece--circle',
                cross: 'game-board__piece--cross'
            }
        }
        this.pieces = {
            circle: `<div class="${this.classes.pieces.circle}"><span></span></div>`,
            cross: `<div class="${this.classes.pieces.cross}"><span></span><span></span></div>`
        }
    }
  
    removeChildren(element) {
        while(element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }
  
    // Add element to board
    addElement(element, content) {
        element.innerHTML = content;
    }
  
    // Add class to element
    addClass(element, className) {
        element.classList.add(className);
    }
  
    // Calculate padding needed for cells
    get percentage() {
        const _num = 100 / this.size;
        return _num.toFixed(2);
    }
  
    // Adds blocks / cells to game board
    get buildCells() {
        const _cells = [];
        for(let i = 0; i < Math.pow(this.size, 2); i++){
            _cells.push(`<div class="${this.classes.block}" style="padding:0 ${this.percentage}% ${this.percentage}% 0;"></div>`);
        }
  
        return _cells.join('');
    }
  
    get render(){
        return (`
                <div class="${this.classes.board}">${this.buildCells}</div>
                <div class="${this.classes.button}"></div>
             `);
    }
}

export default GameBoardUI;