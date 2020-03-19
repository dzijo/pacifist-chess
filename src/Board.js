import * as React from 'react'
import { createUseStyles } from 'react-jss'

const pieces = {
    QUEEN: 'Q',
    ROOK: 'R',
    BISHOP: 'B',
    KNIGHT: 'N',
    KING: 'K'
}

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
    },
    form: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: 16,
        height: 7.2,
        fontSize: 10,
    },
    label: {
        fontSize: 16,
        display: 'flex',
        alignItems: 'center'
    },
    button: {
        height: 20,
        fontSize: 10,
        padding: 0
    }
}

const useStyles = createUseStyles(styles)

function Board(props) {
    const [size, setSize] = React.useState(3)
    const [queens, setQueens] = React.useState(0)
    const [rooks, setRooks] = React.useState(0)
    const [bishops, setBishops] = React.useState(0)
    const [knights, setKnights] = React.useState(0)
    const [kings, setKings] = React.useState(0)
    const classes = useStyles(props.width)
    const field = props.field

    React.useEffect(() => {
        setQueens(props.pieces[pieces.QUEEN])
        setRooks(props.pieces[pieces.ROOK])
        setBishops(props.pieces[pieces.BISHOP])
        setKnights(props.pieces[pieces.KNIGHT])
        setKings(props.pieces[pieces.KING])
        setSize(props.size < 3 ? 3 : props.size)
    }, [props])

    const handleChange = (event, piece) => {
        let value = event.target.value
        if (isNaN(value)) {
            return
        }
        if (value === '') {
            value = 0
        }
        switch (piece) {
            case pieces.QUEEN:
                setQueens(value)
                break
            case pieces.ROOK:
                setRooks(value)
                break
            case pieces.BISHOP:
                setBishops(value)
                break
            case pieces.KNIGHT:
                setKnights(value)
                break
            case pieces.KING:
                setKings(value)
                break
            default:
        }
    }

    const handleSizeChange = (event) => {
        let value = event.target.value
        if (isNaN(value)) {
            return
        }
        if (value < 3) {
            value = 3
        }
        else if (value > 7) {
            value = 7
        }
        setSize(value)
    }

    return (
        <div>
            <form onSubmit={(event) => {
                event.preventDefault()
                props.handleSubmit({
                    size, queens, rooks, bishops, knights, kings
                })
            }} className={classes.form}>
                <label className={classes.label}>
                    Size:
                    <input type="text" value={size} onChange={handleSizeChange} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    Q:
                    <input type="text" value={queens} onChange={(event) => { handleChange(event, pieces.QUEEN) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    R:
                    <input type="text" value={rooks} onChange={(event) => { handleChange(event, pieces.ROOK) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    B:
                    <input type="text" value={bishops} onChange={(event) => { handleChange(event, pieces.BISHOP) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    N:
                    <input type="text" value={knights} onChange={(event) => { handleChange(event, pieces.KNIGHT) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    K:
                    <input type="text" value={kings} onChange={(event) => { handleChange(event, pieces.KING) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <input type="submit" value="Start" className={classes.button} disabled={props.size !== 0} />
            </form>
            {field.map((val, i) => {
                return (
                    <React.Fragment key={`f${i}`}>

                        {<button className={(i % size % 2) === (Math.floor(i / size) % 2) ? classes.whiteSquare : classes.blackSquare} disabled key={i}>
                            {val}
                        </button>}
                        {((i + 1) % size === 0) ? <br key={`br${i}`} /> : null}
                    </React.Fragment>)
            })}
        </div>
    )
}

export default Board