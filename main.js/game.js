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
var darkIsOn = false

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
    markedCount: 0,
    bombClicked: 0,
    isFirstCellClick: true,
    lives: gLevel.MINES,
    flag: gLevel.MINES
  }
  gBoard = buildBoard()
  renderBoard(gBoard)
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
      cellClass += " floor "
      strHTML += `\t<td data-i="${i}" data-j="${j}" class="cell ${cellClass}" onclick="cellClick(this, ${i},${j})" oncontextmenu="onCellMarked(this)">`
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
  if (gGame.lives === 0) return

  for (var i = 0; i < gElSelectedCells.length; i++) {
    if (
      gElSelectedCells[i].i === +elCell.dataset.i &&
      gElSelectedCells[i].j === +elCell.dataset.j
    ) {
      return
    }
  }

  if (gBoard[rowIdx][colIdx].isShown) return

  if (gGame.isFirstCellClick) {
    startTimer()
  }

  var board = gBoard
  if (!gBoard[rowIdx][colIdx].isMine && gGame.isFirstCellClick) {
    // gGame.shownCount += expandShown(board, elCell, rowIdx, colIdx)
    // console.log(gGame.shownCount)
    gBoard[rowIdx][colIdx].isShown = true
    gGame.isFirstCellClick = false

    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "😜"
    putMines(board)
    setMinesNegsCount(board)
  } else if (!gBoard[rowIdx][colIdx].isMine) {
    gBoard[rowIdx][colIdx].isShown = true
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    elCell.innerText = gBoard[rowIdx][colIdx].minesAroundCount
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "😁"
  }

  if (gBoard[rowIdx][colIdx].isMine && gGame.isFirstCellClick) {
    // gGame.markedCount++
    gBoard[rowIdx][colIdx].isShown = true
    gElSelectedCells.push(gBoard[rowIdx][colIdx])
    gGame.isFirstCellClick = false
    board[rowIdx][colIdx].isMine = false
    elCell.classList.add("revealed")
    elCell.innerText = ""
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.innerText = "🤔"
    putMines(board)
    setMinesNegsCount(board)
  } else if (gBoard[rowIdx][colIdx].isMine) {
    gGame.shownCount++
    gGame.bombClicked++
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
  for (var i = 0; i < gLevel.MINES; i++) {
    var minesIdx = []
    const minesLocation = findEmptyCell()
    minesIdx.push(minesLocation)
    board[minesLocation.i][minesLocation.j].isMine = true
  }
}

function findEmptyCell() {
  var emptyCells = []
  var shownCells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (!gBoard[i][j].isShown) {
        emptyCells.push({ i, j })
      } else {
        shownCells.push({ i, j })
      }
    }
  }
  // console.log("shownCells:", shownCells)
  // console.log("emptyCells:", emptyCells)
  if (emptyCells.length === 0) return null

  const idx = getRandomInt(0, emptyCells.length)
  return emptyCells.splice(idx, 1)[0]
}

function expandShown(board, elCell, i, j) {
  var rowIdx = i
  var colIdx = j
  var board = board
  var counter = 0
  // console.log(gBoard[rowIdx][colIdx])
  if (gBoard[rowIdx][colIdx].isMine) {
    const curr = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    curr.classList.add("revealed")
    return
  }
  gBoard[rowIdx][colIdx].isShown = true
  gGame.shownCount++
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[0].length) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = board[i][j]
      if (!currCell.isShown && !currCell.isMine) {
        counter++
        gGame.shownCount++
        currCell.isShown = true
      }
      if (!currCell.isMine) {
        const curr = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
        // console.log(curr)
        // console.log(curr.dataset.i, curr.dataset.j)
        console.log(gBoard[curr.dataset.i][curr.dataset.j])
        curr.classList.add("revealed")
        curr.innerText = currCell.minesAroundCount
      }
    }
  }
  return counter
}

