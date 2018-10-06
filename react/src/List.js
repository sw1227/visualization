import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import LayersIcon from '@material-ui/icons/LayersOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CodeIcon from '@material-ui/icons/CodeOutlined';
import MapIcon from '@material-ui/icons/MapOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import TerrainIcon from '@material-ui/icons/TerrainOutlined';
import PaletteIcon from '@material-ui/icons/PaletteOutlined';
import LensIcon from '@material-ui/icons/LensOutlined';
import Divider from '@material-ui/core/Divider';


const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: theme.palette.background.paper,
    },

    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});


class NestedList extends React.Component {
    state = {
        open: {
            "geo": false,
            "math": true,
        },
        selectedIndex: 0,
    };

    handleCollapse = (name) => {
        let open = {...this.state.open};
        open[name] = !open[name];
        this.setState({open: open});
    };

    handleListItemClick = (event, index) => {
        this.props.callback();
        this.setState({ selectedIndex: index });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
              <List
                component="nav"
                subheader={<ListSubheader component="div">Nested List Items</ListSubheader>}
                >

                <Divider />
                <ListItem button component={Link} to="/"
                          selected={this.state.selectedIndex === 0}
                          onClick={event => this.handleListItemClick(event, 0)}
                  >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home"/>
                </ListItem>
                <Divider />

                <ListItem button onClick={() => this.handleCollapse("geo")}>
                  <ListItemIcon>
                    <LayersIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Geo" />
                  {this.state.open.geo ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={this.state.open.geo} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Divider />
                    <ListItem button className={classes.nested} component={Link} to="/road-direction"
                              selected={this.state.selectedIndex === 1}
                              onClick={event => this.handleListItemClick(event, 1)}
                      >
                      <ListItemIcon>
                        <MapIcon />
                      </ListItemIcon>
                      <ListItemText inset primary="Road Direction"/>
                    </ListItem>

                    <ListItem button className={classes.nested} component={Link} to="/terrain"
                              selected={this.state.selectedIndex === 2}
                              onClick={event => this.handleListItemClick(event, 2)}
                      >
                      <ListItemIcon>
                        <TerrainIcon />
                      </ListItemIcon>
                      <ListItemText inset primary="Terrain" />
                    </ListItem>

                  </List>
                </Collapse>
                <Divider />

                <ListItem button onClick={() => this.handleCollapse("math")}>
                  <ListItemIcon>
                    <PaletteIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Math" />
                  {this.state.open.math ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={this.state.open.math} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Divider />
                    <ListItem button className={classes.nested}  component={Link} to="/lsystem"
                              selected={this.state.selectedIndex === 3}
                              onClick={event => this.handleListItemClick(event, 3)}
                      >
                      <ListItemIcon>
                        <CodeIcon />
                      </ListItemIcon>
                      <ListItemText inset primary="L-system" />
                    </ListItem>

                    <ListItem button className={classes.nested}  component={Link} to="/inversion"
                              selected={this.state.selectedIndex === 4}
                              onClick={event => this.handleListItemClick(event, 4)}
                      >
                      <ListItemIcon>
                        <LensIcon />
                      </ListItemIcon>
                      <ListItemText inset primary="Circle Inversion" />
                    </ListItem>

                  </List>
                </Collapse>
                <Divider />

              </List>
            </div>
        );
    }
}


NestedList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NestedList);
