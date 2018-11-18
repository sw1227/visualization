import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Frame from "./common/Frame.jsx";
import { createStats, luminaryTexture } from "./common/threeUtil.js";
import World from "./common/world.js"
import { fetchTile } from "./common/util.js";

const glHeight = window.innerHeight - 70 - 2*15;


class Nabewari3D extends React.Component {
    componentDidMount() {
        fetchTile({z: 13, x: 7262, y: 3232}).then(d => {
            this.setState({
                tileData: d,
                size: {
                    width: this.refs.webgl.offsetWidth,
                    height: glHeight,
                },
            }, this.drawNabewari);
        });
    }

    drawNabewari = () => {
        // Performance monitor
        const stats = createStats("Stats-output");

        // Create a new world!
        const world = new World("webgl", this.state.size, true, "#333333");
        world.addCamera([0, -1, 0.5], [0, 0, 1], world.scene.position,
            this.state.size.width/this.state.size.height);
        world.addTrackball();

        const pointsName = "points";
        world.addPoints(
            pointsName,
            {width: 1, height: 1}, // size
            [this.state.tileData.length-1, this.state.tileData[0].length-1], // shape
            luminaryTexture(), // texture
            0.02 // point size
        );
        const heightScale = elev => ((elev-350)/4000); // TODO: calculate correct scale
        world.updatePointHeight(
            pointsName,
            [].concat.apply([], this.state.tileData).map(heightScale)
        );

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
            <Frame title="Mt. Nabewari">
                <GridContainer>
                    <GridItem sm={12} xs={12}>
                        <Card className={classes.largeCard}>
                            <div id="Stats-output" className={classes.stats}></div>
                            <div id="webgl" ref="webgl"></div>
                        </Card>
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const nabewariStyle = {
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
};

export default withStyles(nabewariStyle)(Nabewari3D);
