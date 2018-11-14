import React from "react";
import * as d3 from "d3";


export default class Imshow extends React.Component {
    componentDidMount() {
        this.imshow();
    }

    componentDidUpdate(prevProps) {
        if ( (this.props.data!==prevProps.data) || (this.props.interpolate!==prevProps.interpolate) ) {
            this.imshow();
        }
    }

    imshow = () => {
        const canvas = this.refs.canvas;

        // Square only
        const resolution = Math.sqrt(this.props.data.length);
        ["width", "height"].forEach(a => canvas.setAttribute(a, resolution));

        const context = canvas.getContext("2d");
        const imageData = context.createImageData(resolution, resolution);

        this.props.data.forEach((d, i) => {
            let color = isNaN(d) ? {r: 0, g: 0, b: 0} : d3.color(this.props.interpolate(d));
            imageData.data[i*4  ] = color.r;
            imageData.data[i*4+1] = color.g;
            imageData.data[i*4+2] = color.b;
            imageData.data[i*4+3] = 255;
        });
        context.putImageData(imageData, 0, 0);
    }

    render() {
        return (
            <canvas style={{ width: "100%", height: "100%" }} ref="canvas" />
        );
    }
}
