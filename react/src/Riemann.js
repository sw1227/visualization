import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as THREE from 'three';
import * as math from 'mathjs';
import * as d3 from 'd3';
import { World, createStats} from './threeUtil';


 // Monkey patch to the world
 World.prototype.addRiemann = function() {
     const parametricPos = (r, theta) => new THREE.Vector3(
        r * math.cos(theta),
        r * math.sin(theta),
        math.sqrt(r) * math.exp(math.i.mul(0.5).mul(theta)).re
    );

    const dR = 1 / 20;
    const dTheta = 4*math.PI / 80;
    d3.range(0, 4*math.PI, dTheta).forEach(theta => {
        d3.range(0, 2, dR).forEach(r => {
            const data = [
                {"r": r,    "theta": theta},
                {"r": r+dR, "theta": theta},
                {"r": r+dR, "theta": theta+dTheta},
                {"r": r,    "theta": theta+dTheta}
            ];
            this.addRect(
                ...data.map(d => parametricPos(d.r, d.theta)),
                d3.interpolateSinebow((theta + dTheta/2) / (4*math.PI))
            );
        });
    });
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

class Riemann extends React.Component {
    constructor(props) {
        super(props);
        this.props.callback("Riemann Surface of Complex Function")
    }

    componentDidMount() {
        const size = {
            "width": this.refs.webgl.offsetWidth,
            "height": window.innerHeight - 64 - 16*2
        };
        this.drawRiemann(size);
    }

    drawRiemann(size) {
        // Performance monitor
        const stats = createStats("Stats-output");

        // Create a new world!
        const world = new World("riemann", size);
        world.addCamera([-2.8, -1.4, 0.24], [0.186, 0.08, 0.99],
            world.scene.position, size.width/size.height);
        world.addAxis(100);
        world.addGrid(2, 20);
        world.addTrackball();

        // Riemann surface
        world.addRiemann();

        // Clip
        world.clip([ 1, 0, 0], 1);
        world.clip([-1, 0, 0], 1);
        world.clip([0,  1, 0], 1);
        world.clip([0, -1, 0], 1);

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
                        <div id="riemann" ref="webgl"></div>
                    </Paper>
                </Grid>

                <Grid item sm={3} xs={12}>
                </Grid>

            </Grid>

        );
    }
}


export default withStyles(styles)(Riemann);
