import React, {useState} from 'react';
import {connect} from 'react-redux'
import {auth} from '../store'

//#region material ui components import
import {makeStyles, Avatar, Button, TextField, Link, Grid, Typography, Container, FormHelperText} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

//#endregion

//#region  Styles
const useStyles = makeStyles((theme) => ({

  paper: {
    marginTop: theme.spacing(8),
    marginBottom:theme.spacing(4),
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
  const {user} = props


  //toggle between form types - sign in vs register
  const switchForms = (e) => {
    e.preventDefault();
    setNewUser(!newUser)   
  }
  //To Do: Form Validation
  let err = false
  let errorMessage = ""
  if(user.error){
    err = true
    errorMessage = "Invalid email and/or password. Please retry"
  }


  //TO DO: Forgot PW?/Remember PW
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {newUser ? "Register" : "Sign In" }
        </Typography>
        <form onSubmit = {(e)=> props.handleSubmit(e, newUser)} className={classes.form}>
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
            type="email"
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
          {err ? <FormHelperText error={err}>{errorMessage}</FormHelperText> : null}
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

//#region  MapState and MapDispatch

const mapState = state => ({
  user:state.user
})

const mapDispatch = dispatch => {
  return {
    handleSubmit(e, newUser){
      e.preventDefault()
      let method = 'login'
      const updObj = {}     
      updObj.email = e.target.email.value
      updObj.password = e.target.password.value

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

export default connect(mapState, mapDispatch)(SignIn)