import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';
import * as math from 'mathjs';


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

const styles = theme => ({
    paper: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        width:  `calc(100% - ${theme.spacing.unit*4}px)`,
        height: `calc(100% - ${theme.spacing.unit*4}px)`,
    },
    sliderRoot: {
        margin: theme.spacing.unit * 2,
        width: `calc(100% - ${theme.spacing.unit*8}px)`,
    },
    slider: {
        padding: '12px 0px',
    },
});


class Hata extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("Hata-Map");

        this.state = {
            z0: math.complex(1, 0),
            alpha: math.complex(0, -1),
            beta: math.complex(0, 0),
            gamma: math.complex(0, 0.5),
            delta: math.complex(0, 0),
            margin: 40, // left = right = top = bottom
        };
    }

    componentDidMount() {
        this.setState({
            // width = height = size
            size: Math.min(window.innerHeight - 64 - 16*2, this.refs.adjuster.offsetWidth),
        }, this.drawHata);
    }

    drawHata() {
        const svg = d3.select(this.refs.svg)
            .attr("width", this.state.size).attr("height", this.state.size);
        // <g> for points
        svg.append("g")
            .attr("class", "center")
            .attr("transform", `translate(${this.state.size/2}, ${this.state.size/2})`);
        // <g> for Axis
        svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", `translate(${this.state.size/2}, ${this.state.size-this.state.margin})`);
        svg.append("g")
            .attr("class", "yaxis")
            .attr("transform", `translate(${this.state.margin}, ${this.state.size/2})`);
        this.updateHata();
    }

    updateHata() {
        const hata = new HataMap(this.state);
        d3.range(12).forEach(() => hata.next());

        // Scale
        const xScale = d3.scaleLinear()
            .domain(d3.extent(hata.points, x => x.re))
            .range([-this.state.size / 2 + this.state.margin,  this.state.size / 2 - this.state.margin]);
        const yScale = d3.scaleLinear()
            .domain(d3.extent(hata.points, x => x.im))
            .range([ this.state.size / 2 - this.state.margin, -this.state.size / 2 + this.state.margin]);

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

    handleSliderChange = (name) => (event, value) => {
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
            <Grid container spacing={24}>
                {/* SVG */}
                <Grid item sm={8} xs={12}>
                    <Paper className={classes.paper}>
                        <div ref="adjuster">
                            <svg ref="svg"></svg>
                        </div>
                    </Paper>
                </Grid>

                {/* Info */}
                <Grid item sm={4} xs={12}>
                    {/* なぜかrender()内のreturn外でFunctional Componentだと遅い */}
                    {["z0", "alpha", "beta", "gamma", "delta"].map(param => (
                        <div className={classes.sliderRoot} key={param}>
                            <Typography id={`${param}-label`}>{param} = {this.state[param].toString()}</Typography>
                            <Slider
                                classes={{ container: classes.slider }}
                                value={this.state[param].re}
                                min={-1} max={1} step={0.1}
                                aria-labelledby={`${param}-label`}
                                onChange={this.handleSliderChange(`${param}-re`)}
                            />
                            <Slider
                                classes={{ container: classes.slider }}
                                value={this.state[param].im}
                                min={-1} max={1} step={0.1}
                                aria-labelledby={`${param}-label`}
                                onChange={this.handleSliderChange(`${param}-im`)}
                            />
                        </div>
                    ))}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Hata);