function onCellMarked(elCell) {
  console.log(gBoard[elCell.dataset.i][elCell.dataset.j])
  if (elCell.innerText === FLAG) {
    gBoard[+elCell.dataset.i][+elCell.dataset.j].isMarked = false
    gBoard[elCell.dataset.i][elCell.dataset.j].isShown = false
    elCell.innerText = FLOOR
    gGame.flag++
    gGame.shownCount--
  } else {
    gBoard[+elCell.dataset.i][+elCell.dataset.j].isMarked = true
    gBoard[elCell.dataset.i][elCell.dataset.j].isShown = true
    elCell.innerText = FLAG
    gGame.flag--
    // gGame.shownCount++
  }
  const elFlag = document.querySelector("h2 .flags")
  elFlag.innerText = gGame.flag
  if (gBoard[+elCell.dataset.i][+elCell.dataset.j].isMine) {
    gBoard[elCell.dataset.i][elCell.dataset.j].isShown = true
    gGame.markedCount++
    gGame.shownCount++
    // console.log(gGame.markedCount)
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
    gGame.markedCount === gLevel.MINES ||
    (gGame.shownCount >= gLevel.SIZE * gLevel.SIZE &&
      gGame.markedCount === gLevel.MINES) ||
    (gGame.shownCount >= gLevel.SIZE * gLevel.SIZE &&
      gGame.markedCount >= gGame.bombClicked) ||
    (gGame.shownCount - 1 >= gLevel.SIZE * gLevel.SIZE &&
      gGame.markedCount >= gGame.bombClicked) ||
    (gGame.shownCount - 1 >= gLevel.SIZE * gLevel.SIZE &&
      gGame.markedCount > gGame.bombClicked)
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

function switchTheme() {
  if (!darkIsOn) {
    darkIsOn = !darkIsOn
    const elThemeBtn = document.querySelector(".clockAndSun button")
    elThemeBtn.classList.remove("darkMode")
    elThemeBtn.classList.add("lightMode")
    elThemeBtn.innerText = "🌛"
    document.querySelector("body").style.backgroundColor = "#F0F0F0"
    document.querySelector("body").style.color = "#333"
    const elH2 = document.querySelector("h2")
    elH2.style.color = "#333"
    elH2.style.borderBottom = "#F45050 dashed 3px"
    elH2.style.borderTop = "#F45050 dashed 3px"
    document.querySelector("footer").style.color = "#333"
    document.querySelector(".timer").style.color = "#333"
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.style.backgroundColor = "#3C486B"
    elrstBtn.style.border = "3px solid #F45050"
    const elchangeLevelBtns = document.querySelectorAll(".changeLvl button")
    for (var i = 0; i < elchangeLevelBtns.length; i++) {
      elchangeLevelBtns[i].style.backgroundColor = "#3C486B"
      elchangeLevelBtns[i].style.border = "3px solid #F45050"
      elchangeLevelBtns[i].style.color = "#F0F0F0"
    }
    const elTable = document.querySelector("table")
    elTable.style.border = "#F45050 solid 3px"
  } else {
    darkIsOn = !darkIsOn
    const elThemeBtn = document.querySelector(".clockAndSun button")
    elThemeBtn.classList.remove("lightMode")
    elThemeBtn.classList.add("darkMode")
    elThemeBtn.innerText = "🌞"
    document.querySelector("body").style.backgroundColor = "#333"
    document.querySelector("body").style.color = "#fff"
    const elH2 = document.querySelector("h2")
    elH2.style.color = "#fff"
    elH2.style.borderBottom = "rgb(0, 255, 0) dashed 3px"
    elH2.style.borderTop = "rgb(0, 255, 0) dashed 3px"
    document.querySelector("footer").style.color = "#fff"
    document.querySelector(".timer").style.color = "#fff"
    const elrstBtn = document.querySelector(".resetBtn button")
    elrstBtn.style.backgroundColor = "aqua"
    elrstBtn.style.border = "3px solid rgb(132, 1, 255)"
    const elchangeLevelBtns = document.querySelectorAll(".changeLvl button")
    for (var i = 0; i < elchangeLevelBtns.length; i++) {
      elchangeLevelBtns[i].style.backgroundColor = "aqua"
      elchangeLevelBtns[i].style.border = "3px solid rgb(132, 1, 255)"
      elchangeLevelBtns[i].style.color = "#333"
    }
    const elTable = document.querySelector("table")
    elTable.style.border = "rgb(0, 255, 0) solid 3px"
  }
}
