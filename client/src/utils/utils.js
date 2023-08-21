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
