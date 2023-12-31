import '../style.css'
import { io } from "socket.io-client";

const socket = io("https://xo-10iq.onrender.com");
//const socket = io("http://localhost:3000");


var currentPlayer = "X";
var player;
var roomID;
var loading = false
var winplayer;
var AI_PLAYER = 'O'
var HUMAN_PLAYER = 'X'

function copyText() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = '<i class="fa-solid fa-check"></i>';
  var copyText = document.getElementById("idTag");
  navigator.clipboard.writeText(copyText.innerText);
}

const makeRandomId = (length) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}



document.querySelector('#copyBtn').onclick = copyText

const input = document.querySelector("input");
document.querySelector("#form1").addEventListener("submit", (e) => {
  e.preventDefault();
  roomID = input.value
  socket.emit("roomJoin", input.value);
});

socket.on('roomJoined', (success) => {
  if (success.success === true) document.getElementById('playerInfo').innerText = "You are playing as " + success.player
  player = success.player
})

socket.on("gameStarted", (id) => {
  roomID = id
  startGame()
})




document.querySelector('#form4').addEventListener('submit', (e) => {
  e.preventDefault()
  startGameAI()
  player = 'X'


})

document.querySelector('#form3').addEventListener('submit', (e) => {
  e.preventDefault()
  document.getElementById('search').innerText = 'Searching...'
  const id = makeRandomId(4)
  socket.emit("random", id)
  roomID = id

})


document.querySelector('#form2').addEventListener('submit', (e) => {
  e.preventDefault()
  const id = makeRandomId(4)
  socket.emit("roomhost", id)
  roomID = id
  document.querySelector('#idTag').innerText = id
  document.querySelector('#idDiv').classList.remove('hidden')
})

function startGame() {
  document.querySelector('#formDiv').classList.add('hidden')
  createBoard(vals);
  playerInput();
  playerTag.innerText = "X's Turn";
  document.getElementById('formChat').classList.remove('hidden')
  document.getElementById('messageWindow').classList.remove('hidden')

}

function startGameAI() {
  document.querySelector('#formDiv').classList.add('hidden')
  createBoard(vals);
  playerInputAI();
  playerTag.innerText = "X's Turn";
}

const board = document.querySelector("#root");
const playerTag = document.querySelector("#playerTag");

var vals = [];

function createBoard(vals) {
  if (document.querySelector(".row")) return false;
  let a = 0;
  for (let i = 0; i < 3; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < 3; j++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", "s" + a);
      vals[a] = " ";
      a++;
      row.appendChild(square);
    }
    board.append(row);
  }
  return true;
}

socket.on("boardChange", (newboard) => {
  changePlayer()
  updateBoard(newboard);
  if (checkWinner(vals)) {
    currentPlayer === 'X' ? winplayer = 'O' : winplayer = 'X'
    playerTag.innerHTML = winplayer + " Wins";
    document.querySelectorAll(".square").forEach((elem) => {
      elem.removeEventListener("click", changeBoardIcon);

    });
    return;
  }
  if (isBoardFull(vals)) {
    playerTag.innerHTML = "Its a Tie";

    return;
  }
});



function updateBoard(board) {
  let a = 0;
  let row = document.querySelectorAll(".row");
  for (let i = 0; i < 3; i++) {
    let square = row[i].childNodes;
    for (let j = 0; j < 3; j++) {
      square[j].innerHTML = board[a];
      vals[a] = board[a];
      a++;
    }
  }
}

function playerInput() {
  document.querySelectorAll(".square").forEach((square) => {
    square.addEventListener("click", changeBoardIcon);
  });
}

function playerInputAI() {
  document.querySelectorAll(".square").forEach((square) => {
    square.addEventListener("click", changeBoardIconAI);
  });
}

//****Refactor****//

function changeBoardIcon(e) {
  if (currentPlayer === player) {
    if (vals[e.target.id[1]] === " ") {
      document.querySelector(`#${e.target.id}`).innerHTML = currentPlayer;
      vals[e.target.id[1]] = currentPlayer;
      changePlayer();
      socket.emit("playerInput", vals, roomID);
      currentPlayer === 'X' ? winplayer = 'O' : winplayer = 'X'
      if (checkWinner(vals)) {
        playerTag.innerHTML = winplayer + " Wins";
        document.querySelectorAll(".square").forEach((elem) => {
          elem.removeEventListener("click", changeBoardIcon);

        });
        return;
      }
      if (isBoardFull(vals)) {
        playerTag.innerHTML = "Its a Tie";

        return;
      }
    }
  }
}

