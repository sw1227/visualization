import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import * as THREE from "three";
import * as d3 from "d3";
import Frame from "./common/Frame.jsx";
import { createStats} from "./common/threeUtil";
import World from "./common/world.js"

const glHeight = window.innerHeight - 70 - 2*15;


World.prototype.addTorus = function(R=0.5, r=0.2) {
    const position = (phi, theta) => {
        const x = (R + r * Math.cos(theta)) * Math.cos(phi);
        const y = (R + r * Math.cos(theta)) * Math.sin(phi);
        const z = r * Math.sin(theta);
        return new THREE.Vector3(x, y, z);
    }

    const dTheta = Math.PI / 10;
    const dPhi   = Math.PI / 20;
    d3.range(0, 2*Math.PI, dPhi).forEach(phi => {
        d3.range(0, 2*Math.PI, dTheta).forEach(theta => {
            const data = [
                {"t": theta,        "p": phi     },
                {"t": theta+dTheta, "p": phi     },
                {"t": theta+dTheta, "p": phi+dPhi},
                {"t": theta,        "p": phi+dPhi},
            ];
            this.addNormalRect(
                ...data.map(d => position(d.p, d.t))
            );
        });
    });
}


class Torus extends React.Component {
    componentDidMount() {
        this.setState({
            size: {
                width: this.refs.webgl.offsetWidth,
                height: glHeight,
            },
        }, this.initWebgl);
    }

    initWebgl = () => {
        // Performance monitor
        const stats = createStats("Stats-output");

        // Create a new world!
        const world = new World("webgl", this.state.size, true, "#333333");
        world.addCamera([0, -2, 1], [0, 0, 1], world.scene.position,
            this.state.size.width/this.state.size.height);
        world.addTrackball();
        world.addTorus();

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
            <Frame title="Torus">
                <GridContainer>
                    <GridItem sm={12} xs={12}>
                        <Card className={classes.largeCard}>
                            <div id="Stats-output" className={classes.stats}></div>
                            <div id="webgl" ref="webgl" className={classes.webgl}></div>
                        </Card>
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const torusStyle = {
    largeCard: {
        width: `calc(100% - ${2*15}px)`,
        height: `${glHeight}px`,
        margin: "15px",
    },
    stats: {
        position: "absolute",
        right: 0,
        bottom: 0,
    },
}

export default withStyles(torusStyle)(Torus);
