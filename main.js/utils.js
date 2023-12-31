"use strict"

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

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
