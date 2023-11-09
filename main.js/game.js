"use strict"

const MINE = "💣"
const FLOOR = " "
const FLAG = "🚩"
const gLevel = {
  SIZE: 4,
  MINES: 3
}

var gBoard
var gGame
var gElSelectedCell
var gElSelectedCells = []
var gInterval
var gStartTime

function updateTimer() {
  const currentTime = new Date().getTime()
  const elapsedTime = (currentTime - gStartTime) / 1000
  document.querySelector(".timer").innerText = elapsedTime.toFixed(3)
}

function startTimer() {
  gStartTime = new Date().getTime()
  gInterval = setInterval(updateTimer, 1)
}

function stopTimer() {
  clearInterval(gInterval)
}
function initGame() {
  gGame = {
    isOn: true,
    shownCount: 0,
    isShow: false,
    markedCount: 0,
    secsPassed: 0,
    isFirstCellClick: true,
    lives: gLevel.MINES,
    flag: gLevel.MINES
  }
  gBoard = buildBoard()
  renderBoard(gBoard)
  setMinesNegsCount(gBoard)
  const elLoseModal = document.querySelector(".loseModal")
  elLoseModal.classList.add("hidden")

  const elWinModal = document.querySelector(".winModal")
  elWinModal.classList.add("hidden")

  const elrstBtn = document.querySelector(".resetBtn button")
  elrstBtn.innerText = "😀"

  const elLives = document.querySelector("h2 .lives")
  elLives.innerText = gGame.lives

  const elFlag = document.querySelector("h2 .flags")
  elFlag.innerText = gGame.flag

  gElSelectedCells = []
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
  const elTime = document.querySelector(".timer")
  elTime.innerText = `0:000`
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

function cellClick(elCell, rowIdx, colIdx) {
  // console.log(elCell)
  // console.log(gBoard[rowIdx][colIdx])
  // if (gBoard[rowIdx][colIdx].isShown) return
  if (gGame.lives === 0) return

  for (var i = 0; i < gElSelectedCells.length; i++) {
    // console.log(gElSelectedCells[i].i, gElSelectedCells[i].j)
    if (
      gElSelectedCells[i].i === +elCell.dataset.i &&
      gElSelectedCells[i].j === +elCell.dataset.j
    ) {
      return
    }
  }
  // if (gGame.markedCount === gLevel.MINES) return
  // console.log(+elCell.dataset.i, +elCell.dataset.j)
  if (gGame.isFirstCellClick) {
    startTimer()
  }

  var board = gBoard
  if (!gBoard[rowIdx][colIdx].isMine && gGame.isFirstCellClick) {
    // gGame.shownCount += expandShown(board, elCell, rowIdx, colIdx)
    // console.log(gGame.shownCount)
    gBoard[rowIdx][colIdx].isShown = true
    gGame.isFirstCellClick = false
    // gElSelectedCell = gBoard[rowIdx][colIdx]
    // console.log(gElSelectedCell.i, gElSelectedCell.j)
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "😜"
  } else if (!gBoard[rowIdx][colIdx].isMine) {
    // gGame.shownCount += expandShown(board, elCell, rowIdx, colIdx)
    // console.log(gGame.shownCount)
    gBoard[rowIdx][colIdx].isShown = true
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount

    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "😁"
  }

  if (gBoard[rowIdx][colIdx].isMine && gGame.isFirstCellClick) {
    gGame.shownCount++
    gGame.markedCount++
    gBoard[rowIdx][colIdx].isShown = true
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    gGame.isFirstCellClick = false
    board[rowIdx][colIdx].isMine = false
    elCell.classList.add("revealed")
    elCell.innerText = ""
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "🤔"
  } else if (gBoard[rowIdx][colIdx].isMine) {
    gGame.markedCount++
    console.log(gGame.shownCount)
    gBoard[rowIdx][colIdx].isShown = true
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    elCell.innerText = MINE
    elCell.classList.add("mine")
    gGame.lives--

    const elLives = document.querySelector("h2 .lives")
    elLives.innerText = gGame.lives

    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "🤯"
  }

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
  // board[0][0].isMine = true
  // board[2][2].isMine = true
  // board[3][3].isMine = true
  for (var i = 0; i < gLevel.MINES; i++) {
    board[getRandomInt(0, gLevel.SIZE)][
      getRandomInt(0, gLevel.SIZE)
    ].isMine = true
  }
}

function expandShown(board, elCell, i, j) {
  var rowIdx = i
  var colIdx = j
  var board = board
  var counter = 0
  console.log(gBoard[rowIdx][colIdx])
  if (gBoard[rowIdx][colIdx].isMine) {
    const curr = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    curr.classList.add("revealed")
    return
  }
  gBoard[rowIdx][colIdx].isShown = true
  // console.log(gBoard[rowIdx][colIdx])
  gGame.shownCount++
  console.log("gGame.shownCount:", gGame.shownCount)
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = board[i][j]
      if (!currCell.isShown && !currCell.isMine) {
        counter++
        gGame.shownCount++
        // console.log(currCell)
        console.log(counter)
      }
      currCell.isShown = true
      if (!currCell.isMine) {
        const curr = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
        // console.log(curr.dataset.i, curr.dataset.j)
        // console.log(gBoard[curr.dataset.i][curr.dataset.j].isShown)
        curr.classList.add("revealed")
        curr.innerText = currCell.minesAroundCount
      }
    }
  }
  return counter
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
  const elFlag = document.querySelector("h2 .flags")
  elFlag.innerText = gGame.flag
  if (gBoard[+elCell.dataset.i][+elCell.dataset.j].isMine) {
    gGame.markedCount++
    console.log(gGame.markedCount)
  }
  checkGameOver()
}

function resetGame() {
  console.log("reset game")
  stopTimer()
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
    stopTimer()
  }
  if (
    gGame.markedCount === gLevel.MINES &&
    gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES
  ) {
    const elWinModal = document.querySelector(".winModal")
    elWinModal.classList.remove("hidden")
    stopTimer()
  }
}

function changeLevel(level) {
  console.log(level)
  gLevel.SIZE = level
  gLevel.MINES = level - 1
  stopTimer()
  initGame()
}
