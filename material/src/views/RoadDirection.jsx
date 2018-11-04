import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Refresh from "@material-ui/icons/Refresh";
import BarChart from "@material-ui/icons/BarChart";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import * as d3 from "d3";
import L from "leaflet";
import Frame from "./common/Frame.jsx";
import { getTileCoords, direction } from "./common/util.js";

const mapHeight = window.innerHeight - 70 - 2*15;
const svgSize = Math.min(window.innerWidth / 2, 400);

class RoadDirection extends React.Component {
    constructor(props) {
        super(props);

        this.apiUrl = "https://wwnc2qo1x8.execute-api.ap-northeast-1.amazonaws.com/dev/road";
        this.maxRadius = svgSize / 2.1;
        this.histSplit = 18;
        this.state = {
            roadLayers: [],
            directions: [],
            zoom: 16,
        };
    }
    componentDidMount() {
        const map = L.map("map").setView([35.691167, 139.767052], this.state.zoom);
        map.on("zoomend", e => {
            this.setState({zoom: e.target._zoom})
        });

        L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
        }).addTo(map);

        this.drawHist();

        this.setState({map: map}, () => {
            this.fetchRoadTiles();
        });
    }

    getCurrentBounds = () => {
        // Get bounding box of tile coordinates in the current view
        const zoom = this.state.map.getZoom();
        const bounds = this.state.map.getBounds();
        return {
            "northEast": getTileCoords(bounds._northEast.lat, bounds._northEast.lng, zoom),
            "southWest": getTileCoords(bounds._southWest.lat, bounds._southWest.lng, zoom)
        };
    }

    // Fetch all road GeoJSONs in the current bounding box and update Histogram
    // TODO: onMove, length-based histogram, zoom support
    fetchRoadTiles = () => {
        // Tile coordinate in the current view
        const bounds = this.getCurrentBounds();
        const xs = d3.range(bounds.southWest.x, bounds.northEast.x + 1);
        const ys = d3.range(bounds.northEast.y, bounds.southWest.y + 1);

        // Get all vector tiles asynchronously
        d3.cross(xs, ys).forEach(c => {
            d3.json(`${this.apiUrl}?x=${c[0]}&y=${c[1]}`)
                .then(data => {
                    // Draw GeoJSON layer on map
                    const layer = L.geoJSON(data);

                    this.setState({
                        roadLayers: this.state.roadLayers.concat(layer),
                    });
                    layer.addTo(this.state.map);

                    // Calculate direction of path
                    let directions = this.state.directions;
                    data.features.forEach(f => {
                        const coords = f.geometry.coordinates;
                        for (let i = 0; i < coords.length - 1; i++) {
                            // symmetry
                            directions.push(direction(coords[i], coords[i + 1]));
                            directions.push(direction(coords[i + 1], coords[i]));
                        }
                    });
                    this.setState({
                        directions: directions,
                    }, this.updateHist(this.state.directions));
                })
                .catch(error => { throw error; });
        });
    }

    drawHist = () => {
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = svgSize - margin.left - margin.right;
        const height = svgSize - margin.top - margin.bottom;

        const svg = d3.select(this.refs.svg)
          .append("g")
            .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        svg.append("circle")
            .attr("cx", 0).attr("cy", 0)
            .attr("r", this.maxRadius)
            .attr("style", "stroke: #aaa; stroke-width: 1; fill: none;");

        this.updateHist([]);
    }

    updateHist = data => {
        const histogram = d3.histogram()
            .value(d => d)
            .domain([-Math.PI, Math.PI])
            .thresholds(d3.range(-Math.PI, Math.PI, Math.PI / this.histSplit));
        const bins = histogram(data)

        const rScale = d3.scaleLinear()
            .domain([0, d3.max(bins.map(x => x.length))])
            .range([0, this.maxRadius]);

        const arc = d3.arc()
            .innerRadius(0).outerRadius(d => rScale(d.length))
            .startAngle(d => Math.PI / 2 - d.x0)
            .endAngle(d => Math.PI / 2 - d.x1);

        const path = d3.select(this.refs.svg).select("g")
            .selectAll("path")
            .data(bins);
        path.enter().append("path")
            .merge(path)
            .attr("d", arc)
            .attr("fill", (d, i) => d3.interpolateRainbow(i / this.histSplit));
    }

    refresh = () => {
        // remove road layers
        this.state.roadLayers.forEach(l => this.state.map.removeLayer(l));

        // refresh histogram
        this.setState({
            roadLayers: [],
            directions: [],
        });
        this.updateHist([]);
    }

    render() {
        const { classes } = this.props;
        return (
            <Frame title="Road Direction Histogram">
                <GridContainer>
                    <GridItem sm={12} xs={12}>
                        <Card className={classes.card}>
                            <div id="map" className={classes.map}></div>
                            <div className={classes.graph}>
                                <svg ref="svg" width={svgSize} height={svgSize}></svg>
                            </div>
                            <Button
                                color="primary"
                                round
                                className={classes.refreshButton}
                                onClick={this.refresh}>
                                <Refresh />Refresh
                            </Button>
                            <Button
                                disabled={this.state.zoom != 16}
                                color="primary"
                                round
                                className={classes.drawButton}
                                onClick={this.fetchRoadTiles}>
                                <BarChart />Draw Histogram {this.state.zoom!=16 ? "(zoom=16 only)" : ""}
                            </Button>
                            <p className={classes.zoom}>zoom={this.state.zoom}</p>
                        </Card>
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const roadDirectionStyle = {
    card: {
        width: `calc(100% - ${2*15}px)`,
        height: `${mapHeight}px`,
        margin: "15px",
    },
    map: {
        width: "100%",
        height: "100%",
        zIndex: 1,
    },
    graph: {
        width: `${svgSize}px`,
        height: `${svgSize}px`,
        zIndex: 2,
        position: "absolute",
        top: "0px",
        right: "0px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    refreshButton: {
        position: "absolute",
        bottom: "15px",
        right: "15px",
        zIndex: 3,
    },
    drawButton: {
        position: "absolute",
        bottom: "67px",
        right: "15px",
        zIndex: 3,
    },
    zoom: {
        margin: "0px",
        padding: "0px 10px",
        position: "absolute",
        bottom: "0px",
        left: "0px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        zIndex: 3,
    },
}

export default withStyles(roadDirectionStyle)(RoadDirection);
