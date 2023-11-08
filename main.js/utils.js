"use strict"

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function findEmptyCell() {
  const emptyCells = []

  for (var i = 0; i < gboard.length; i++) {
    for (var j = 0; j < gboard[i].length; j++) {
      const cell = gboard[i][j]
      if (!cell.gameElement && cell.type === FLOOR) {
        emptyCells.push({ i, j })
      }
    }
  }

  if (!emptyCells.length) return null

  const randIdx = getRandomInt(0, emptyCells.length)
  return emptyCells[randIdx]
}

// function neighboursCount() {
//   var counter = 0
//   for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//     if (i < 0 || i >= board.length) continue

//     for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//       if (j < 0 || j >= board[0].length) continue
//       if (i === rowIdx && j === colIdx) continue
//       var currCell = board[i][j]
//       if (currCell === BALL) ballCounter++
//     }
//   }
//   ballCounter++
// }

function createMat(ROWS, COLS) {
  const mat = []

  for (var i = 0; i < ROWS; i++) {
    const row = []
    for (var j = 0; j < COLS; j++) {
      row.push("")
    }
    mat.push(row)
  }
  return mat
}

function renderCell(location, value) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function getClassName(position) {
  const cellClass = `cell-${position.i}-${position.j}`
  return cellClass
}
