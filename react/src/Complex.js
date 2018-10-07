import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import * as d3 from 'd3';
import * as math from 'mathjs';
import Imshow from './Imshow';

// --------- TODO: common ---------------
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

// (x, y) => Argument(angle) [-Pi, +PI] => [0, 2*PI] => [0, 1]
function normalizedArg(x, y) {
    return (math.atan2(y, x) + 2*Math.PI) % (2*Math.PI) / (2*Math.PI);
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

const functions = [
    {"name": "Log", "function": math.log},
    {"name": "Exp", "function": math.exp},
    {"name": "Sin", "function": math.sin},
    {"name": "Gamma", "function": math.gamma},
    {"name": "Sqrt", "function": math.sqrt},
    {"name": "poly1", "function": (z => z.pow(3).add(1))},
    {"name": "poly2", "function": (z => math.divide(z.pow(3).sub(1), z.sub(1)))},
    {"name": "1/z", "function": (z => math.divide(1,z))},
    {"name": "Identity", "function": (z => z)},
]

const methods = [
    {"name": "Lattice", "function": latticeProximity},
    {"name": "CheckerBoard", "function": checkerBoard},
    {"name": "Argument", "function": normalizedArg},
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

class Complex extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("Complex Function - Domain Coloring / Conformal Transformatione");

        this.state = {
            data: this.computeData(functions[0], methods[0]),
            interpolate: colors[0],
            function: functions[0],
            method: methods[0],
        }
    }

    computeData = (func, method) => {
        const resolution = 800; // # of pixels
        const range = 4; // drawing range

        const data = d3.cross(
            d3.range(-range, range, 2*range/resolution).reverse(),
            d3.range(-range, range, 2*range/resolution)
        ).map(coord => {
            const transformed = func.function(math.complex(...coord.reverse()));
            return method.function(...math.complex(transformed).toVector());
        });

        return data;
    }

    handleColorChange = event => {
        this.setState({
            [event.target.name]: colors.filter(c => c.name===event.target.value)[0]
        });
    };

    handleFunctionChange = event => {
        const newFunc = functions.filter(f => f.name===event.target.value)[0];
        this.setState({
            [event.target.name]: newFunc,
            data: this.computeData(newFunc, this.state.method)
        });
    }

    handleMethodChange = event => {
        const newMethod = methods.filter(m => m.name===event.target.value)[0];
        this.setState({
            [event.target.name]: newMethod,
            data: this.computeData(this.state.function, newMethod)
        });
    };

    render() {
        const {classes } = this.props;
        return (
            <Grid container spacing={24}>
                {/* Canvas */}
                <Grid item sm={8} xs={12}>
                    <Paper className={classes.paper}>
                        <Imshow data={this.state.data} interpolate={this.state.interpolate.scale}/>
                    </Paper>
                </Grid>

                {/* Form */}
                <Grid item sm={4} xs={12}>
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
                            <InputLabel htmlFor="complex-func">Complex Function</InputLabel>
                            <Select
                                value={this.state.function.name}
                                onChange={this.handleFunctionChange}
                                inputProps={{
                                    name: 'function',
                                    id: 'complex-func',
                                }}
                                autoWidth
                            >
                                <MenuItem value={"Log"}>Log</MenuItem>
                                <MenuItem value={"Exp"}>Exp</MenuItem>
                                <MenuItem value={"Sin"}>Sin</MenuItem>
                                <MenuItem value={"Gamma"}>Gamma</MenuItem>
                                <MenuItem value={"Sqrt"}>Sqrt</MenuItem>
                                <MenuItem value={"poly1"}>z^3 + 1</MenuItem>
                                <MenuItem value={"poly2"}>(z^3-1)/(z-1)</MenuItem>
                                <MenuItem value={"1/z"}>1/z</MenuItem>
                                <MenuItem value={"Identity"}>Identity</MenuItem>
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
                                <MenuItem value={"Argument"}>Argument</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </Grid>
            </Grid>
        );
    }
}


export default withStyles(styles)(Complex);
