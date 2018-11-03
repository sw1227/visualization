import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import Frame from "../common/Frame.jsx";

class IndexPage extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Frame title="Visualizations">
                <p>Hello, world!</p>
                {/* TODO: List of categories */}
            </Frame>
        );
    }
}

const indexPageStyle = {
    // container: {
    //     marginTop: "70px",
    // },
};

export default withStyles(indexPageStyle)(IndexPage);
