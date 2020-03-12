import React from 'react';
import Board from './Board'
import './App.css';

const pieces = {
  QUEEN: 'Q',
  ROOK: 'R',
  BISHOP: 'B',
  KNIGHT: 'N',
  KING: 'K'
}

function App() {
  const size = 5;
  let trying = [];
  let tried = [];
  const ps = [pieces.KNIGHT, pieces.ROOK, pieces.ROOK, pieces.ROOK, pieces.Rook];

  for (let i = 0; i < size * size; i++) {
    trying.push(0);
    tried.push([]);
  }

  let i = 0;
  let lastI = 0;
  let currentP = 0;
  while (true) {
    const currentPiece = ps[currentP];
    while ((trying[i] !== 0 || tried[i].includes(currentPiece)) && i < Math.pow(size, 2)) {
      i++;
    }
    if (i >= Math.pow(size, 2)) {
      trying[lastI] = 0;
      i = lastI;
      break;
    }
    lastI = i;
    trying[i] = currentPiece;
    tried[i].push(currentPiece);
    trying = check(currentPiece, trying, i);
    console.log(trying);
    console.log(tried);
    if (lastI >= Math.pow(size, 2)) {
      break;
    }
    lastI = i;
  }

  return (
    <div className="App">
      <Board field={trying} width={20} />
    </div>
  );
}

export default App;

function check(piece, array, location) {
  switch (piece) {
    case pieces.QUEEN:
      return checkQueen(array, location)
    case pieces.ROOK:
      return checkRook(array, location)
    case pieces.BISHOP:
      return checkBishop(array, location)
    case pieces.KNIGHT:
      return checkKnight(array, location)
    case pieces.KING:
      return checkKing(array, location)
  }
}

function checkRook(array, location) {
  const size = Math.pow(array.length, 0.5)
  for (let i = 0; i < array.length; i++) {
    const sameRow = (Math.floor(i / size) === Math.floor(location / size))
    const sameColumn = ((i % size) === (location % size))
    if (array[i] === 0 && (sameRow || sameColumn)) {
      array[i] = 1;
    }
  }
  return array;
}

function checkBishop(array, location) {
  const size = Math.pow(array.length, 0.5)
  for (let i = 0; i < array.length; i++) {
    const sameMainDiagonal = (Math.floor(i / size) - (i % size)) === (Math.floor(location / size) - (location % size));
    const sameAntiDiagonal = (Math.floor(i / size) + (i % size)) === (Math.floor(location / size) + (location % size));
    if (array[i] === 0 && (sameMainDiagonal || sameAntiDiagonal)) {
      array[i] = 1;
    }
  }
  return array;
}

function checkQueen(array, location) {
  array = checkRook(array, location);
  return checkBishop(array, location);
}

function checkKing(array, location) {
  const size = Math.pow(array.length, 0.5)
  for (let i = 0; i < array.length; i++) {
    const diffX = Math.abs(Math.floor(i / size) - Math.floor(location / size));
    const diffY = Math.abs((i % size) - (location % size));
    if (array[i] === 0 && (diffX < 2) && (diffY < 2)) {
      array[i] = 1;
    }
  }
  return array;
}

function checkKnight(array, location) {
  const size = Math.pow(array.length, 0.5)
  for (let i = 0; i < array.length; i++) {
    const diffX = Math.abs(Math.floor(i / size) - Math.floor(location / size));
    const diffY = Math.abs((i % size) - (location % size));
    if (array[i] === 0 && ((diffX === 2 && diffY === 1) || (diffX === 1 && diffY === 2))) {
      array[i] = 1;
    }
  }
  return array;
}