function changeBoardIconAI(e) {
  if (currentPlayer === player) {
    if (vals[e.target.id[1]] === " ") {
      document.querySelector(`#${e.target.id}`).innerHTML = currentPlayer;
      vals[e.target.id[1]] = currentPlayer;
      changePlayer();
      socket.emit("playerInput", vals, roomID);
      currentPlayer === 'X' ? winplayer = 'O' : winplayer = 'X'
      if (checkWinner(vals)) {
        playerTag.innerHTML = winplayer + " Wins";
        document.querySelectorAll(".square").forEach((elem) => {
          elem.removeEventListener("click", changeBoardIconAI);

        });
        return;
      }
      if (isBoardFull(vals)) {
        playerTag.innerHTML = "Its a Tie";

        return;
      }
      setTimeout(() => { getcomputerMove() }, 500)
    }
  }
}

function getcomputerMove() {

  const move = findBestMove(vals)
  if (vals[move] === " ") {
    document.querySelector(`#s${move}`).innerHTML = currentPlayer;
    vals[move] = currentPlayer;
    changePlayer();
    currentPlayer === 'X' ? winplayer = 'O' : winplayer = 'X'
    if (checkWinner(vals)) {
      playerTag.innerHTML = winplayer + " Wins";
      document.querySelectorAll(".square").forEach((elem) => {
        elem.removeEventListener("click", changeBoardIconAI);

      });

      return;
    }
    if (isBoardFull(vals)) {
      playerTag.innerHTML = "Its a Tie";

      return;
    }
    return
  }

}






function checkWinner(allVals) {
  //check horizontal

  if (
    allVals[0] === allVals[1] &&
    allVals[1] === allVals[2] &&
    allVals[0] !== " "
  ) {
    changeWinSquareColor("s" + 0, "s" + 1, "s" + 2);
    return true;
  }
  if (
    allVals[3] === allVals[4] &&
    allVals[4] === allVals[5] &&
    allVals[5] !== " "
  ) {
    changeWinSquareColor("s" + 3, "s" + 4, "s" + 5);
    return true;
  }
  if (
    allVals[6] === allVals[7] &&
    allVals[7] === allVals[8] &&
    allVals[8] !== " "
  ) {
    changeWinSquareColor("s" + 6, "s" + 7, "s" + 8);
    return true;
  }

  //check vertical

  if (
    allVals[0] === allVals[3] &&
    allVals[3] === allVals[6] &&
    allVals[6] !== " "
  ) {
    changeWinSquareColor("s" + 0, "s" + 3, "s" + 6);
    return true;
  }
  if (
    allVals[1] === allVals[4] &&
    allVals[4] === allVals[7] &&
    allVals[7] !== " "
  ) {
    changeWinSquareColor("s" + 4, "s" + 1, "s" + 7);
    return true;
  }
  if (
    allVals[2] === allVals[5] &&
    allVals[5] === allVals[8] &&
    allVals[8] !== " "
  ) {
    changeWinSquareColor("s" + 5, "s" + 8, "s" + 2);
    return true;
  }

  //check diagnal

  if (
    allVals[0] === allVals[4] &&
    allVals[4] === allVals[8] &&
    allVals[8] !== " "
  ) {
    changeWinSquareColor("s" + 0, "s" + 4, "s" + 8);
    return true;
  }
  if (
    allVals[2] === allVals[4] &&
    allVals[4] === allVals[6] &&
    allVals[6] !== " "
  ) {
    changeWinSquareColor("s" + 4, "s" + 6, "s" + 2);
    return true;
  }

  return false;
}

//Change Player
function changePlayer() {
  if (currentPlayer === "X") {
    currentPlayer = "O";
    playerTag.innerHTML = "O's Turn";
  } else {
    currentPlayer = "X";
    playerTag.innerHTML = "X's Turn";
  }
}

//UTILs

