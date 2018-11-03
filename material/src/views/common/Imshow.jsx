import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as d3 from 'd3';

const styles = {
    // fit to parent
    canvas: {
        width : "100%",
        height: "100%",
    },
};


class Imshow extends React.Component {

    componentDidMount() {
        this.imshow(this.props.data, this.props.interpolate);
    }

    componentDidUpdate(prevProps) {
        if ( (this.props.data !== prevProps.data) ||
             (this.props.interpolate !== prevProps.interpolate) ) {
            this.imshow(this.props.data, this.props.interpolate);
        }
    }

    imshow(array, interpolate) {
        const canvas = d3.select(this.refs.canvas);

        const resolution = Math.sqrt(array.length);
        canvas.attr("width", resolution).attr("height", resolution);

        const context = canvas.node().getContext("2d");
        const imageData = context.createImageData(resolution, resolution);

        array.forEach((d, i) => {
            let color = isNaN(d) ? {"r": 0, "g": 0, "b": 0} : d3.color(interpolate(d));
            imageData.data[i*4  ] = color.r;
            imageData.data[i*4+1] = color.g;
            imageData.data[i*4+2] = color.b;
            imageData.data[i*4+3] = 255;
        });
        context.putImageData(imageData, 0, 0);
    }

    render() {
        const { classes } = this.props;
        return (
              <canvas className={classes.canvas}  ref="canvas"></canvas>
        );
    }
}

export default withStyles(styles)(Imshow);
