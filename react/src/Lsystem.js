import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import * as d3 from "d3";

const shape = {width: 600, height: 600};

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
    paper: {
        marginTop: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 2,
        padding: 0,
        width: shape.width,
        height: shape.height,
    },
});

class LsystemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("L-system");
    }

    componentDidMount() {
        var lsystem = new Lsystem("0", rule);
        d3.range(7).forEach(() => {lsystem.update();});
        this.drawTree(lsystem.state);
    }

    drawTree(data) {
        var svg = d3.select(this.refs.svg).append("g")
            .attr("transform", `translate(${shape.width/2}, 0)`);
        // Invert up/down
        var yScale = d3.scaleLinear().domain([0, shape.height]).range([shape.height, 0]);

        const len = 4;
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
            <Paper className={classes.paper}>
              <svg ref="svg" width={shape.width} height={shape.height}></svg>
            </Paper>
        );
    }
}


export default withStyles(styles)(LsystemComponent);
