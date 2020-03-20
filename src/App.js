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

function App() {
  const [state, setState] = useMergeState({
    stack: null,
    indexes: [0],
    lastIndexes: null,
    currentPieceIndex: 0,
    text: '',
    finished: false,
    solutions: [],
    superDone: false,
    looping: false,
    showSolution: -1,
    size: 0,
    ps: []
  })

  let { stack, lastIndexes, indexes, currentPieceIndex, text, finished, solutions, superDone, looping, showSolution, size, ps } = state
  const sqSize = Math.pow(size, 2)

  const handleClick = () => {
    do {
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
        if (!looping) {
          setState({
            stack,
            indexes,
            lastIndexes,
            currentPieceIndex,
            text,
            finished,
            solutions,
            superDone,
            looping,
            showSolution,
            size,
            ps
          })
        }
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
          text = `Done! Found ${solutions.length} solutions.`
          superDone = true
          if (!looping) {
            setState({
              stack,
              indexes,
              lastIndexes,
              currentPieceIndex,
              text,
              finished,
              solutions,
              superDone,
              looping,
              showSolution,
              size,
              ps
            })
          }
          continue
        }
        lastIndexes[currentPieceIndex] = 0
        indexes.pop()
        stack.pop()
        currentPieceIndex--
        text = ''
        if (!looping) {
          setState({
            stack,
            indexes,
            lastIndexes,
            currentPieceIndex,
            text,
            finished,
            solutions,
            superDone,
            looping,
            showSolution,
            size,
            ps
          })
        }
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
          if (!containsArray(currentBoard, solutions)) {
            text = 'Found one, continuing...'
            finished = true
            solutions.push(currentBoard)
            if (solutions.length >= 100) {
              text = `Found 'first' 100 solutions!`
              superDone = true
              break;
            }
          }
          else {
            text = 'Duplicate solution, continuing...'
          }
        }
        if (!looping) {
          setState({
            stack,
            indexes,
            lastIndexes,
            currentPieceIndex,
            text,
            finished,
            solutions,
            superDone,
            looping,
            showSolution,
            size,
            ps
          })
        }
      }
    } while (looping && !superDone)
    if (looping) {
      setState({
        stack,
        indexes,
        lastIndexes,
        currentPieceIndex,
        text,
        finished,
        solutions,
        superDone,
        looping,
        showSolution,
        size,
        ps
      })
    }
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
      looping,
      showSolution,
      size,
      ps
    })
    handleClick()
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
      looping,
      showSolution,
      size,
      ps
    })
  }

  const reset = () => {
    setState({
      stack: null,
      indexes: [0],
      lastIndexes: null,
      currentPieceIndex: 0,
      text: '',
      finished: false,
      solutions: [],
      superDone: false,
      looping: false,
      showSolution: -1,
      size: 0,
      ps: ps
    })
  }

  const handleStart = (input) => {
    size = input.size
    ps = []
    for (let i = 0; i < input.queens; i++) {
      ps.push(pieces.QUEEN)
    }
    for (let i = 0; i < input.rooks; i++) {
      ps.push(pieces.ROOK)
    }
    for (let i = 0; i < input.bishops; i++) {
      ps.push(pieces.BISHOP)
    }
    for (let i = 0; i < input.knights; i++) {
      ps.push(pieces.KNIGHT)
    }
    for (let i = 0; i < input.kings; i++) {
      ps.push(pieces.KING)
    }
    if (ps.length === 0) {
      ps.push(pieces.QUEEN)
    }
    stack = [new Array(Math.pow(size, 2)).fill(0)]
    lastIndexes = new Array(ps.length).fill(0)
    setState({
      stack,
      indexes,
      lastIndexes,
      currentPieceIndex,
      text,
      finished,
      solutions,
      superDone,
      looping,
      showSolution,
      size,
      ps
    })
  }

  const cycleSolutions = (left) => {
    if (left) {
      showSolution = showSolution <= 0 ? 0 : showSolution - 1
    }
    else {
      showSolution = showSolution >= solutions.length - 1 ? solutions.length - 1 : showSolution + 1
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
      looping,
      showSolution,
      size,
      ps
    })
  }

  return (
    <div className="App">

      <Board field={size === 0 ? [] : superDone && showSolution >= 0 ? solutions[showSolution] : stack[stack.length - 1]} width={60} handleSubmit={handleStart} size={size} pieces={countPieces(ps)} />
      <button disabled={!(superDone && showSolution > 0)} onClick={() => { cycleSolutions(true) }}>{`<`}</button>
      <button disabled={!(superDone && showSolution < (solutions.length - 1))} onClick={() => { cycleSolutions(false) }}>{`>`}</button>
      <br />
      <button onClick={handleClick} disabled={superDone || size === 0}>Next step</button>
      <button onClick={handleFindAll} disabled={superDone || size === 0}>Find all solutions (max 100)</button>
      <p>{text}</p>
      <button onClick={reset} disabled={size === 0}>Reset</button>
    </div>
  );
}

export default App;

function countPieces(array) {
  const result = {
    [`${pieces.QUEEN}`]: 0,
    [`${pieces.ROOK}`]: 0,
    [`${pieces.BISHOP}`]: 0,
    [`${pieces.KNIGHT}`]: 0,
    [`${pieces.KING}`]: 0,
  }
  for (let i = 0; i < array.length; i++) {
    result[array[i]]++
  }
  return result
}

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
    default:
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
    default:
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

function containsArray(array, arrayOfArrays) {
  const size = Math.pow(array.length, 0.5)
  let verticalMirror = []
  let r90 = [], r180 = [], r270 = []
  let vmR90 = [], vmR180 = [], vmR270 = []
  for (let i = 0; i < array.length; i++) {
    const row = Math.floor(i / size)
    verticalMirror.push(array[size * (2 * row + 1) - 1 - i])
  }
  for (let i = 0; i < array.length; i++) {
    const row = Math.floor(i / size)
    const column = i % size
    const index = (size - 1) * size - column * size + row
    r90.push(array[index])
    vmR90.push(verticalMirror[index])
  }
  for (let i = 0; i < array.length; i++) {
    const row = Math.floor(i / size)
    const column = i % size
    const index = (size - 1) * size - column * size + row
    r180.push(r90[index])
    vmR180.push(vmR90[index])
  }
  for (let i = 0; i < array.length; i++) {
    const row = Math.floor(i / size)
    const column = i % size
    const index = (size - 1) * size - column * size + row
    r270.push(r180[index])
    vmR270.push(vmR180[index])
  }
  for (let a of arrayOfArrays) {
    if (arraysEqual(a, array) || arraysEqual(a, verticalMirror) || arraysEqual(a, r90) || arraysEqual(a, vmR90) ||
      arraysEqual(a, r180) || arraysEqual(a, vmR180) || arraysEqual(a, r270) || arraysEqual(a, vmR270)) {
      return true
    }
  }
  return false
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
