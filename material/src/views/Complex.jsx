import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { PaletteOutlined, TextureOutlined, LeakAddOutlined } from "@material-ui/icons";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import * as d3 from "d3";
import * as math from "mathjs";
import Frame from "./common/Frame.jsx";
import Imshow from "./common/Imshow.jsx";
import { colorScales, colorMethods } from "./common/util.js";


// Calculate the size
const leftWidth = window.innerWidth > 599 ? window.innerWidth*2/3 : window.innerWidth;
const squareSize = Math.min(leftWidth - 2*15, window.innerHeight - 70 - 2*15);

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
];


class Complex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.computeData(functions[0], colorMethods[0]),
            interpolate: colorScales[0],
            function: functions[0],
            method: colorMethods[0],
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

    handleColorChange = name => {
        this.setState({
            interpolate: colorScales.filter(c => c.name===name)[0]
        });
    };

    handleFunctionChange = name => {
        const newFunc = functions.filter(f => f.name===name)[0];
        this.setState({
            function: newFunc,
            data: this.computeData(newFunc, this.state.method)
        });
    }

    handleMethodChange = name => {
        const newMethod = colorMethods.filter(m => m.name===name)[0];
        this.setState({
            method: newMethod,
            data: this.computeData(this.state.function, newMethod)
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <Frame title="Complex Function - Domain Coloring / Conformal Transformation">
                <GridContainer>
                    <GridItem sm={8} xs={12}>
                        {/* left */}
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
                            buttonText={`Function: ${this.state.function.name}`}
                            buttonProps={{
                                color: "transparent"
                            }}
                            buttonIcon={LeakAddOutlined}
                            dropdownList={functions.map(f => (
                                <div onClick={() => this.handleFunctionChange(f.name)}>
                                    {f.name}
                                </div>
                            ))}
                        />
                        <CustomDropdown
                            buttonText={`Method: ${this.state.method.name}`}
                            buttonProps={{
                                color: "transparent"
                            }}
                            buttonIcon={TextureOutlined}
                            dropdownList={colorMethods.map(m => (
                                <div onClick={() => this.handleMethodChange(m.name)}>
                                    {m.name}
                                </div>
                            ))}
                        />
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const complexStyle = {
    card: {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        margin: "15px",
    },
    rightContainer: {
        padding: "15px",
    },
};

export default withStyles(complexStyle)(Complex);
