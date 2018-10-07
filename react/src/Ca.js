import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import * as d3 from "d3";


// Define Cellular Automaton
const CellularAutomaton = function(initCells, rule) {
    // Initialize
    this.cells = initCells;
    this.rule = rule;
    this.length = initCells.length;

    // Loop the edges
    this.getItem = i => this.cells[ (i+this.length) % this.length ];

    // Next step
    this.update = function() {
	    this.cells = this.cells.map((_, i) => {
    	    const neighborCode = 4*this.getItem(i-1) + 2*this.getItem(i) + this.getItem(i+1);
	        return Math.floor(this.rule / 2**neighborCode) % 2;
	    });
    }
}

const styles = theme => ({
    paper: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        width:  `calc(100% - ${theme.spacing.unit*4}px)`,
        height: `calc(100% - ${theme.spacing.unit*4}px)`,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});


class CaComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("1-D Cellular Automaton");

        const numCells = 40;
        const initCells = new Array(numCells).fill(0);
        initCells[Math.floor(numCells/2)] = 1;
        this.state = {
            rule: 90,
            initCells: initCells,
            numCells: numCells,
        };
    }

    componentDidMount() {
        const ca = new CellularAutomaton(this.state.initCells, this.state.rule);
        this.drawCa(ca);
    }

    drawCa(ca) {
        const margin = 20;
        const outerSize = Math.min(window.innerHeight - 64 - 16*2, this.refs.adjuster.offsetWidth);
        const size = outerSize - 2*margin;
        const cellSize = size / this.state.numCells;

        const svg = d3.select(this.refs.svg)
            .attr("width", outerSize).attr("height", outerSize)
          .append("g")
            .attr("transform", `translate(${margin}, ${margin})`);

        d3.range(this.state.numCells).forEach(r => {
            svg.append("g")
                .attr("class", "row")
                .selectAll("rect")
                .data(ca.cells)
              .enter().append("rect")
                .attr("x", (d, i) => i*cellSize)
                .attr("y", r*cellSize)
                .attr("width", cellSize).attr("height", cellSize)
                .attr("fill", d => d===1 ? "#777": "#fff")
                .attr("stroke", "#777").attr("stroke-width", "0.5px");
            ca.update();
        });

        // Register onClick to the top row (initState)
        svg.select(".row").selectAll("rect")
            .on("click", (d, i) => {
                const newInitCells = this.state.initCells.map((d2, i2) => (
                    i2 === i ? 1-d2 : d2
                ));
                this.setState({
                    initCells: newInitCells
                }, this.updateCa);
            });
    }

    updateCa() {
        const ca = new CellularAutomaton(this.state.initCells, this.state.rule);
        d3.range(this.state.numCells).forEach(r => {
            d3.selectAll("svg g .row").filter((_, i) => i===r)
                .selectAll("rect")
                .data(ca.cells)
              .transition().duration(200)
                .attr("fill", d => d===1 ? "#777": "#fff");
            ca.update();
        });
    }

    handleRuleChange = name => event => {
        // Pass callback: setState is async!
        this.setState({
            [name]: event.target.value
        }, this.updateCa);
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container spacing={24}>
                {/* SVG */}
                <Grid item sm={8} xs={12}>
                    <Paper className={classes.paper}>
                        <div ref="adjuster">
                            <svg ref="svg"></svg>
                        </div>
                    </Paper>
                </Grid>

                {/* Form */}
                <Grid item sm={4} xs={12}>
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                            id="standard-number"
                            label="Rule"
                            value={this.state.rule}
                            onChange={this.handleRuleChange('rule')}
                            type="number"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                        />
                    </form>
                </Grid>

            </Grid>
        );
    }
}

export default withStyles(styles)(CaComponent);
