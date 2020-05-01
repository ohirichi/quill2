import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import history from '../history'
import {useParams} from 'react-router-dom'
import { makeStyles, Container, Button, Typography, ListItem, List, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme)=>({

}))

function Story(props){
    const classes = useStyles()
    const {storyId} = useParams()
    const [story, setStory] = useState({})
    const isAuthor = story.userId === props.user.id
    useEffect(()=>{
        axios.get(`/api/stories/${storyId}`)
        .then(res => setStory(res.data))
        .catch(err => {
            console.log("error:", err)
            history.push("/")
        })
    },[storyId])

    console.log("user:", props.user, "story:", story)

    if (story.id){
        console.log("story:", story)
        return(
            <Container>
               <Typography>{story.title}</Typography>
               <Typography>{story.description}</Typography>
               {isAuthor? <div>Edit Story Details</div>: null}
               <List>
                   <ListItem button component="a" href="/">
                       <ListItemText>Chapter 1</ListItemText>
                       {isAuthor ? <div>Edit Chapter</div>:null}
                   </ListItem>
               </List>

            </Container>
        )
    }
    else{
        return (<div>Loading....</div>)
    }
}

const mapState = state => ({user:state.user})

export default connect(mapState)(Story)