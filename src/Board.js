import * as React from 'react'
import { createUseStyles } from 'react-jss'

const styles = {
    blackSquare: {
        width: size => size,
        height: size => size,
        backgroundColor: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'blue',
        padding: 0,
        color: 'red'
    },
    whiteSquare: {
        width: size => size,
        height: size => size,
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'blue',
        padding: 0,
        color: 'red'
    }
}

const useStyles = createUseStyles(styles)

function Board(props) {
    const classes = useStyles(props.width)
    const field = props.field
    const size = Math.pow(field.length, 0.5)
    return (
        <div>
            {field.map((val, i) => {
                return (
                    <React.Fragment>
                        {<button className={(i % 2) ? classes.whiteSquare : classes.blackSquare} disabled>
                            {val}
                        </button>}
                        {((i + 1) % size === 0) ? <br /> : null}
                    </React.Fragment>)
            })}
        </div>
    )
}

export default Board