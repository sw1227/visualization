import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "components/Card/Card.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import * as d3 from "d3";
import Frame from "./common/Frame.jsx";
import Imshow from "./common/Imshow.jsx";
import { World, createStats} from "./common/threeUtil";

// Elevation version of "https://beta.observablehq.com/@mbostock/quadtree-art"

// Calculate the size
const leftWidth = window.innerWidth > 599 ? window.innerWidth*2/3 : window.innerWidth;
const squareSize = Math.min(leftWidth - 2*15, window.innerHeight - 70 - 2*15);
const rightWidth = window.innerWidth > 599 ? window.innerWidth*1/3 : window.innerWidth;
const smallSize = rightWidth - 2*15;

const Quad = function (tile, x, y, areaParam) {
    this.x = x;
    this.y = y;
    this.tile = tile;
    this.areaParam = areaParam;
    this.height = tile.length;
    this.width = tile[0].length;
    this.mean = d3.mean([].concat.apply([], tile)); // Mean elevation
    this.score = d3.variance([].concat.apply([], tile)) / (this.width * this.height) ** areaParam

    this.split = function () {
        const dx = this.width / 2;
        const dy = this.height / 2;
        return [
            new Quad(this.tile.slice(0, dy).map(row => row.slice(0, dx)),
                this.x, this.y, this.areaParam),
            new Quad(this.tile.slice(0, dy).map(row => row.slice(dx, this.width)),
                this.x + dx, this.y, this.areaParam),
            new Quad(this.tile.slice(dy, this.height).map(row => row.slice(0, dx)),
                this.x, this.y + dy, this.areaParam),
            new Quad(this.tile.slice(dy, this.height).map(row => row.slice(dx, this.width)),
                this.x + dx, this.y + dy, this.areaParam)
        ];
    }
}

// Fetch elevation tile from Japanese government and resolve
function fetchTile(coord) {
    return new Promise(resolve => {
        fetch(`https://cyberjapandata.gsi.go.jp/xyz/dem/${coord.z}/${coord.x}/${coord.y}.txt`)
            .then(response => response.text())
            .then(text => text.split("\n"))
            .then(rows => rows.slice(0, rows.length - 1)) // Last row: empty
            .then(rows => rows.map(r => r.split(",").map(d => d === "e" ? 0 : parseFloat(d)))) // e: sea
            .then(data => resolve(data))
            .catch(error => console.log(error));
    });
}


class QuadComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            size: { width: squareSize, height: squareSize },
            imshowData: [0],
            tileCoord: {z: 10, x: 906, y: 404}, // Tile coordinate of Mt.Fuji
            areaParam: 0.25,
            splitCount: 300,
            colorScale: d => d3.interpolateYlGnBu(1-d),
        };
    }

    componentDidMount() {
        fetchTile(this.state.tileCoord)
            .then(d => {
                // Imshow raw elevation data
                const imshowScale = d3.scaleLinear()
                    .domain(d3.extent([].concat.apply([], d)))
                    .range([0, 1]);

                this.setState({
                    tileData: d,
                    imshowData: [].concat.apply([], d).map(imshowScale),
                }, this.drawQuad);
            });
    }

    drawQuad = () => {
        // Compute Quadtree
        let quads = [ new Quad(this.state.tileData, 0, 0, this.state.areaParam) ];
        const indivisibles = [];

        // Split the Quad with highest score
        d3.range(this.state.splitCount).forEach(() => {
            const highest = quads.pop();
            if (highest.height === 1 || highest.width === 1) {
                indivisibles.push(highest);
            } else {
                quads = quads.concat(highest.split()).sort((a, b) => a.score > b.score ? 1 : -1);
            }
        });
        quads = quads.concat(indivisibles);

        // Draw Squares
        this.drawSvg(quads);

        // Draw 3D
        this.drawThree(quads);
    }

    drawSvg = quads => {
        const svg = d3.select(this.refs.svg).append("g");

        // height == width
        const xyScale = d3.scaleLinear().domain([0, this.state.tileData.length]).range([0, smallSize]);
        // elevation => [0, 1]
        const elevationScale = d3.scaleLinear()
            .domain(d3.extent([].concat.apply([], this.state.tileData))).range([0, 1]);

        svg.selectAll("rect.quad")
            .data(quads)
          .enter().append("rect")
            .attr("class", "quad")
            .attr("x", d => xyScale(d.x))
            .attr("y", d => xyScale(d.y))
            .attr("width", d => xyScale(d.width))
            .attr("height", d => xyScale(d.height))
            .attr("fill", d => this.state.colorScale(elevationScale(d.mean)));
    }

    drawThree = quads => {
        // Performance monitor
        const stats = createStats("Stats-output");

        // Create a new world!
        const world = new World("webgl", this.state.size);
        world.addCamera([0.529, -0.748, 0.293], [-0.128, 0.161, 0.99],
            world.scene.position, this.state.size.width / this.state.size.height);
        world.addAmbientLight();
        world.addSpotLight([0, 0, 4]);
        world.addTrackball();

        const sizeScale = d3.scaleLinear().domain([0, 256]).range([0, 1]);
        const posScale = d3.scaleLinear().domain([0, 256]).range([-0.5, 0.5]);
        const elevScale = d3.scaleLinear().domain([0, d3.max(quads, x => x.mean)]).range([0, 1]);

        // Draw boxes
        quads.forEach(d => {
            const boxSize = [
                sizeScale(d.tile.length),
                sizeScale(d.tile.length),
                elevScale(d.mean) / 5 // 5: adjust height
            ];
            const boxPos = [
                posScale(d.x + d.tile.length / 2),
                - posScale(d.y + d.tile.length / 2),
                elevScale(d.mean / 2) / 5 // 5: adjust height
            ];

            world.addBox(boxSize, boxPos, this.state.colorScale(elevScale(d.mean)));
        });

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
            <Frame title="Quadtree division of Mt. Fuji">
                <GridContainer>
                    <GridItem sm={8} xs={12}>
                        {/* left: canvas */}
                        <Card className={classes.largeCard}>
                            <div id="Stats-output" className={classes.stats}></div>
                            <div id="webgl" ref="webgl"></div>
                        </Card>
                    </GridItem>
                    <GridItem sm={4} xs={12} className={classes.rightContainer}>
                        {/* right */}
                        <Card className={classes.smallCard}>
                            <svg ref="svg" width={smallSize} height={smallSize}></svg>
                        </Card>
                        <Card className={classes.smallCard}>
                            <Imshow data={this.state.imshowData} interpolate={this.state.colorScale}/>
                        </Card>
                    </GridItem>
                </GridContainer>
            </Frame>
        );
    }
}


const quadStyle = {
    largeCard: {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        margin: "15px",
    },
    smallCard: {
        width: `${smallSize}px`,
        height: `${smallSize}px`,
        margin: "15px",
    },
    stats: {
        position: "absolute",
        right: 0,
        bottom: 0,
    },
};

export default withStyles(quadStyle)(QuadComponent);
