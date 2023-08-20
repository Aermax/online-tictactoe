import './style.css'
import { io } from "socket.io-client";

const socket = io("https://xo-10iq.onrender.com");
//const socket = io("http://localhost:3000");


var currentPlayer = "X";
var player;
var roomID;
var loading = false
var winplayer;

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

  //alert("Player: " + player)

})

socket.on("gameStarted", (id) => {
  roomID = id
  startGame()
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
  //alert(currentPlayer)
  updateBoard(newboard);
  if (checkWin(vals)) {
    currentPlayer === 'X' ? winplayer = 'O' : winplayer = 'X'
    playerTag.innerHTML = winplayer + " Wins";
    document.querySelectorAll(".square").forEach((elem) => {
      elem.removeEventListener("click", changeBoardIcon);
    });
    return;
  }
  if (boardIsFull(vals)) {
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

function changeBoardIcon(e) {
  if (currentPlayer === player) {
    if (vals[e.target.id[1]] === " ") {
      document.querySelector(`#${e.target.id}`).innerHTML = currentPlayer;
      vals[e.target.id[1]] = currentPlayer;
      changePlayer();
      socket.emit("playerInput", vals, roomID);
      currentPlayer === 'X' ? winplayer = 'O' : winplayer = 'X'
      if (checkWin(vals)) {
        playerTag.innerHTML = winplayer + " Wins";
        document.querySelectorAll(".square").forEach((elem) => {
          elem.removeEventListener("click", changeBoardIcon);
        });
        return;
      }
      if (boardIsFull(vals)) {
        playerTag.innerHTML = "Its a Tie";
        return;
      }
      // setTimeout(() => { getcomputerMove() }, 500)
    }
  }
}

function changePlayer() {
  if (currentPlayer === "X") {
    currentPlayer = "O";
    playerTag.innerHTML = "O's Turn";
  } else {
    currentPlayer = "X";
    playerTag.innerHTML = "X's Turn";
  }
}

function boardIsFull(allVals) {
  let result = allVals.includes(" ") ? false : true;

  return result;
}

function checkWin(allVals) {
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

function checkTie() {
  if (boardIsFull(vals)) {
    return false;
  }
  return true;
}

function changeWinSquareColor(id1, id2, id3) {
  document.querySelector("#" + id1).style.backgroundColor = "yellow";
  document.querySelector("#" + id2).style.backgroundColor = "yellow";
  document.querySelector("#" + id3).style.backgroundColor = "yellow";
}


