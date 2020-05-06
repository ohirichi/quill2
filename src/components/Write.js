import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { makeStyles, Container, Divider, Typography, TextField, MenuItem} from '@material-ui/core';

import {Login, StoryList} from "./index"

//#region Styles
const useStyles = makeStyles(theme => ({

}))
//#endregion

//#region Component
function Write(props){

    //#region Constants
    const classes = useStyles()
    //#endregion

    //#region Component State
    const [userStories, setUserStories] = useState([])
    useEffect(()=>{
        if(props.user.id){
            axios.get(`/api/stories/author/${props.user.id}`)
            .then(res => setUserStories(res.data))
        }       
    },[props.user.id])

    //#endregion

    if(!props.user.id){
        return (
            <Container>
                <Typography>You must be logged into write a story. Sign in or Register Below:</Typography>
                <Login />
            </Container>
        )
    }
    else return(
        <Container className={classes.root} >
            {userStories.length ? <StoryList stories={userStories}/>: "You have not written any stories yet!" }

        </Container>
    )

}

//#endregion

//#region MapState and Connected component export
const mapState = state => ({user:state.user})
export default connect(mapState)(Write)

//#endregion
