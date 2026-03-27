const pieces={
    w_k: "♔", w_q: "♕", w_r: "♖", w_b: "♗", w_kn: "♘", w_p: "♙",
    b_k: "♚", b_q: "♛", b_r: "♜", b_b: "♝", b_kn: "♞" ,b_p: "♟"
};

const boardBody= document.getElementById("board-body");
//state variables
let selectedSquare= null;
let gameStarted= false;
let gameType= "";
let currentTurn= "white";
function createBoard(){
    const board=[
        [pieces.b_r, pieces.b_kn, pieces.b_b, pieces.b_q, pieces.b_k, pieces.b_b, pieces.b_kn, pieces.b_r],
        [pieces.b_p, pieces.b_p, pieces.b_p, pieces.b_p, pieces.b_p, pieces.b_p, pieces.b_p, pieces.b_p],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        [pieces.w_p, pieces.w_p, pieces.w_p, pieces.w_p, pieces.w_p, pieces.w_p, pieces.w_p, pieces.w_p],
        [pieces.w_r, pieces.w_kn, pieces.w_b, pieces.w_q, pieces.w_k, pieces.w_b, pieces.w_kn, pieces.w_r]
    ];

    for(let i=0; i< board.length; i++){
        const tr= document.createElement('tr');
        const rowLabel= document.createElement('th');
        rowLabel.innerText= 8-i;
        tr.appendChild(rowLabel);
        const currentRow= board[i];
        for(let j=0; j < currentRow.length; j++){ 
            const td= document.createElement('td'); //table_data cells created for playable sqrs
            let piece= currentRow[j];
            td.textContent= piece;
            td.onclick= function(){
                handleSquareClick(td);
            };
            tr.appendChild(td);

        }

        boardBody.appendChild(tr);
    }
    
}
/*let selectedSquare= null;
let gameStarted= false;
let gameType= "";
let currentTurn= "white"; for my visual sake */
function startGame(type){
    gameStarted= true;
    gameType= type;
    if(type=== "blitz"){
        document.getElementById("timer-container");
    }
    alert("Game Started!" + type + "mode activated. White's Turn");

}

function restartgame(){
    location.reload();
}

function forfeitGame(){
    if (!gameStarted)
        return;
    alert(currentTurn + " has forfeited. Game Over!");
    gameStarted=false;
}

function handleSquareClick(element){
    if(!gameStarted){
        alert("Please select a game type!");
        return;
    }

    if (selectedSquare!== null){
        if (selectedSquare === element){
            selectedSquare = null;
            return;
        }
        element.textContent= selectedSquare.textContent;
        selectedSquare.textContent= "";
        selectedSquare= null;
        currentTurn= (currentTurn==="white")? "black":"white";
        console.log("Turn:  "+ currentTurn);
    }else{
        if(element.textContent!==""){
            selectedSquare= element;
        }
    }

}
createBoard();





