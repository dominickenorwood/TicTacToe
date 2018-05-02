// Board can grow depending on size input.
// Size input calculation: (s * s)
// [[-1, -1, -1],
//  [-1, -1, -1],
//  [-1, -1, -1]]
class NullMatrix {
    constructor(size){
        this.size = size;
    }
  
    get render(){
        const _board = [];
        let _count = 0;
  
        // Fill board with rows
        for(let i = 0; i < this.size; i++){
            _board.push([]);
        }
  
        // Fill each row with a -1
        while(_count < this.size){
            for(let i = 0; i < this.size; i++){
                _board[i].push(-1);
            }
            _count++;
        }
  
        return _board;
    }
}

export default NullMatrix;