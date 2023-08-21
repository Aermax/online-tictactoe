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
