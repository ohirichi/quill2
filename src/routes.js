import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {Login, FourOhFour, Story, Write, Read, AddOrEditStory, AddOrEditChapter, Chapter, Test} from './components'
import {me} from './store'



//#region ProtectedRoute Component

const ProtectedRoute = ({component:Component, auth, ...restOfProps}) =>{
  console.log("auth:" , auth)
    return(
        <Route
          render={ routeProps => (
            auth ? <Component {...routeProps}{...restOfProps}/>:<Login />)}
        />        
    )
}

//#endregion

//#region Routes Component

const Routes = (props)=> {
    const {isLoggedIn, loadInitialData} = props
    useEffect(() => {
      loadInitialData()
      // eslint-disable-next-line 
    },[])
    return(
        <Switch>
            <Route exact path="/">
                {/* To Do: Homepage Component */}
                <Read/>
            </Route>
            <Route exact path="/read">
                {/* To Do: All Stories Component */}
                <Read />
            </Route>
            <Route exact path="/read/:storyId/:chapterNumber">
                <Chapter mode="read"/>
            </Route>
            <Route exact path="/read/:storyId">
                <Story mode="read"/>
            </Route>
            <Route exact path="/login">
                <Login/>
            </Route>
            <Route exact path="/write">
                {/* To Do: Writing Dashboard Component or CTA to Login/Register if no user logged in */}
                <Write />
            </Route>
            <Route exact path="/write/new">
            
                <AddOrEditStory mode="add"/>
            </Route>   
            <Route exact path="/write/:storyId/addChapter">
              
                <AddOrEditChapter mode="add"/>
            </Route>
            <Route exact path="/edit/:storyId/:chapterNum">
            
              <AddOrEditChapter mode="edit"/>
            </Route>
            <Route exact path="/edit/:storyId">
               
              <AddOrEditStory mode="edit"/>
            </Route>
            <Route exact path="/404">
              <FourOhFour />
            </Route>
            <Route>
                <Login/>
            </Route>
        </Switch>
    )
}

//#endregion

//#region MapState and MapDispatch

const mapState = state => {
    return {
      // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
      // Otherwise, state.user will be an empty object, and state.user.id will be falsey
      isLoggedIn: !!state.user.id,
      userId: state.user.id
    }
  }
  
  const mapDispatch = dispatch => {
    return {
      loadInitialData() {
        dispatch(me())
      }
    }
  }

  //#endregion

  // The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))


