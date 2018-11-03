import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";


const Frame = props => {
    const { classes } = props;
    const AppBar = () => (
        <Header
            brand={props.title}
            rightLinks={<HeaderLinks />}
            fixed
            color="primary"
        />
    );
    return (
        <React.Fragment>
            <AppBar />
            <div className={classes.container}>
                {props.children}
            </div>
        </React.Fragment>
    )
};

const frameStyle = {
    container: {
        marginTop: "70px",
        padding: "10px",
    },
};

export default withStyles(frameStyle)(Frame);
