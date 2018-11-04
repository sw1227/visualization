import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import nouislider from "nouislider";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import * as d3 from "d3";
import * as math from "mathjs";
import Frame from "./common/Frame.jsx";


// Calculate the size of svg
const leftWidth = window.innerWidth > 599 ? window.innerWidth*2/3 : window.innerWidth;
const squareSize = Math.min(leftWidth - 2*15, window.innerHeight - 70 - 2*15);


// Calculate Hata-map
const HataMap = function(params) {
    // Initialize
    this.points = [params.z0];
    this.params = params

    // One-step forward
    this.next = function() {
        const next = [];
        this.points.forEach(p => {
            next.push(
                this.params.alpha.mul(p)
                    .add(this.params.beta.mul(p.conjugate()))
            );
            next.push(
                this.params.gamma.mul(p.sub(1))
                    .add(this.params.delta.mul(p.conjugate().sub(1)))
                    .add(1)
            );
        });
        this.points = next;
    }
}


class Hata extends React.Component {
    constructor(props) {
        super(props);

        this.margin = 40; // left = right = top = bottom
        this.state = {
            z0:    math.complex(1,   0),
            alpha: math.complex(0,  -1),
            beta:  math.complex(0,   0),
            gamma: math.complex(0, 0.5),
            delta: math.complex(0,   0),
        };
    }

    componentDidMount() {
        // Set up sliders for each parameter (complex)
        ["z0", "alpha", "beta", "gamma", "delta"].forEach(param => {
            ["re", "im"].forEach(part => {
                nouislider.create(this.refs[`slider-${param}-${part}`], {
                    start: [this.state[param][part]],
                    connect: [true, false],
                    step: 0.1,
                    range: { min: -1, max: 1 }
                });
                this.refs[`slider-${param}-${part}`].noUiSlider.on("set", () => {
                    const value = this.refs[`slider-${param}-${part}`].noUiSlider.get();
                    this.handleSliderChange(`${param}-${part}`)(value);
                });
            });
         });
        this.drawHata();
    }

    drawHata() {
        const svg = d3.select(this.refs.svg);
        // <g> for points
        svg.append("g")
            .attr("class", "center")
            .attr("transform", `translate(${squareSize/2}, ${squareSize/2})`);
        // <g> for Axis
        svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", `translate(${squareSize/2}, ${squareSize-this.margin})`);
        svg.append("g")
            .attr("class", "yaxis")
            .attr("transform", `translate(${this.margin}, ${squareSize/2})`);
        this.updateHata();
    }

    updateHata() {
        const hata = new HataMap(this.state);
        d3.range(12).forEach(() => hata.next());

        // Scale
        const xScale = d3.scaleLinear()
            .domain(d3.extent(hata.points, x => x.re))
            .range([-squareSize / 2 + this.margin,  squareSize / 2 - this.margin]);
        const yScale = d3.scaleLinear()
            .domain(d3.extent(hata.points, x => x.im))
            .range([ squareSize / 2 - this.margin, -squareSize / 2 + this.margin]);

        // Axis
        d3.select("svg g.xaxis").call(d3.axisBottom(xScale));
        d3.select("svg g.yaxis").call(d3.axisLeft(yScale));

        // Draw points
        const circle = d3.select("svg g.center").selectAll("circle.point")
            .data(hata.points);
        circle.enter().append("circle")
            .attr("class", "point")
            .attr("fill", (d, i) => d3.color(d3.interpolateYlGnBu(i / hata.points.length)).hex())
            .attr("fill-opacity", 0.5)
            .attr("r", 2)
          .merge(circle)
            .attr("cx", d => xScale(d.re))
            .attr("cy", d => yScale(d.im));
    }

    handleSliderChange = name => value => {
        const param = name.split("-")[0];
        const part  = name.split("-")[1];
        const previous = this.state[param];
        this.setState({
            [param]: math.complex(
                part==="re" ? math.round(value, 1) : previous.re,
                part==="im" ? math.round(value, 1) : previous.im
            )
        }, this.updateHata);
    }

    render() {
        const { classes } = this.props;

        return (
            <Frame title="Hata-map">
                <GridContainer>
                    <GridItem sm={8} xs={12}>
                        {/* left */}
                        <Card className={classes.card}>
                            <svg ref="svg" width={squareSize} height={squareSize}></svg>
                        </Card>
                    </GridItem>
                    <GridItem sm={4} xs={12} className={classes.rightContainer}>
                        {/* right */}
                        {["z0", "alpha", "beta", "gamma", "delta"].map(param => (
                            <div key={param}>
                                <div>{param} = {this.state[param].toString()}</div>
                                <div className="slider-primary" ref={`slider-${param}-re`} />
                                <div className="slider-primary" ref={`slider-${param}-im`} />
                            </div>
                        ))}
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const hataStyle = {
    card: {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        margin: "15px",
    },
    rightContainer: {
        padding: "15px",
    },
};

export default withStyles(hataStyle)(Hata);
