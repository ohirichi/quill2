import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Login, Story, AddStory, AddChapter, Chapter, Test} from './components'
import {me} from './store'


//#region ProtectedRoute Component

const ProtectedRoute = ({component:Component, isLoggedIn, ...restOfProps}) =>{
    return(
        <Route
          render={ routeProps => (
            isLoggedIn ? <Component {...routeProps}{...restOfProps}/>:<Redirect to="/login"/>)}
        />        
    )
}

//#endregion

//#region Routes Component

const Routes = (props)=> {
    const {isLoggedIn} = props
    useEffect(() => props.loadInitialData())
  
    return(
        <Switch>
            <Route exact path="/">
                {/* To Do: Homepage Component */}
                <Login/>
            </Route>
            <Route exact path="/read">
                {/* To Do: All Stories Component */}
                <div>Reading?</div>
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
            </Route>
            <Route exact path="/write/new">
              {/* To Do: Convert to protected route */}
                <AddStory/>
            </Route>   
            <Route exact path="/write/:storyId/addChapter">
              {/* To Do: Convert to protected route */}
                <AddChapter/>
            </Route>
            <Route exact path="/edit/:storyId/:chapterId">
              {/* To Do: Convert to protected route and add component */} 
            </Route>
            <Route exact path="/edit/:storyId">
              {/* To Do: Convert to protected route and add component */} 
            </Route>
            <ProtectedRoute path="/test" isLoggedIn={isLoggedIn} component={Test} />
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


