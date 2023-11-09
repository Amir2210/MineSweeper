"use strict"

const MINE = "💣"
const FLOOR = " "
const FLAG = "🚩"
const gLevel = {
  SIZE: 4,
  MINES: 2
}

var gBoard
var gGame
var gElSelectedCell
var gElSelectedCells = []
var gElSelectedFlags = []
function initGame() {
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstCellClick: true,
    lives: 3,
    flag: 3
  }
  gBoard = buildBoard()
  renderBoard(gBoard)
  setMinesNegsCount(gBoard)
  const elLoseModal = document.querySelector(".loseModal")
  elLoseModal.classList.add("hidden")

  const elrstBtn = document.querySelector(".resetBtn button")
  elrstBtn.innerText = "😀"
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
      strHTML += `\t<td data-i="${i}" data-j="${j}" class="cell ${cellClass}" onclick="cellClick(this, ${i},${j})" oncontextmenu="onCellMarked(this)">`
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

// function cellClick(elCell, rowIdx, colIdx) {
//   // console.log(elCell)
//   console.log(+elCell.dataset.i, +elCell.dataset.j)

//   var board = gBoard
//   if (!gBoard[rowIdx][colIdx].isMine && gGame.isFirstClick) {
//     gGame.isFirstClick = false
//     gElSelectedCell = gBoard[rowIdx][colIdx]
//     console.log(gElSelectedCell.i, gElSelectedCell.j)
//   } else if (!gBoard[rowIdx][colIdx].isMine) {
//     if (
//       +elCell.dataset.i === gElSelectedCell.i &&
//       +elCell.dataset.j === gElSelectedCell.j
//     ) {
//       return
//     }
//     elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount
//   }

//   if (gBoard[rowIdx][colIdx].isMine && gGame.isFirstClick) {
//     gGame.isFirstClick = false
//     gElSelectedCell = gBoard[rowIdx][colIdx]

//     console.log(gElSelectedCell.i, gElSelectedCell.j)
//   } else if (gBoard[rowIdx][colIdx].isMine) {
//     if (
//       +elCell.dataset.i === gElSelectedCell.i &&
//       +elCell.dataset.j === gElSelectedCell.j
//     ) {
//       return
//     }
//     elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount
//   }
//   expandShown(board, elCell, rowIdx, colIdx)
//   elCell.classList.add("revealed")
// }

function cellClick(elCell, rowIdx, colIdx) {
  // console.log(elCell)
  if (gGame.lives === 0) return
  console.log(+elCell.dataset.i, +elCell.dataset.j)

  var board = gBoard
  if (!gBoard[rowIdx][colIdx].isMine && gGame.isFirstCellClick) {
    gGame.isFirstCellClick = false
    // gElSelectedCell = gBoard[rowIdx][colIdx]
    // console.log(gElSelectedCell.i, gElSelectedCell.j)
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "😜"
  } else if (!gBoard[rowIdx][colIdx].isMine) {
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount

    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "🤔"
  }

  if (gBoard[rowIdx][colIdx].isMine && gGame.isFirstCellClick) {
    // gElSelectedCell = gBoard[rowIdx][colIdx]
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    gGame.isFirstCellClick = false
    board[rowIdx][colIdx].isMine = false
    elCell.classList.add("revealed")
    elCell.innerText = ""

    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "🤯"
  } else if (gBoard[rowIdx][colIdx].isMine) {
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    elCell.innerText = MINE
    elCell.classList.add("mine")
    gGame.lives--
    const elLives = document.querySelector("h2 .lives")
    elLives.innerText = gGame.lives

    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "🤯"
  }
  console.log(gElSelectedCells[0])
  expandShown(board, elCell, rowIdx, colIdx)
  elCell.classList.add("revealed")
  checkGameOver()
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

function onCellMarked(elCell) {
  console.log(elCell.innerText)
  if (elCell.innerText === FLAG) {
    gBoard[+elCell.dataset.i][+elCell.dataset.j].isMarked = false
    elCell.innerText = FLOOR
    gGame.flag++
  } else {
    gBoard[+elCell.dataset.i][+elCell.dataset.j].isMarked = true
    elCell.innerText = FLAG
    gGame.flag--
  }

  console.log(gBoard[+elCell.dataset.i][+elCell.dataset.j])

  const elFlag = document.querySelector("h2 .flags")
  elFlag.innerText = gGame.flag
  console.log(
    gBoard[+elCell.dataset.i][+elCell.dataset.j].i,
    gBoard[+elCell.dataset.i][+elCell.dataset.j].j
  )

  checkGameOver()
}

function resetGame() {
  console.log("reset game")
  const elLives = document.querySelector("h2 .lives")
  elLives.innerText = 3
  const elFlag = document.querySelector("h2 .flags")
  elFlag.innerText = 3
  initGame()
}

function checkGameOver() {
  if (gGame.lives === 0) {
    gGame.isOn = false
    const elLoseModal = document.querySelector(".loseModal")
    elLoseModal.classList.remove("hidden")
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "💀"
    console.log("you lose")
  }
}
