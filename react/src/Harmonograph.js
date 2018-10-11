import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';
import * as math from 'mathjs';


// Return a function which calculates the position of pendulum at "time [msec]"
// r: maximum radis, d: dumping, f: frequency, cent: frequency ratio = 2 ^ (cent/1200)
const harmonographGenerator = (r, d=0.0001, f=2, cent=38) => (time) => [
        r * math.exp(-d*time) * math.sin(math.pow(2, cent/1200) * 2*math.PI*f* time/1000),
        r * math.exp(-d*time) * math.sin(2*math.PI*f* time/1000)
];


const styles = theme => ({
    paper: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        width:  `calc(100% - ${theme.spacing.unit*4}px)`,
        height: `calc(100% - ${theme.spacing.unit*4}px)`,
    },
});


class Harmonograph extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("Harmonograph");

        this.state = {
            dumping: 0.0001,
            frequency: 2, // [Hz]
            cent: 38 // frequency ratio = 2 ^ (cent/1200)
        };
    }

    componentDidMount() {
        this.drawHarmonograph();
    }

    drawHarmonograph() {
        // width = height = size
        const size = Math.min(window.innerHeight - 64 - 16*2, this.refs.adjuster.offsetWidth);
        const svg = d3.select(this.refs.svg)
            .attr("width", size).attr("height", size)
          .append("g")
            .attr("transform", `translate(${size/2}, ${size/2})`);

        const trajectory = [];
        // curve: trajectory => SVG path's "d"
        const curve = d3.line().curve(d3.curveCatmullRom.alpha(0.5));
        const path = svg.append("path").datum(trajectory)
                        .attr("d", curve)
                        .attr("stroke", "#66a").attr("stroke-width", 1)
                        .attr("fill", "none");

        // animate
        const harmonograph = harmonographGenerator(
            size/2, this.state.dumping, this.state.frequency, this.state.cent
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
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Harmonograph);
