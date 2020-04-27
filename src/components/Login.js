import React, {useState} from 'react';
import {connect} from 'react-redux'
import {auth} from '../store'

//#region material ui components import

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
//#endregion

//#region  Styles
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
//#endregion

//#region  Component
function SignIn(props) {
  const [newUser, setNewUser] = useState(false)
  const classes = useStyles();

  //toggle between form types - sign in vs register
  const switchForms = (e) => {
    e.preventDefault();
    setNewUser(!newUser)   
  }
  //To Do: Form Validation

  //TO DO: Forgot PW?/Remember PW
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {newUser ? "Register" : "Sign In" }
        </Typography>
        <form onSubmit = {(e)=> props.handleSubmit(e, newUser)} className={classes.form} noValidate>
            {newUser ? 
            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoFocus
          /> : null}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {newUser ? "Sign Up" : "Sign in" }
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item xs>
              <Link href="#" onClick={(e)=>switchForms(e)} variant="body2">
                {newUser ? "Existing user? Sign In" : "New User? Sign Up" }
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
//#endregion

//#region  MapDispatch
const mapDispatch = dispatch => {
  return {
    handleSubmit(e, newUser){
      e.preventDefault()
      let method = 'login'
      const updObj = {}     
      updObj.email = e.target.email.value
      updObj.password = e.target.password.value
      console.log("updObj:", updObj,"newUser:", newUser)

      //USE the /auth reducer after updating it 
      if(newUser){
        method = 'signup'
        updObj.username = e.target.username.value
          
      }
      dispatch(auth(updObj, method))     
  }
  }
}
//#endregion

export default connect(null, mapDispatch)(SignIn)