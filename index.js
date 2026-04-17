const pieces={
    w_k: "♔", w_q: "♕", w_r: "♖", w_b: "♗", w_kn: "♘", w_p: "♙",
    b_k: "♚", b_q: "♛", b_r: "♜", b_b: "♝", b_kn: "♞" ,b_p: "♟"
};

const whitePiecesList=["♔", "♕", "♖", "♗", "♘", "♙"];
const blackPiecesList=["♚", "♛", "♜", "♝", "♞", "♟"]
const pieceImages = {
    "♔": "images/w_king.png", "♕": "images/w_queen.png", "♖": "images/w_rook.png", 
    "♗": "images/w_bishop.png", "♘": "images/w_knight.png", "♙": "images/w_pawn.png",
    "♚": "images/b_king.png", "♛": "images/b_queen.png", "♜": "images/b_rook.png", 
    "♝": "images/b_bishop.png", "♞": "images/b_knight.png", "♟": "images/b_pawn.png"
};

let boardBody= document.getElementById("board-body");
//state variables
let selectedSquare= null;
let gameStarted= false;
let gameType= "";
let currentTurn= "white";
let whiteTime=300;
let blackTime= 300;
let timerInterval= null;
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
        let tr= document.createElement('tr');
        const rowLabel= document.createElement('th');
        rowLabel.innerText= 8-i;
        tr.appendChild(rowLabel);
        const currentRow= board[i];
        for(let j=0; j < currentRow.length; j++){ 
            const td= document.createElement('td'); //table_data cells created for playable sqrs
            let piece= currentRow[j];
            td.dataset.piece= piece;
            td.dataset.row = i;
            td.dataset.col = j;
            if (piece!==""){
                let img= document.createElement("img");
                img.src= pieceImages[piece];
                td.appendChild(img);
            }
            td.onclick= function(){
                handleSquareClick(td);
            };
            tr.appendChild(td);
        }
        boardBody.appendChild(tr);
    }
    
}
function updateTimerDisplay(){
    let wMin= Math.floor(whiteTime/60);
    let wSec=whiteTime%60;
    let bMin= Math.floor(blackTime/60);
    let bSec=blackTime%60;

    document.getElementById("timer-white").innerText = "White: " + wMin + ":" + (wSec < 10 ? "0" : "") + wSec;
    document.getElementById("timer-black").innerText = "Black: " + bMin + ":" + (bSec < 10 ? "0" : "") + bSec;
}
function startClocks(){
    if (timerInterval !== null) clearInterval(timerInterval);
    timerInterval= setInterval(function(){
        if(gameStarted){
            if(currentTurn==="white"){
                whiteTime--;
            }else{
                blackTime--;
            }
            updateTimerDisplay();
            if(whiteTime<=0|| blackTime<=0){
                clearInterval(timerInterval);
                gameStarted=false;
                alert("Time is up! GAME OVER.");

            }
        }
    }, 1000);
}
function startGame(type){
    gameStarted= true;
    gameType= type;
    currentTurn="white";
    if(type=== "blitz"){
        document.getElementById("timer-container").style.display="block";
        whiteTime=300;
        blackTime=300;
        updateTimerDisplay();
        startClocks();
    }else{
        document.getElementById("timer-container").style.display="block";
        whiteTime=5400;
        blackTime=5400;
        updateTimerDisplay();
        startClocks();
    }
    alert(`Game Started! ${type}  mode activated. White's Turn`);
}

function restartGame(){
    location.reload();
}

function forfeitGame(){
    if (!gameStarted)
        return;
    alert(`${currentTurn} has forfeited. Game Over!`);
    gameStarted=false;
}
function offerDraw() {
    if (!gameStarted) return;
    
    alert("Players have agreed to a Draw!! Game Over.");
    gameStarted = false;
    clearInterval(timerInterval);
}
//tactical radar
function isPathClear(startRow, startCol, endRow, endCol) {
    let rowStep = Math.sign(endRow - startRow);
    let colStep = Math.sign(endCol - startCol);
    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;

    while (currentRow !== endRow || currentCol !== endCol) {
        
        let square = document.querySelector(`td[data-row='${currentRow}'][data-col='${currentCol}']`);
        if (square.dataset.piece!== "") {
            return false; 
        }
        currentRow += rowStep;
        currentCol += colStep;
    }

    return true; 
}

