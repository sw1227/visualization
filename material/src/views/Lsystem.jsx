import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import * as d3 from "d3";
import Frame from "./common/Frame.jsx";


// Calculate the size
const leftWidth = window.innerWidth > 599 ? window.innerWidth*2/3 : window.innerWidth;
const squareSize = Math.min(leftWidth - 2*15, window.innerHeight - 70 - 2*15);


// Define L-system
const Lsystem = function(start, rule) {

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
const rule = {
    "1": "11",
    "0": "1[0]0",
    "[": "[",
    "]": "]"
};


class LsystemComponent extends React.Component {
    componentDidMount() {
        const lsystem = new Lsystem("0", rule);
        d3.range(7).forEach(() => {lsystem.update();});
        this.drawTree(lsystem.state);
    }

    drawTree(data) {
        // adjust to width
        const svg = d3.select(this.refs.svg).append("g")
            .attr("transform", `translate(${squareSize/2}, 0)`);
        // Invert up/down
        const yScale = d3.scaleLinear().domain([0, squareSize]).range([squareSize, 0]);

        const len = squareSize / 150;
        let position = {"x": 0, "y": 0, "angle": Math.PI / 2};
        const stack = [];

        // Associate characters with instructions
        const instructions = {
            "0": () => {
                const newPosition = {
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
                const newPosition = {
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
            <Frame title="L-system">
                <GridContainer>
                    <GridItem sm={8} xs={12}>
                        {/* left */}
                        <Card className={classes.card}>
                            <svg ref="svg" width={squareSize} height={squareSize}></svg>
                        </Card>
                    </GridItem>
                    <GridItem sm={4} xs={12} className={classes.rightContainer}>
                        {/* right */}
                        <h4>Rule</h4>
                        <ul>
                            {Object.entries(rule).map(r => (
                                <li>{r[0]} => {r[1]}</li>
                            ))}
                        </ul>
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const lsystemStyle = {
    card: {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        margin: "15px",
    },
    rightContainer: {
        padding: "15px",
    },
};

export default withStyles(lsystemStyle)(LsystemComponent);
