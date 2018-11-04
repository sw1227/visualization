import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import nouislider from "nouislider";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import * as d3 from "d3";
import Frame from "./common/Frame.jsx";


// Calculate the size
const leftWidth = window.innerWidth > 599 ? window.innerWidth*2/3 : window.innerWidth;
const squareSize = Math.min(leftWidth - 2*15, window.innerHeight - 70 - 2*15);


// Define Conway's Game of Life
const GameOfLife = function (initCells, rule={"survival": [2, 3], "birth": [3]}) {
    // Initialize
    this.cells = initCells;
    this.rule = rule;
    this.shape = [initCells.length, initCells[0].length];

    // Loop the edges
    this.getItem = function (i, j) {
        const r = (i + this.shape[0]) % this.shape[0];
        const c = (j + this.shape[1]) % this.shape[1];
        return this.cells[r][c];
    }

    // Next step
    this.update = function () {
        this.cells = this.cells.map((row, i) => {
            return row.map((cell, j) => {
                // Eight neighbors of index (i, j)
                const neighbors = [[i-1, j-1], [i-1, j], [i-1, j+1],
                                   [i,   j-1],           [i,   j+1],
                                   [i+1, j-1], [i+1, j], [i+1, j+1]];
                // # of "live" cells in the neighbor
                const count = neighbors.filter(n => this.getItem(...n)===1).length;
                // reproduce/live-on/die depending on the neighbor
                const birth = this.rule.birth.indexOf(count) >= 0;
                const survival = (cell === 1) && (this.rule.survival.indexOf(count) >= 0);
                return ( birth || survival ) ? 1 : 0;
            });
        });
    }
}

// Generate a 2D Array, initialized by the given pattern and translation (dx, dy)
//   - pattern: Array of coordinates [y, x] for "live" cells
function createInitCells(pattern, dy, dx, shape) {
    const zeros = new Array(shape[0]).fill(0).map(_ => (new Array(shape[1]).fill(0)));
    pattern.forEach(d => {
        zeros[d[0] + dy][d[1] + dx] = 1;
    });
    return zeros;
}


class GameOfLifeComponent extends React.Component {
    constructor(props) {
        super(props);

        // R-pentomino: long-live initial pattern
        const shape = [20, 20]; // # of row, col
        const rPentomino = [[2, 1], [1, 2], [2, 2], [3, 2], [1, 3]];
        this.state = {
            shape: shape,
            initPattern: rPentomino,
            step: 0,
        }
    }

    componentDidMount() {
        this.drawLife();
    }

    drawLife() {
        const lifegame = new GameOfLife(
            createInitCells(this.state.initPattern, 10, 10, this.state.shape)
        );
        const margin = 20;
        const size = squareSize - 2*margin;
        const cellSize = size / this.state.shape[0]; // TODO: non-square

        const svg = d3.select(this.refs.svg)
          .append("g")
            .attr("transform", `translate(${margin}, ${margin})`);

        svg.selectAll("g.row")
            .data(lifegame.cells)
          .enter().append("g")
            .attr("class", "row")
            .attr("transform", (_, i) => `translate(0, ${i*cellSize})`)
            .selectAll("rect")
            .data(d => d)
          .enter().append("rect")
            .attr("x", (_, i) => i*cellSize)
            .attr("width", cellSize).attr("height", cellSize)
            .attr("fill", d => d===1 ? "#777" : "#fff")
            .attr("stroke", "#aaa").attr("stroke-width", "0.5px");

        // Animate
        const interval = 100; // animation frame [msec]
        const maxStep = 65;
        this.setState({interval: interval})
        let step = 0;
        const timer = d3.interval(() => {
            lifegame.update();
            this.updateLife(lifegame.cells);
            // memo: maybe it's better defining a component which takes cell states as props and just draw it

            // Update step view
            step += 1;
            this.setState({step: step});
            if (step > maxStep) { timer.stop(); }
        }, interval);
    }

    updateLife(cells) {
        d3.select(this.refs.svg).selectAll("g.row")
            .data(cells)
          .selectAll("rect")
            .data(d => d)
          .transition().delay(0).duration(this.state.interval/2)
            .attr("fill", d => d===1 ? "#777" : "#fff");
    }

    render() {
        const { classes } = this.props;

        return (
            <Frame title="Conway's Game of Life">
                <GridContainer>
                    <GridItem sm={8} xs={12}>
                        {/* left */}
                        <Card className={classes.card}>
                            <svg ref="svg" width={squareSize} height={squareSize}></svg>
                        </Card>
                    </GridItem>
                    <GridItem sm={4} xs={12} className={classes.rightContainer}>
                        {/* right */}
                        <div>Step = {this.state.step}</div>
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const lifeStyle = {
    card: {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        margin: "15px",
    },
    rightContainer: {
        padding: "15px",
    },
};

export default withStyles(lifeStyle)(GameOfLifeComponent);
