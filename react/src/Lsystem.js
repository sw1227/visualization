import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as d3 from "d3";


// Define L-system
var Lsystem = function(start, rule) {

    // Initialize
    this.state = start;
    this.rule = rule;
    this.generation = 0;

    this.update = function() {
        this.generation += 1;
        this.state = this.state.split("").map(s => rule[s]).join("");
        return this.state;
    };
};

// Run a simple L-system
var rule = {
    "1": "11",
    "0": "1[0]0",
    "[": "[",
    "]": "]"
};


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        width:  `calc(100% - ${theme.spacing.unit*4}px)`,
        height: `calc(100% - ${theme.spacing.unit*4}px)`,
    },
    settings: {
        margin: theme.spacing.unit * 2,
        padding: 0,
    },
});

class LsystemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("L-system");
        // this.paper = React.createRef();
    }

    componentDidMount() {
        var lsystem = new Lsystem("0", rule);
        d3.range(7).forEach(() => {lsystem.update();});
        this.drawTree(lsystem.state);
    }

    drawTree(data) {
        // adjust to width
        const size = Math.min(window.innerHeight - 64 - 16*2, this.refs.adjuster.offsetWidth);
        d3.select(this.refs.svg).attr("width", size).attr("height", size);
        var svg = d3.select(this.refs.svg).append("g")
            .attr("transform", `translate(${size/2}, 0)`);
        // Invert up/down
        var yScale = d3.scaleLinear().domain([0, size]).range([size, 0]);

        const len = size / 150;
        var position = {"x": 0, "y": 0, "angle": Math.PI / 2};
        var stack = [];

        // Associate characters with instructions
        var instructions = {
            "0": () => {
                var newPosition = {
                    "x": position.x + len * Math.cos(position.angle),
                    "y": position.y + len * Math.sin(position.angle),
                    "angle": position.angle
                };
                svg.append("line")
                    .attr("stroke", "#006600")
                    .attr("stroke-width", 2)
                    .attr("x1", position.x).attr("y1", yScale(position.y))
                    .attr("x2", newPosition.x).attr("y2", yScale(newPosition.y));
                position = newPosition;
            },
            "1": () => {
                var newPosition = {
                    "x": position.x + len * Math.cos(position.angle),
                    "y": position.y + len * Math.sin(position.angle),
                    "angle": position.angle
                };
                svg.append("line")
                    .attr("stroke", "#604020")
                    .attr("stroke-width", 2)
                    .attr("x1", position.x).attr("y1", yScale(position.y))
                    .attr("x2", newPosition.x).attr("y2", yScale(newPosition.y));
                position = newPosition;
            },
            "[": () => {
                stack.push(Object.assign({}, position));
                position.angle += Math.PI / 4; // Turn lef 45[deg]
            },
            "]":() => {
                position = stack.pop();
                position.angle -= Math.PI / 4; // Turn right 45[deg]
            }
        };
        // Draw
        data.split("").forEach((s) => { instructions[s](); });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
            <Grid container spacing={24}>
                <Grid item sm={8} xs={12}>
                    <Paper ref="paper" className={classes.paper}>
                        <div ref="adjuster">
                            <svg ref="svg"></svg>
                        </div>
                    </Paper>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <div className={classes.settings}>
                        TODO
                    </div>
                </Grid>
            </Grid>
            </div>
        );
    }
}


export default withStyles(styles)(LsystemComponent);
