import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button  className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(rowIndex) {
        const squares = [];
        for (let i = 0; i < 3; i++) {
            let squareIndex = rowIndex * 3 + i;
            squares.push(this.renderSquare(squareIndex));
        }

        return (
            <div key={rowIndex} className="board-row">
                {squares}
            </div>
        )
    }

    render() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            rows.push(this.renderRow(i));
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                squareMove: null,
            }],
            stepNumber: 0,
            movesReverseSortOrder: false,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                squareMove: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    toggleSort() {
        this.setState({
            movesReverseSortOrder: !this.state.movesReverseSortOrder
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            let squareMove = step.squareMove;
            let row = Math.floor(squareMove / 3) + 1;
            let col = squareMove % 3 + 1;

            const desc = move ? `Go to move #${move} (row: ${row}; col: ${col})` : `Go to game start`;
            return (
                <li key={squareMove}>
                    <button onClick={() => this.jumpTo(move)}>
                        <span style={{ fontWeight: move === this.state.stepNumber ? 'bold' : 'normal' }}>{desc}</span>
                    </button>
                </li>
            );
        });

        if (this.state.movesReverseSortOrder) {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = `Winner: ${winner}`;
        } else {
            const nextPlayer = this.state.xIsNext ? 'X' : 'O';
            status = `Next player: ${nextPlayer}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleSort()}>Toggle moves sort order</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const winnerLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < winnerLines.length; i++) {
        const [a, b, c] = winnerLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);