import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import history from '../history'
import {useParams} from 'react-router-dom'
import { makeStyles, Fab, ButtonGroup, Avatar, Container, Divider, Button, Chip, Typography, ListItem, List, ListItemText, Card } from '@material-ui/core';

//#region Styles
const useStyles = makeStyles(theme =>({
    root:{

    }
}))
//#endregion

//#region Component
function StoryList(props){

    //#region Constants
    const classes = useStyles()
    //#endregion

    //#region Component State
    const [stories, setStories] = useState([])

    useEffect(()=>{
        axios.get('/api/stories')
        .then(res => console.log(res.data))
        .catch(err => console.log("error:", err))
    },[])
    //#endregion

    //#region Render
    return(
        <Container>
            List of Stories coming soon!
        </Container>
    )

    //#endregion
}
//#endregion

//#region MapState and default export

const mapState = state => ({user:state.user})
export default connect(mapState)(StoryList)

//#endregion

