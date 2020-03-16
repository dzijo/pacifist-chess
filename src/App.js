import React, { useState } from 'react';
import Board from './Board'
import './App.css';

const pieces = {
  QUEEN: 'Q',
  ROOK: 'R',
  BISHOP: 'B',
  KNIGHT: 'N',
  KING: 'K'
}

function useMergeState(initialState) {
  const [state, setState] = useState(initialState)
  const setMergedState = newState =>
    setState(prevState => Object.assign({}, prevState, newState)
    )
  return [state, setMergedState]
}

const size = 5;
const sqSize = Math.pow(size, 2)
const ps = [pieces.KNIGHT, pieces.KNIGHT, pieces.KNIGHT, pieces.KNIGHT, pieces.KNIGHT, pieces.KNIGHT, pieces.KNIGHT, pieces.KNIGHT, pieces.KNIGHT];

function App() {
  const [state, setState] = useMergeState({
    stack: [new Array(sqSize).fill(0)],
    indexes: [0],
    lastIndexes: new Array(ps.length).fill(0),
    currentPieceIndex: 0,
    text: '',
    finished: false,
    solutions: [],
    superDone: false,
    looping: false
  })

  let { stack, lastIndexes, indexes, currentPieceIndex, text, finished, solutions, superDone, looping } = state

  const handleClick = () => {
    do {
      console.log('f')
      const currentPiece = ps[currentPieceIndex]
      let index = lastIndexes[currentPieceIndex]
      let currentBoard = stack[stack.length - 1].slice(0)
      if (finished) {
        lastIndexes[currentPieceIndex] = 0
        indexes.pop()
        stack.pop()
        currentPieceIndex--
        text = ''
        finished = false
        setState({
          stack,
          indexes,
          lastIndexes,
          currentPieceIndex,
          text,
          finished,
          solutions,
          superDone,
          looping
        })
        continue
      }
      finished = false
      while (index <= sqSize) {
        while (currentBoard[index] !== 0 && index < sqSize) {
          index++
        }
        if (checkIfOk(currentPiece, currentBoard, index)) {
          break
        }
        index++
      }
      if (index >= sqSize) {
        if (currentPieceIndex <= 0) {
          text = 'Done!'
          superDone = true
          setState({
            stack,
            indexes,
            lastIndexes,
            currentPieceIndex,
            text,
            finished,
            solutions,
            superDone,
            looping
          })
          continue
        }
        lastIndexes[currentPieceIndex] = 0
        indexes.pop()
        stack.pop()
        currentPieceIndex--
        text = ''
        setState({
          stack,
          indexes,
          lastIndexes,
          currentPieceIndex,
          text,
          finished,
          solutions,
          superDone,
          looping
        })
      }
      else {
        lastIndexes[currentPieceIndex] = index + 1
        currentBoard[index] = currentPiece
        indexes.push(index)
        currentBoard = check(currentPiece, currentBoard, index)
        stack.push(currentBoard)
        currentPieceIndex++
        text = ''
        if (currentPieceIndex >= ps.length) {
          text = 'Found one, continuing...'
          finished = true
          solutions.push(currentBoard)
        }
        setState({
          stack,
          indexes,
          lastIndexes,
          currentPieceIndex,
          text,
          finished,
          solutions,
          superDone,
          looping
        })
      }
    } while (looping && !superDone)
  }

  const handleFindAll = () => {
    looping = !looping
    setState({
      stack,
      indexes,
      lastIndexes,
      currentPieceIndex,
      text,
      finished,
      solutions,
      superDone,
      looping
    })
  }

  const reset = () => {
    setState({
      stack: [new Array(sqSize).fill(0)],
      indexes: [0],
      lastIndexes: new Array(ps.length).fill(0),
      currentPieceIndex: 0,
      text: '',
      finished: false,
      solutions: [],
      superDone: false,
      looping: false
    })
  }

  return (
    <div className="App">
      <Board field={stack[stack.length - 1]} width={20} />
      <button onClick={handleClick} disabled={state.superDone}>Next step</button>
      <button onClick={handleFindAll} disabled={state.superDone}>Find all solutions</button>
      <p>{text}</p>
      <button onClick={() => { console.log(state.solutions) }} disabled={!state.superDone}>Show solutions</button>
      <button onClick={reset} >Reset</button>
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

function checkIfOk(piece, array, location) {
  switch (piece) {
    case pieces.QUEEN:
      return checkIfQueenOk(array, location)
    case pieces.ROOK:
      return checkIfRookOk(array, location)
    case pieces.BISHOP:
      return checkIfBishopOk(array, location)
    case pieces.KNIGHT:
      return checkIfKnightOk(array, location)
    case pieces.KING:
      return checkIfKingOk(array, location)
  }
}


function checkIfKnightOk(array, location) {
  const size = Math.pow(array.length, 0.5)
  for (let i = 0; i < array.length; i++) {
    const diffX = Math.abs(Math.floor(i / size) - Math.floor(location / size));
    const diffY = Math.abs((i % size) - (location % size));
    if ((diffX === 2 && diffY === 1) || (diffX === 1 && diffY === 2)) {
      if (array[i] !== 0 && array[i] !== 1) {
        return false
      }
    }
  }
  return true;
}

function checkIfKingOk(array, location) {
  const size = Math.pow(array.length, 0.5)
  for (let i = 0; i < array.length; i++) {
    const diffX = Math.abs(Math.floor(i / size) - Math.floor(location / size));
    const diffY = Math.abs((i % size) - (location % size));
    if ((diffX < 2) && (diffY < 2)) {
      if (array[i] !== 0 && array[i] !== 1) {
        return false
      }
    }
  }
  return true;
}

function checkIfBishopOk(array, location) {
  const size = Math.pow(array.length, 0.5)
  for (let i = 0; i < array.length; i++) {
    const sameMainDiagonal = (Math.floor(i / size) - (i % size)) === (Math.floor(location / size) - (location % size));
    const sameAntiDiagonal = (Math.floor(i / size) + (i % size)) === (Math.floor(location / size) + (location % size));
    if (sameMainDiagonal || sameAntiDiagonal) {
      if (array[i] !== 0 && array[i] !== 1) {
        return false
      }
    }
  }
  return true;
}

function checkIfRookOk(array, location) {
  const size = Math.pow(array.length, 0.5)
  for (let i = 0; i < array.length; i++) {
    const sameRow = (Math.floor(i / size) === Math.floor(location / size))
    const sameColumn = ((i % size) === (location % size))
    if (sameRow || sameColumn) {
      if (array[i] !== 0 && array[i] !== 1) {
        return false
      }
    }
  }
  return true;
}

function checkIfQueenOk(array, location) {
  if (!checkIfRookOk(array, location)) {
    return false
  }
  return checkIfBishopOk(array, location);
}