//Display Winning Sqaures
function changeWinSquareColor(id1, id2, id3) {
  document.querySelector("#" + id1).style.backgroundColor = "yellow";
  document.querySelector("#" + id2).style.backgroundColor = "yellow";
  document.querySelector("#" + id3).style.backgroundColor = "yellow";
}

//Check Tie
function checkTie() {
  if (isBoardFull(vals)) {
    return false;
  }
  return true;
}

//Check Board is full
function isBoardFull(allVals) {
  let result = allVals.includes(" ") ? false : true;
  return result;
}



//Restart 
document.getElementById('restart').addEventListener('click', () => {
  window.location.reload()
})


////////////*************///
var AI_PLAYER = 'O'
var HUMAN_PLAYER = 'X'

//Minimax

function minimax(board, depth, isMaximizingPlayer) {
  if (isBoardFull(board) || checkWinAI(board)) {
    return evaluateBoard(board);
  }

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === ' ') {
        board[i] = AI_PLAYER;
        const eVal = minimax(board, depth + 1, false);
        board[i] = ' ';
        maxEval = Math.max(maxEval, eVal);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === ' ') {
        board[i] = HUMAN_PLAYER;
        const eVal = minimax(board, depth + 1, true);
        board[i] = ' ';
        minEval = Math.min(minEval, eVal);
      }
    }
    return minEval;
  }
}

//Returns Best move
function findBestMove(board) {
  let bestMove = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === ' ') {
      board[i] = AI_PLAYER;
      const moveScore = minimax(board, 0, false);
      board[i] = ' ';
      console.log(bestMove)
      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

//Eval

function evaluateBoard(board) {
  // Define winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
  ];

  // Check for wins
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] === AI_PLAYER && board[b] === AI_PLAYER && board[c] === AI_PLAYER) {
      return 10; // AI wins
    } else if (board[a] === HUMAN_PLAYER && board[b] === HUMAN_PLAYER && board[c] === HUMAN_PLAYER) {
      return -10; // Human wins
    }
  }

  return 0; // Draw or no winner yet
}

//Check Winner

function checkWinAI(allVals) {
  //check horizontal

  if (
    allVals[0] === allVals[1] &&
    allVals[1] === allVals[2] &&
    allVals[0] !== " "
  ) {
    return true;
  }
  if (
    allVals[3] === allVals[4] &&
    allVals[4] === allVals[5] &&
    allVals[5] !== " "
  ) {
    return true;
  }
  if (
    allVals[6] === allVals[7] &&
    allVals[7] === allVals[8] &&
    allVals[8] !== " "
  ) {
    return true;
  }

  //check vertical

  if (
    allVals[0] === allVals[3] &&
    allVals[3] === allVals[6] &&
    allVals[6] !== " "
  ) {
    return true;
  }
  if (
    allVals[1] === allVals[4] &&
    allVals[4] === allVals[7] &&
    allVals[7] !== " "
  ) {
    return true;
  }
  if (
    allVals[2] === allVals[5] &&
    allVals[5] === allVals[8] &&
    allVals[8] !== " "
  ) {
    return true;
  }

  //check diagnal

  if (
    allVals[0] === allVals[4] &&
    allVals[4] === allVals[8] &&
    allVals[8] !== " "
  ) {
    return true;
  }
  if (
    allVals[2] === allVals[4] &&
    allVals[4] === allVals[6] &&
    allVals[6] !== " "
  ) {
    return true;
  }

  return false;
}


///Chat

document.getElementById('formChat').onsubmit = handleChatSubmit
const chatInput = document.getElementById('chatInput')


function handleChatSubmit(e) {
  e.preventDefault()
  socket.emit('messageSend', {
    user: player,
    content: chatInput.value
  }, roomID)
  chatInput.value = ""

}

socket.on('messages', message => {
  const chat = document.createElement('p')
  const avatar = document.createElement('p')

  chat.innerHTML = `Player ${message.user}: ${message.content}`

  const messageDiv = document.createElement('div')
  messageDiv.classList.add('flex')
  messageDiv.classList.add('justify-around')
  messageDiv.classList.add('items-center')
  messageDiv.classList.add('gap-2')


  //messageDiv.appendChild(avatar)
  messageDiv.appendChild(chat)



  document.getElementById('messageWindow').prepend(messageDiv)
})


