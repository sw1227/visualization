import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import * as d3 from 'd3';
import Imshow from './Imshow';


// Returns a inverting function
function circleInverter(cx, cy, r) {
    return (x, y) => [
        cx + r**2 * (x - cx) / ((x - cx)**2 + (y - cy)**2), // inverse x
        cy + r**2 * (y - cy) / ((x - cx)**2 + (y - cy)**2)  // inverse y
    ]
}

// Calculate proximity to lattice
function latticeProximity(x, y, alpha=0.01) {
    // alpha: prevent divergence of log - the smaller the sharper
    const dx = - Math.log(alpha + Math.abs(x - Math.round(x)));
    const dy = - Math.log(alpha + Math.abs(y - Math.round(y)));
    // Normalize
    const minVal = - 2 * Math.log(alpha + 0.5);
    const maxVal = - 2 * Math.log(alpha);
    return (dx + dy - minVal) / (maxVal - minVal); // range [0, 1]
}

// (x, y) => 0 or 1
function checkerBoard(x, y) {
    return Math.abs(Math.abs(Math.floor(x) % 2) - Math.abs(Math.floor(y) % 2));
}

const colors = [
    {"name": "Purple-Blue", "scale": d3.interpolatePuBu},
    {"name": "Blue-Green", "scale": d3.interpolateBuGn},
    {"name": "Viridis", "scale": d3.interpolateViridis},
    {"name": "Inferno", "scale": d3.interpolateInferno},
    {"name": "Warm", "scale": d3.interpolateWarm},
    {"name": "Cool", "scale": d3.interpolateCool},
    {"name": "Rainbow", "scale": d3.interpolateSinebow},
];

const methods = [
    {"name": "Lattice", "function": latticeProximity},
    {"name": "CheckerBoard", "function": checkerBoard}
];


const styles = theme => ({
    paper: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        // Or make a parent <div> of height=width=100vmin
        width:  `calc(100% - ${theme.spacing.unit*4}px)`,
        height: `calc(100% - ${theme.spacing.unit*4}px)`,
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        marginTop: theme.spacing.unit * 2,
        marginLeft: 12,
        marginRight: 12,
        minWidth: 150,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});


class Inversion extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("Circle Inversion");

        this.state = {
            data: this.computeData(methods[0]),
            interpolate: colors[0],
            method: methods[0],
        };
    }

    computeData = method => {
        const resolution = 800; // # of pixels
        const range = 1.2; // drawing range
        const invert = circleInverter(0, 0, 1); // inversion by unit circle

        const invertedLattice = d3.cross(
            d3.range(-range, range, 2*range/resolution),
            d3.range(-range, range, 2*range/resolution)
        ).map(coord => method.function(...invert(...coord)));

        return invertedLattice;
    }

    handleColorChange = event => {
        this.setState({
            [event.target.name]: colors.filter(c => c.name===event.target.value)[0]
        });
    };

    handleMethodChange = event => {
        const newMethod = methods.filter(m => m.name===event.target.value)[0];
        this.setState({
            [event.target.name]: newMethod,
            data: this.computeData(newMethod)
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid container spacing={24}>
              <Grid item sm={8}>
                <Paper className={classes.paper}>
                  <Imshow data={this.state.data} interpolate={this.state.interpolate.scale}/>
                </Paper>
              </Grid>
              <Grid item sm={4}>

                <form className={classes.root} autoComplete="off">
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="color-scale">Color Scale</InputLabel>
                    <Select
                      value={this.state.interpolate.name}
                      onChange={this.handleColorChange}
                      inputProps={{
                          name: 'interpolate',
                          id: 'color-scale',
                      }}
                      autoWidth
                      >
                      <MenuItem value={"Purple-Blue"}>Purple-Blue</MenuItem>
                      <MenuItem value={"Blue-Green"}>Blue-Green</MenuItem>
                      <MenuItem value={"Viridis"}>Viridis</MenuItem>
                      <MenuItem value={"Inferno"}>Inferno</MenuItem>
                      <MenuItem value={"Warm"}>Warm</MenuItem>
                      <MenuItem value={"Cool"}>Cool</MenuItem>
                      <MenuItem value={"Rainbow"}>Rainbow</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="method">Method</InputLabel>
                    <Select
                      value={this.state.method.name}
                      onChange={this.handleMethodChange}
                      inputProps={{
                          name: 'method',
                          id: 'method',
                      }}
                      className={classes.selectEmpty}
                      autoWidth
                      >
                      <MenuItem value={"Lattice"}>Lattice</MenuItem>
                      <MenuItem value={"CheckerBoard"}>CheckerBoard</MenuItem>
                    </Select>
                  </FormControl>
                </form>

              </Grid>
            </Grid>
        );
    }
}


export default withStyles(styles)(Inversion);
