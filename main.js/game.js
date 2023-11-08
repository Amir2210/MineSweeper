"use strict"

const MINE = "💣"
const FLOOR = " "
const gLevel = {
  SIZE: 4,
  MINES: 2
}

var gBoard

function initGame() {
  gBoard = buildBoard()
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
  // gBoard[findEmptyCell()][findEmptyCell()].isMine = true
  // console.log(gBoard[3][3])
  // console.log("gBoard[0][0] :", gBoard[0][0].i)
  // console.log(setMinesNegsCount(gBoard, gBoard[0][1]))
  // console.log("gBoard[0][1].minesAroundCount :", gBoard[0][1].minesAroundCount)
}

function buildBoard() {
  const board = createMat(gLevel.SIZE, gLevel.SIZE)
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true,
        i,
        j
      }
      board[i][j] = cell
    }
  }
  // board[getRandomInt(0, 4)][getRandomInt(0, 4)].isMine = true
  // board[getRandomInt(0, 4)][getRandomInt(0, 4)].isMine = true
  // board[getRandomInt(0, 4)][getRandomInt(0, 4)].isMine = true
  board[0][0].isMine = true
  board[2][2].isMine = true
  board[3][3].isMine = true

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
      strHTML += `\t<td class="cell ${cellClass}" onclick="cellClick(this, ${i},${j})">`
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
  // console.log(gBoard[rowIdx][colIdx])
  if (!gBoard[rowIdx][colIdx].isMine) {
    elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount
  }
  if (gBoard[rowIdx][colIdx].isMine) {
    elCell.innerText = MINE
    elCell.classList.add("mine")
  }
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
