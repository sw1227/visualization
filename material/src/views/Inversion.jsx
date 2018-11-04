import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { PaletteOutlined, TextureOutlined } from "@material-ui/icons";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import * as d3 from "d3";
import Frame from "./common/Frame.jsx";
import Imshow from "./common/Imshow.jsx";
import { colorScales, colorMethods } from "./common/util.js";


// Calculate the size
const leftWidth = window.innerWidth > 599 ? window.innerWidth*2/3 : window.innerWidth;
const squareSize = Math.min(leftWidth - 2*15, window.innerHeight - 70 - 2*15);

const methods = colorMethods.slice(0, 2);

// Returns a inverting function
function circleInverter(cx, cy, r) {
    return (x, y) => [
        cx + r**2 * (x - cx) / ((x - cx)**2 + (y - cy)**2), // inverse x
        cy + r**2 * (y - cy) / ((x - cx)**2 + (y - cy)**2)  // inverse y
    ]
}


class Inversion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.computeData(methods[0]),
            interpolate: colorScales[0],
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

    handleColorChange = name => {
        this.setState({
            interpolate: colorScales.filter(c => c.name===name)[0],
        });
    };

    handleMethodChange = name => {
        const newMethod = methods.filter(m => m.name===name)[0];
        this.setState({
            method: newMethod,
            data: this.computeData(newMethod),
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Frame title="Circle Inversion">
                <GridContainer>
                    <GridItem sm={8} xs={12}>
                        {/* left: canvas */}
                        <Card className={classes.card}>
                            <Imshow data={this.state.data} interpolate={this.state.interpolate.scale}/>
                        </Card>
                    </GridItem>
                    <GridItem sm={4} xs={12} className={classes.rightContainer}>
                        {/* right */}
                        <CustomDropdown
                            buttonText={`Color Scale: ${this.state.interpolate.name}`}
                            buttonProps={{
                                color: "transparent"
                            }}
                            buttonIcon={PaletteOutlined}
                            dropdownList={colorScales.map(c => (
                                <div onClick={() => this.handleColorChange(c.name)}>
                                    {c.name}
                                </div>
                            ))}
                        />
                        <CustomDropdown
                            buttonText={`Method: ${this.state.method.name}`}
                            buttonProps={{
                                color: "transparent"
                            }}
                            buttonIcon={TextureOutlined}
                            dropdownList={methods.map(c => (
                                <div onClick={() => this.handleMethodChange(c.name)}>
                                    {c.name}
                                </div>
                            ))}
                        />
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const inversionStyle = {
    card: {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        margin: "15px",
    },
    rightContainer: {
        padding: "15px",
    },
};

export default withStyles(inversionStyle)(Inversion);
