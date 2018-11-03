import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import * as math from "mathjs";
import * as THREE from "three";
import * as d3 from "d3";
import Frame from "./common/Frame.jsx";
import { World, createStats} from "./common/threeUtil";


 // Monkey patch to the world
 World.prototype.addRiemann = function() {
    const parametricPos = (r, theta) => new THREE.Vector3(
       r * math.cos(theta),
       r * math.sin(theta),
       math.sqrt(r) * math.exp(math.i.mul(0.5).mul(theta)).re
   );

   const dR = 1 / 10;
   const dTheta = 4*math.PI / 40;
   d3.range(0, 4*math.PI, dTheta).forEach(theta => {
       d3.range(0, 2, dR).forEach(r => {
           const data = [
               {"r": r,    "theta": theta},
               {"r": r+dR, "theta": theta},
               {"r": r+dR, "theta": theta+dTheta},
               {"r": r,    "theta": theta+dTheta}
           ];
           this.addBasicRect(
               ...data.map(d => parametricPos(d.r, d.theta)),
               d3.interpolateSinebow((theta + dTheta/2) / (4*math.PI))
           );
       });
   });
};


class Riemann extends React.Component {
    componentDidMount() {
        this.setState({
            size: {
                width: this.refs.webgl.offsetWidth,
                height: window.innerHeight - 70 - 2*15,
            }
        }, this.drawRiemann);
    }

    drawRiemann() {
        // Performance monitor
        const stats = createStats("Stats-output");

        // Create a new world!
        const world = new World("riemann", this.state.size);
        world.addCamera([-2.8, -1.4, 0.24], [0.186, 0.08, 0.99], world.scene.position,
            this.state.size.width/this.state.size.height);
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
            <Frame title="Riemann surface">
                <GridContainer>
                    <GridItem sm={9} xs={12}>
                        {/* left */}
                        <Card className={classes.card}>
                            <div id="Stats-output" className={classes.stats}></div>
                            <div id="riemann" ref="webgl"></div>
                        </Card>
                    </GridItem>
                    <GridItem sm={3} xs={12} className={classes.rightContainer}>
                        {/* right */}
                        {/* TODO */}
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}

const riemannStyle = {
    card: {
        width: `calc(100% - ${2*15}px)`,
        height: `${window.innerHeight - 70 - 2*15}px`,
        margin: "15px",
    },
    stats: {
        position: "absolute",
        right: 0,
        bottom: 0,
    },
};

export default withStyles(riemannStyle)(Riemann);
