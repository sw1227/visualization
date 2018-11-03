import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import * as math from "mathjs";
import * as THREE from "three";
import * as d3 from "d3";
import Frame from "./common/Frame.jsx";
import { World, createStats} from "./common/threeUtil";


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


class CalabiYau extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            exponent: 6,
            projection: 0.4
        };
    }

    componentDidMount() {
        this.setState({
            size: {
                width: this.refs.webgl.offsetWidth,
                height: window.innerHeight - 70 - 2*15,
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

    handleChange = name => value => {
        this.setState({
            [name]: value,
        }, this.updateCalabiYau);
    }

    render() {
        const { classes } = this.props;

        return (
            <Frame title="Calabi-Yau Manifold">
                <GridContainer>
                    <GridItem sm={9} xs={12}>
                        {/* left: canvas */}
                        <Card className={classes.card}>
                            <div id="Stats-output" className={classes.stats}></div>
                            <div id="calabiyau" ref="webgl"></div>
                        </Card>
                    </GridItem>
                    <GridItem sm={3} xs={12} className={classes.rightContainer}>
                        {/* right */}
                        <CustomDropdown
                            buttonText={`Exponent: ${this.state.exponent}`}
                            buttonProps={{
                                color: "transparent"
                            }}
                            dropdownList={d3.range(2, 9).map(d => (
                                <div onClick={() => this.handleChange("exponent")(d)}>{d}</div>
                            ))}
                        />
                        <CustomDropdown
                            buttonText={`Projection: ${this.state.projection}`}
                            buttonProps={{
                                color: "transparent"
                            }}
                            dropdownList={d3.range(0, 2 * math.PI, 0.4).map(d => (
                                <div onClick={() => this.handleChange("projection")(Math.round(10 * d) / 10)}>{Math.round(10 * d) / 10}</div>
                            ))}
                        />
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const calabiYauStyle = {
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
    rightContainer: {
        padding: "15px",
    },
};

export default withStyles(calabiYauStyle)(CalabiYau);
