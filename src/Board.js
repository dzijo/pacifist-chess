import * as React from 'react'
import { createUseStyles } from 'react-jss'

import images from './pics/images'


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
        backgroundColor: 'rgb(64, 64, 64)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        padding: 0,
        color: 'red'
    },
    whiteSquare: {
        width: size => size,
        height: size => size,
        backgroundColor: 'white',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
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
        width: 32,
        height: 15,
        fontSize: 20,
        marginTop: 8
    },
    label: {
        display: 'flex',
        alignItems: 'center'
    },
    p: {
        fontSize: 32,
        margin: 0,
        lineHeight: 0
    },
    img: {
        height: 36,
        backgroundColor: 'rgba(1, 1, 1, 0)',
    },
    button: {
        height: 30,
        fontSize: 20,
        padding: 0,
        marginLeft: 10
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
                    <p className={classes.p}>Size:</p>
                    <input type="text" value={size} onChange={handleSizeChange} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    <img className={classes.img} src={images.queen}></img>
                    <input type="text" value={queens} onChange={(event) => { handleChange(event, pieces.QUEEN) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    <img className={classes.img} src={images.rook}></img>
                    <input type="text" value={rooks} onChange={(event) => { handleChange(event, pieces.ROOK) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    <img className={classes.img} src={images.bishop}></img>
                    <input type="text" value={bishops} onChange={(event) => { handleChange(event, pieces.BISHOP) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    <img className={classes.img} src={images.knight}></img>
                    <input type="text" value={knights} onChange={(event) => { handleChange(event, pieces.KNIGHT) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <label className={classes.label}>
                    <img className={classes.img} src={images.king}></img>
                    <input type="text" value={kings} onChange={(event) => { handleChange(event, pieces.KING) }} className={classes.input} disabled={props.size !== 0} />
                </label>
                <input type="submit" value="Start" className={classes.button} disabled={props.size !== 0} />
            </form>
            {field.map((val, i) => {
                return (
                    <React.Fragment key={`f${i}`}>

                        {<img
                            className={(i % size % 2) === (Math.floor(i / size) % 2) ? classes.whiteSquare : classes.blackSquare}
                            key={i}
                            src={getImage(val)}
                            alt='Piece'>
                        </img>}
                        {((i + 1) % size === 0) ? <br key={`br${i}`} /> : null}
                    </React.Fragment>)
            })}
        </div>
    )
}

export default Board

function getImage(value) {
    switch (value) {
        case pieces.QUEEN:
            return images.queen
        case pieces.ROOK:
            return images.rook
        case pieces.BISHOP:
            return images.bishop
        case pieces.KNIGHT:
            return images.knight
        case pieces.KING:
            return images.king
        default:
            return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    }
}