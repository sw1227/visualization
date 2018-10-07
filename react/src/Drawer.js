import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import NestedList from './List';
import Lsystem from './Lsystem';
import Inversion from './Inversion';
import RoadDirection from './RoadDirection';

const drawerWidth = 240;
const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        position: 'absolute',
        marginLeft: drawerWidth,
        color: "#fff",
        backgroundColor: "#68b3c8",
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: {
        ...theme.mixins.toolbar,
        backgroundColor: "#68b3c8"
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: 0
    },
    titleLogo: {
        color: "#fff",
        fontSize: "1.5rem",
        textDecoration: "none"
    },
});


class ResponsiveDrawer extends React.Component {
    state = {
        mobileOpen: false,
        title: "Title",
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    render() {
        const { classes, theme } = this.props;

        const drawer = (
            <div>
              <div className={classes.toolbar}>
                <div style = {{ textAlign: "center", paddingTop: "12px" }}>
                  <Link to="/" className={classes.titleLogo}>Visualizations</Link>
                </div>
              </div>
              <NestedList callback={this.handleDrawerToggle} />
            </div>
        );

        return (
            <div className={classes.root}>
              <AppBar className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleDrawerToggle}
                    className={classes.navIconHide}
                    >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="title" color="inherit" noWrap>
                    {this.state.title}
                  </Typography>
                </Toolbar>
              </AppBar>
              <Hidden mdUp>
                <Drawer
                  variant="temporary"
                  anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                  open={this.state.mobileOpen}
                  onClose={this.handleDrawerToggle}
                  classes={{
                      paper: classes.drawerPaper,
                  }}
                  ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                  }}
                  >
                  {drawer}
                </Drawer>
              </Hidden>
              <Hidden smDown implementation="css">
                <Drawer
                  variant="permanent"
                  open
                  classes={{
                      paper: classes.drawerPaper,
                  }}
                  >
                  {drawer}
                </Drawer>
              </Hidden>
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <Route exact path="/" component={Home}/>
                <Route exact path="/road-direction" component={RoadDirection}/>
                <Route exact path="/terrain" component={Terrain}/>
                <Route exact path="/lsystem"
                       render={() => <Lsystem callback={t => this.setState({title: t})}/>}/>
                <Route exact path="/inversion"
                       render={() => <Inversion callback={t => this.setState({title: t})}/>}/>
              </main>
            </div>
        );
    }
}

// Stub
const Home = () => (
    <div>home!!!</div>
);
const Terrain = () => (
    <div>terrain!!!</div>
);


ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const StyledDrawer = withStyles(styles, { withTheme: true })(ResponsiveDrawer);

export default StyledDrawer;
