import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as THREE from 'three';
import * as math from 'mathjs';
import * as d3 from 'd3';
import { World, createStats} from './threeUtil';


// Monkey patch to the world
World.prototype.addCalabiYau = function() {
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
    const n = 6;
    const a = 0.4;
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
    }
});

class CalabiYau extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("Calabi-Yau Manifold projection");
    }

    componentDidMount() {
        const size = {
            "width": this.refs.webgl.offsetWidth,
            "height": window.innerHeight - 64 - 16*2
        };
        this.drawCalabiYau(size);
    }

    drawCalabiYau(size) {
        // Performance monitor
        const stats = createStats("Stats-output");

        // Create a new world!
        const world = new World("calabiyau", size);
        world.addCamera([7, 0, 0], [0, 0, 1],
            world.scene.position, size.width/size.height);
        world.addTrackball();

        // Calabi-Yau Manifold
        world.addCalabiYau();

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

                <Grid item sm={3} xs={12}>
                </Grid>

            </Grid>

        );
    }
}


export default withStyles(styles)(CalabiYau);