function isValidMove(startSquare, targetSquare){
    let piece= startSquare.dataset.piece
    let startRow= +startSquare.dataset.row;
    let startCol= +startSquare.dataset.col;
    let endRow= +targetSquare.dataset.row;
    let endCol= +targetSquare.dataset.col;
    let rowDiff= Math.abs(startRow- endRow);//returns absolute value of num
    let colDiff= Math.abs(startCol- endCol);
    //knight moves in L shape, any direction,if it takes 2steps first , 
    //1step for final pos and vice-versa
    if(piece==="♘"|| piece==="♞"){
        if((rowDiff===2 && colDiff===1) || (rowDiff===1 && colDiff===2)){
            return true;
        }else{
            return false;
        }
    }
    //king r1c1 any direction rc_diff <=1??
    if (piece === "♔" || piece === "♚") {
        if (rowDiff <= 1 && colDiff <= 1) {
            return true;
        } else {
            return false;
        }
    }
    //rook rc==same
    if (piece === "♖" || piece === "♜") {
        if (rowDiff === 0 || colDiff === 0) {
            return true;
        } else {
            return false;
        }
    }
    if (piece === "♗" || piece === "♝") {
        if (rowDiff === colDiff) {
            return true;
        } else {
            return false;
        }
    }
    //rook+bishop==queen
    if (piece === "♕" || piece === "♛") {
        if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
            return true;
        } else {
            return false;
        }
    }
    //The pawns can move to the squares in front of them(1space forward& 2space).
    //also it can diagnoally capture.
    if(piece === "♙"){
        if(startCol===endCol && startRow-endRow === 1 && targetSquare.dataset.piece=== ""){
            return true;
        }
        if(startCol===endCol && startRow === 6 && startRow-endRow === 2 && targetSquare.dataset.piece=== ""){
            return isPathClear(startRow, startCol, endRow, endCol);
        }
        if(rowDiff=== 1 && colDiff === 1 && startRow-endRow === 1 && targetSquare.dataset.piece!== ""){
            return true;
        }
        return false;    
    }
    if(piece==="♟"){
        if(startCol===endCol && endRow-startRow === 1 && targetSquare.dataset.piece=== ""){
            return true;
        }
        if(startCol===endCol && startRow === 1 && endRow-startRow === 2 && targetSquare.dataset.piece=== ""){
            return isPathClear(startRow, startCol, endRow, endCol);
        }
        if(rowDiff === 1 && colDiff === 1 && endRow-startRow === 1 && targetSquare.dataset.piece!== ""){
            return true;
        }
        return false;
    }
    return false;
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
        let targetPiece= element.dataset.piece;
        if(currentTurn==="white"&& whitePiecesList.includes(targetPiece)){
            selectedSquare= element;
            return;
        }
        if(currentTurn==="black"&& blackPiecesList.includes(targetPiece)){
            selectedSquare= element;
            return;
        }
        if (!isValidMove(selectedSquare, element)) {
            alert("Invalid move! That piece cannot move there.");
            return;
        }
        if (targetPiece === "♔") {
            alert("Black captures the White King! Black Wins!");
            gameStarted = false; 
            clearInterval(timerInterval);
        } else if (targetPiece === "♚") {
            alert("White captures the Black King! White Wins!");
            gameStarted = false;
            clearInterval(timerInterval);
        }
        element.dataset.piece= selectedSquare.dataset.piece;
        element.innerHTML= selectedSquare.innerHTML;
        selectedSquare.dataset.piece= "";
        selectedSquare.innerHTML="";
        selectedSquare= null;
        let landedRow = +element.dataset.row;
        if (element.dataset.piece === "♙" && landedRow === 0){
            element.dataset.piece = "♕";
            element.innerHTML = `<img src="${pieceImages["♕"]}">`;
            alert("White Pawn promoted to a Queen!");
        }
        else if (element.dataset.piece === "♟" && landedRow === 7){
            element.dataset.piece = "♛";
            element.innerHTML = `<img src="${pieceImages["♛"]}">`;
            alert("Black Pawn promoted to a Queen!");
        }
        currentTurn= (currentTurn==="white")? "black":"white";
        console.log("Turn:  "+ currentTurn);
    }else{
        let pieceClicked= element.dataset.piece;
        if (pieceClicked===""){
            return;
        }
        if (currentTurn==="white" && whitePiecesList.includes(pieceClicked)){
            selectedSquare= element;
        }
        else if(currentTurn==="black" && blackPiecesList.includes(pieceClicked)){
            selectedSquare= element;
        }
        else{
            alert(`It is ${currentTurn}'s turn!! Moving opponent's pieces is against the rules.`);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    createBoard();
});
document.getElementById("btn-standard").addEventListener("click", () => {
    startGame('standard');
});
document.getElementById("btn-blitz").addEventListener("click", () => {
    startGame('blitz');
});
document.getElementById("btn-restart").addEventListener("click", () => {
    restartGame();
});
document.getElementById("btn-forfeit").addEventListener("click", () => {
    forfeitGame();
});
document.getElementById("offer-draw").addEventListener("click", ()=>{
    offerDraw();
})