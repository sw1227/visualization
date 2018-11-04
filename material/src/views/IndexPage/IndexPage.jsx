import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import Frame from "../common/Frame.jsx";

const indexRoutes = [
    { path: "/harmonograph", name: "Harmonograph" },
    { path: "/inversion", name: "Inversion" },
    { path: "/calabiyau", name: "CalabiYau" },
    { path: "/riemann", name: "Riemann" },
    { path: "/hata", name: "Hata" },
    { path: "/complex", name: "Complex" },
    { path: "/ca", name: "Ca" },
    { path: "/lifegame", name: "GameOfLife" },
    { path: "/lsystem", name: "Lsystem" },
    { path: "/quad", name: "Quad" },
    { path: "/road", name: "RoadDirection" },
];

class IndexPage extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Frame title="Visualizations">
                {/* TODO: List of categories */}
                <ul>
                    {indexRoutes.map(route => (
                        <li>
                            <Link to={route.path}>
                                {route.name}
                            </Link>
                        </li>
                    ))}
                </ul>
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
