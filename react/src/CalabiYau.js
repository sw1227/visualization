import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import * as THREE from 'three';
import * as math from 'mathjs';
import * as d3 from 'd3';
import { World, createStats} from './threeUtil';


// Monkey patch to the world
World.prototype.addCalabiYau = function(n, a) {
    function coordinate(x, y, n, k1, k2, a) {
        const z1 = math.multiply(
            math.exp(math.complex(0, 2*math.PI*k1/n)),
            math.pow(math.cos(math.complex(x, y)), 2/n)
        );
        const z2 = math.multiply(
            math.exp(math.complex(0, 2*math.PI*k2/n)),
            math.pow(math.sin(math.complex(x, y)), 2/n)
        );
        return new THREE.Vector3(z1.re, z2.re, z1.im*math.cos(a) + z2.im*math.sin(a));
    }

    const dx = math.PI/10;
    const dy = math.PI/10;
    d3.cross(d3.range(n), d3.range(n)).forEach(k => {
        d3.range(0, math.PI/2, dx).forEach(x => {
            d3.range(-math.PI/2, math.PI/2, dy).forEach(y => {
                const data = [
                    {"x": x,    "y": y   },
                    {"x": x+dx, "y": y   },
                    {"x": x+dx, "y": y+dy},
                    {"x": x,    "y": y+dy},
                ];
                this.addNormalRect(
                    ...data.map(d => coordinate(d.x, d.y, n, k[0], k[1], a))
                    // d3.interpolateSinebow( ( (k[0]+k[1]) / n) % 1)
                );
            });
        });
    })
};


const styles = theme => ({
    paper: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        // Or make a parent <div> of height=width=100vmin
        width:  `calc(100% - ${theme.spacing.unit*4}px)`,
        height: `calc(100% - ${theme.spacing.unit*4}px)`,
    },
    stats: {
        position: "absolute",
        right: 0,
        bottom: 0,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        marginTop: theme.spacing.unit * 2,
        marginLeft: 12,
        marginRight: 12,
        minWidth: 150,
    },
});

class CalabiYau extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("Calabi-Yau Manifold projection");

        this.state = {
            exponent: 6,
            projection: 0.4
        };
    }

    componentDidMount() {
        this.setState({
            size: {
                "width": this.refs.webgl.offsetWidth,
                "height": window.innerHeight - 64 - 16*2
            }
        }, this.drawCalabiYau);
    }

    drawCalabiYau() {
        // Performance monitor
        const stats = createStats("Stats-output");

        // Create a new world!
        const world = new World("calabiyau", this.state.size);
        this.setState({
            world: world
        });
        world.addCamera([7, 0, 0], [0, 0, 1], world.scene.position,
            this.state.size.width/this.state.size.height);
        world.addTrackball();

        // Calabi-Yau Manifold
        world.addCalabiYau(this.state.exponent, this.state.projection);

        // Animation loop
        const animate = function () {
            stats.update();
            world.updateControls();

            // Animate
            requestAnimationFrame(animate);
            world.render();
        };
        animate();
    }

    updateCalabiYau() {
        // Remove
        this.state.world.removeAll();
        // new Calabi-Yau Manifold
        this.state.world.addCalabiYau(this.state.exponent, this.state.projection);
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        }, this.updateCalabiYau);
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container spacing={24}>
                {/* WebGL */}
                <Grid item sm={9} xs={12}>
                    <Paper className={classes.paper}>
                        <div id="Stats-output" className={classes.stats}></div>
                        <div id="calabiyau" ref="webgl"></div>
                    </Paper>
                </Grid>

                {/* Form */}
                <Grid item sm={3} xs={12}>
                    <form className={classes.container} noValidate autoComplete="off">
                        {/* Exponent */}
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="exponent">Exponent</InputLabel>
                            <Select
                                value={this.state.exponent}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'exponent',
                                    id: 'exponent',
                                }}
                                autoWidth
                            >
                                {d3.range(2, 9).map(d => (
                                    <MenuItem key={d.toString()} value={d}>{d.toString()}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* Projection */}
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="projection">Projection</InputLabel>
                            <Select
                                value={this.state.projection}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'projection',
                                    id: 'projection',
                                }}
                                autoWidth
                            >
                                {d3.range(0, 2 * math.PI, 0.4).map(d => (
                                    <MenuItem key={d.toString()} value={d}>{(Math.round(10 * d) / 10).toString()}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </form>
                </Grid>

            </Grid>

        );
    }
}


export default withStyles(styles)(CalabiYau);
