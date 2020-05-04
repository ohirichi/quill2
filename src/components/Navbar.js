import React, {useState} from 'react'
import { makeStyles, AppBar,Toolbar, Button, Menu, MenuItem, IconButton, Typography, Link  } from '@material-ui/core'
import {AccountCircle} from '@material-ui/icons'
import {connect} from 'react-redux'
import {logout} from '../store'
import { relative } from 'path'

const useStyles = makeStyles((theme)=>({
  root:{
    display:"flex",
    flexDirection:"row",
    justifyContent: "space-between"
  },
  offset:theme.mixins.toolbar,
  link:{
    color:"white",
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    borderRadius:'10%',
    '&:hover':{
      backgroundColor:'rgba(0, 0, 0, 0.1)'
    }
  },

  icon:{
    lineHeight:"2em",
    position:'relative',
    bottom:theme.spacing(0.5),
    '&:hover':{
      backgroundColor:'rgba(0, 0, 0, 0.1)'
    }
  },

  logo:{
    color:"white",
    textDecoration:"none"
  }

}))

const Navbar = ({handleClick, isLoggedIn}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
  <div>
  <AppBar>
    <Toolbar className={classes.root}>
      <Link className={classes.logo} href="/" variant="h6" underline="none">Quill</Link>
      <nav className={classes.root}>
      <Link className={classes.link} underline="none"  href="/read">READ</Link>
      <Link className={classes.link} underline="none" href="/write">WRITE</Link>
        {isLoggedIn ?  
        <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              className={classes.icon}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <Link href="/dashboard" color="inherit" underline="none"><MenuItem>DASHBOARD</MenuItem></Link>
              <MenuItem onClick={handleClick}>LOG OUT</MenuItem>
            </Menu>
        </div>
        : <Link className={classes.link} underline="none" href="/login">LOGIN</Link>}
      </nav>
      
      
    </Toolbar>

  </AppBar>
  <div className={classes.offset} />
  </div>
)}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)