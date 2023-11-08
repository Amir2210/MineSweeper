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
  renderBoard(gBoard)

  // console.log(gBoard[0][1])
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
  console.log(gBoard[3][3])
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
  board[0][0].isMine = true
  board[3][3].isMine = true
  board[2][2].isMine = true
  return board
}

function renderBoard(board) {
  var strHTML = ""
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n"
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]
      var cellClass = getClassName({ i, j })
      currCell.isMine ? (cellClass += " mine") : (cellClass += " floor")
      strHTML += `\t<td class="cell ${cellClass}" onclick="cellClick(this, ${i},${j})">`
      if (currCell.isMine) {
        strHTML += MINE
      }
      strHTML += FLOOR
      if (!currCell.isMine) {
        strHTML += currCell.minesAroundCount
      }
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
  // console.log(rowIdx)
  // console.log(colIdx)
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

// function neighboursCounter(row, col, bor) {
//   var counter = 0
//   for (var i = row - 1; i <= row + 1; i++) {
//     if (i < 0 || i >= bor.length) continue

//     for (var j = col - 1; j <= col + 1; j++) {
//       if (j < 0 || j >= bor[0].length) continue
//       if (i === row && j === col) continue
//       var currCell = bor[i][j]
//       // console.log(currCell)
//       if (currCell.isMine) counter++
//     }
//   }
//   counter++
// }
