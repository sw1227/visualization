import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import SettingsIcon from "@material-ui/icons/Settings";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Frame from "./common/Frame.jsx";
import { createStats, luminaryTexture } from "./common/threeUtil.js";
import World from "./common/world.js"
import { fetchTile } from "./common/util.js";

const glHeight = window.innerHeight - 70 - 2*15;


class Nabewari3D extends React.Component {
    constructor(props) {
        super(props);
        this.pointsName = "points";
        this.state = {
            modal: false,
            style: "points",
        };
    }
    componentDidMount() {
        fetchTile({z: 13, x: 7262, y: 3232}).then(d => {
            this.setState({
                tileData: d,
                size: {
                    width: this.refs.webgl.offsetWidth,
                    height: glHeight,
                },
            }, this.initWebgl);
        });
    }

    initWebgl = () => {
        // Performance monitor
        const stats = createStats("Stats-output");

        // Create a new world!
        const world = new World("webgl", this.state.size, true, "#333333");
        world.addCamera([0, -1, 0.5], [0, 0, 1], world.scene.position,
            this.state.size.width/this.state.size.height);
        world.addTrackball();

        this.setState(
            { world: world },
            () => this.drawNabewari(this.state.style)
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

    drawNabewari = style => {
        switch (style) {
            case "points":
                this.state.world.addPoints(
                    this.pointsName,
                    { width: 1, height: 1 }, // size
                    [this.state.tileData.length - 1, this.state.tileData[0].length - 1], // shape
                    luminaryTexture(), // texture
                    0.02 // point size
                );
                break;
            case "wireframe":
                this.state.world.addWireframe(
                    this.pointsName,
                    { width: 1, height: 1 },
                    [this.state.tileData.length - 1, this.state.tileData[0].length - 1], // shape
                )
                break;
        }
        const heightScale = elev => ((elev-350)/4000); // TODO: calculate correct scale
        this.state.world.updatePointHeight(
            this.pointsName,
            [].concat.apply([], this.state.tileData).map(heightScale)
        );
    }

    handleMaterialChange = style => () => {
        this.state.world.removeAll();
        this.drawNabewari(style);
        this.setState({
            style: style,
        });
    }

    handleModal = modalBool => () => {
        this.setState({ modal: modalBool });
    }

    render() {
        const { classes } = this.props;

        return (
            <Frame title="Mt. Nabewari">
                <GridContainer>
                    <GridItem sm={12} xs={12}>
                        <Card className={classes.largeCard}>
                            <div id="Stats-output" className={classes.stats}></div>

                            <Button
                                className={classes.modalButton}
                                color="primary"
                                round
                                onClick={this.handleModal(true)}
                            >
                                <SettingsIcon /> Setting
                            </Button>

                            <Dialog
                                open={this.state.modal}
                                classes={{
                                    paper: classes.modal,
                                }}
                                keepMounted
                                onClose={this.handleModal(false)}
                                aria-labelledby="modal-slide-title"
                                aria-describedby="modal-slide-description">
                                <DialogContent
                                    id="modal-slide-description"
                                    className={classes.modalBody}>
                                    <h5>Geometry Style</h5>
                                    <CustomDropdown
                                        buttonText={`Style: ${this.state.style}`}
                                        buttonProps={{
                                            color: "transparent"
                                        }}
                                        dropdownList={["points", "wireframe"].map(d => (
                                            <div onClick={this.handleMaterialChange(d)}>{d}</div>
                                        ))}
                                    />
                                </DialogContent>
                            </Dialog>
                            <div id="webgl" ref="webgl" className={classes.webgl}></div>
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
        zIndex: "1"
    },
    webgl: {
        zIndex: "0",
    },
    modalButton: {
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: "1",
    },
    modal: {
        margin: "0px",
        padding: "24px",
        paddingTop: "0px",
        width: "300px",
    },
    modalBody: {
        margin: "0px",
        padding: "0px",
    },
};

export default withStyles(nabewariStyle)(Nabewari3D);
