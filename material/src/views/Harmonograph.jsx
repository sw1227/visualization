import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import * as d3 from 'd3';
import * as math from 'mathjs';
import Frame from "./common/Frame.jsx";


// Calculate the size of svg
const leftWidth = window.innerWidth > 599 ? window.innerWidth*2/3 : window.innerWidth;
const squareSize = Math.min(leftWidth - 2*15, window.innerHeight - 70 - 2*15);


// Return a function which calculates the position of pendulum at "time [msec]"
//   r: maximum radis, d: dumping, f: frequency, cent: frequency ratio = 2 ^ (cent/1200)
const harmonographGenerator = (r, d=0.0001, f=2, cent=38) => (time) => [
    r * math.exp(-d*time) * math.sin(math.pow(2, cent/1200) * 2*math.PI*f* time/1000),
    r * math.exp(-d*time) * math.sin(2*math.PI*f* time/1000)
];


class Harmonograph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dumping: 0.0001,
            frequency: 2, // [Hz]
            cent: 38 // frequency ratio = 2 ^ (cent/1200)
        };
    }

    componentDidMount() {
        this.drawHarmonograph();
    }

    drawHarmonograph = () => {
        const svg = d3.select(this.refs.svg)
            .append("g")
            .attr("transform", `translate(${squareSize / 2}, ${squareSize / 2})`);

        const trajectory = [];
        // curve: trajectory => SVG path's "d"
        const curve = d3.line().curve(d3.curveCatmullRom.alpha(0.5));
        const path = svg.append("path").datum(trajectory)
            .attr("d", curve)
            .attr("stroke", "#66a").attr("stroke-width", 1)
            .attr("fill", "none");

        // animate
        const harmonograph = harmonographGenerator(
            squareSize / 2, this.state.dumping, this.state.frequency, this.state.cent
        );
        const maxSec = 100;
        const timer = d3.interval(t => {
            trajectory.push(harmonograph(t)); // t: msec
            path.datum(trajectory).attr("d", curve);
            if (t > 1000 * maxSec) { timer.stop(); };
        }, 1);
    }

    render() {
        const { classes } = this.props;
        return (
            <Frame title="Harmonograph">
                <GridContainer>
                    <GridItem sm={8} xs={12}>
                        {/* left: svg */}
                        <Card className={classes.card}>
                            <svg ref="svg" width={squareSize} height={squareSize}></svg>
                        </Card>
                    </GridItem>
                    <GridItem sm={4} xs={12}>
                        {/* right */}
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const harmonographStyle = {
    card: {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        margin: "15px",
    },
};

export default withStyles(harmonographStyle)(Harmonograph);
