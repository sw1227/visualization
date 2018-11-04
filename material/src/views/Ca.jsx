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


class Ca extends React.Component {
    constructor(props) {
        super(props);

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
        // Rule Slider
        nouislider.create(this.refs.rule, {
            start: [this.state.rule],
            connect: [true, false],
            step: 1,
            range: { min: 0, max: 255 }
        });
        this.refs.rule.noUiSlider.on("set", () => {
            const value = parseInt(this.refs.rule.noUiSlider.get());
            this.handleRuleChange(value);
        });

        const ca = new CellularAutomaton(this.state.initCells, this.state.rule);
        this.drawCa(ca);
    }

    drawCa(ca) {
        const margin = 20;
        const size = squareSize - 2*margin;
        const cellSize = size / this.state.numCells;

        const svg = d3.select(this.refs.svg)
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

    handleRuleChange = value => {
        // Pass callback: setState is async!
        this.setState({
            rule: value
        }, this.updateCa);
    }

    render() {
        const { classes } = this.props;

        return (
            <Frame title="1-D Cellular Automaton">
                <GridContainer>
                    <GridItem sm={8} xs={12}>
                        {/* left */}
                        <Card className={classes.card}>
                            <svg ref="svg" width={squareSize} height={squareSize}></svg>
                        </Card>
                    </GridItem>
                    <GridItem sm={4} xs={12} className={classes.rightContainer}>
                        {/* right */}
                        <div>Rule = {this.state.rule}</div>
                        <div className="slider-primary" ref={"rule"} />
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const caStyle = {
    card: {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        margin: "15px",
    },
    rightContainer: {
        padding: "15px",
    },
};

export default withStyles(caStyle)(Ca);
