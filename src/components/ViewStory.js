import React, {useState, useEffect} from 'react'
import axios from 'axios'
import history from '../history'
import {useParams} from 'react-router-dom'
import { makeStyles, Container, Button, Typography, ListItem, List, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme)=>({

}))

export default function Story(props){
    const classes = useStyles()
    const {storyId} = useParams()
    const [story, setStory] = useState({})
    useEffect(()=>{
        axios.get(`/api/stories/${storyId}`)
        .then(res => setStory(res.data))
        .catch(err => {
            console.log("error:", err)
            history.push("/")
        })
    },[storyId])

    if (story.id){
        console.log("story:", story)
        return(
            <Container>
               <Typography>{story.title}</Typography>
               <Typography>{story.description}</Typography>
               <List>
                   <ListItem button component="a" href="/">
                       <ListItemText>Chapter 1</ListItemText>
                   </ListItem>
               </List>

            </Container>
        )
    }
    else{
        return (<div>Loading....</div>)
    }
}