"use strict"

const MINE = "💣"
const FLOOR = " "
const gLevel = {
  SIZE: 6,
  MINES: 2
}

var gBoard
var gGame
var gElSelectedCell = null
function initGame() {
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true
  }
  gBoard = buildBoard()
  renderBoard(gBoard)
  setMinesNegsCount(gBoard)
}

function buildBoard() {
  const board = createMat(gLevel.SIZE, gLevel.SIZE)
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        i,
        j
      }
      board[i][j] = cell
    }
  }
  putMines(board)
  return board
}

function renderBoard(board) {
  var strHTML = ""
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n"
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]
      var cellClass = getClassName({ i, j })
      // currCell.isMine ? (cellClass += " floor ") : (cellClass += " floor")
      cellClass += " floor "
      strHTML += `\t<td data-i="${i}" data-j="${j}" class="cell ${cellClass}" onclick="cellClick(this, ${i},${j})">`
      // if (currCell.isMine) {
      //   strHTML += MINE
      // }
      strHTML += FLOOR
      strHTML += "</td>\n"
    }
    strHTML += "</tr>\n"
  }
  // console.table(strHTML)
  const elBoard = document.querySelector(".board")
  elBoard.innerHTML = strHTML
}

function cellClick(elCell, rowIdx, colIdx) {
  console.log(elCell)
  console.log(+elCell.dataset.i, +elCell.dataset.j)
  // if (
  //   +elCell.dataset.i === gElSelectedCell.i &&
  //   +elCell.dataset.j === gElSelectedCell.j
  // )
  //   return
  var board = gBoard
  if (!gBoard[rowIdx][colIdx].isMine && gGame.isFirstClick) {
    gGame.isFirstClick = false
    gElSelectedCell = gBoard[rowIdx][colIdx]
    console.log(gElSelectedCell.i, gElSelectedCell.j)
  } else {
    elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount
  }
  if (gBoard[rowIdx][colIdx].isMine && gGame.isFirstClick) {
    gElSelectedCell = gBoard[rowIdx][colIdx]
    gGame.isFirstClick = false
    board[rowIdx][colIdx].isMine = false
    elCell.classList.add("revealed")
    elCell.innerText = ""
  } else if (gBoard[rowIdx][colIdx].isMine) {
    elCell.innerText = MINE
    elCell.classList.add("mine")
  }
  expandShown(board, elCell, rowIdx, colIdx)
  elCell.classList.add("revealed")
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currSelectedCell = board[i][j]
      var rowIdx = board[currSelectedCell.i][currSelectedCell.j].i
      var colIdx = board[currSelectedCell.i][currSelectedCell.j].j
      if (currSelectedCell.isMine) continue
      for (var k = rowIdx - 1; k <= rowIdx + 1; k++) {
        if (k < 0 || k >= board.length) continue

        for (var l = colIdx - 1; l <= colIdx + 1; l++) {
          if (l < 0 || l >= board[0].length) continue
          if (k === rowIdx && l === colIdx) continue
          var currCell = board[k][l]
          if (currCell.isMine) currSelectedCell.minesAroundCount++
        }
      }
    }
  }
}

function putMines(board) {
  board[0][0].isMine = true
  board[2][2].isMine = true
  board[3][3].isMine = true

  // board[getRandomInt(0, 4)][getRandomInt(0, 4)].isMine = true
  // board[getRandomInt(0, 4)][getRandomInt(0, 4)].isMine = true
  // board[getRandomInt(0, 4)][getRandomInt(0, 4)].isMine = true
}

function expandShown(board, elCell, i, j) {
  var rowIdx = i
  var colIdx = j
  var board = board

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = board[i][j]
      // console.log(currCell, i, j)
      if (!currCell.isMine) {
        const curr = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
        // console.log(curr)
        curr.classList.add("revealed")
        curr.innerText = currCell.minesAroundCount
      }
    }
  }
}
