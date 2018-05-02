import '../sass/index.scss';

import TicTacToe from './components/TicTacToe/TicTacToe';


// Declare a new game.
const game = new TicTacToe({
    size: 3,
    bootstrap: document.getElementById('game')
})
  
// Render and start new game.
game.render();

  