import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import history from '../history'
import {useParams} from 'react-router-dom'
import { makeStyles, Fab, ButtonGroup, Avatar, Container, Divider, Button, Chip, Typography, ListItem, List, ListItemText, Card } from '@material-ui/core';
import {Add} from '@material-ui/icons'

const useStyles = makeStyles((theme)=>({
    root:{
        padding:0,
        backgroundColor:'rgba(248, 235, 235, 0.95)'
    },
    storyDetails:{
        backgroundColor:'rgba(248, 235, 235, 0.95)',
        width:'100%',
        minHeight:'40vh',
        margin:0,
        paddingTop:theme.spacing(4),
        paddingBottom: theme.spacing(4),
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        '& *':{
            margin:theme.spacing(1)
        }

    },
    avatar:{
        backgroundColor:'rgb(250, 172, 172)',
        margin:'auto 1em'
    },

    list:{
        minHeight:'50vh'
    },
    cardHolder:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        minHeight:'50vh'
    },
    card:{
        
        padding:theme.spacing(4)
    },

    buttonGroup:{
        '& *': {
            margin:0
        }
    }

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
            <Container maxWidth="false" className={classes.root}>
                <section className={classes.storyDetails} >
                    <Typography variant="h4">{story.title}</Typography>
                    <Typography variant= "subtitle2">{story.user? "Written by: " + story.user.username : "Author Unknown"}</Typography>
                    <Typography variant="body2">{story.description}</Typography>
                    {isAuthor? <ButtonGroup className={classes.buttonGroup} variant="contained" size="medium" color="secondary">
                        <Button  href={`/edit/${storyId}`} >Edit Details</Button>
                        <Button  href={`/write/${storyId}/addChapter`} >Add Chapter</Button>
                    </ButtonGroup> : null}
                </section>
               <Divider variant="middle" />
               {story.chapters.length ? 
               <List className={classes.list} >
               {story.chapters.map((chapter, index) => 
                   (<ListItem button component="a" href={`/read/${story.id}/${index}`}>
                       <Avatar className={classes.avatar} >{chapter.title.charAt(0)}</Avatar>
                      <ListItemText key={chapter.title} >Chapter{index + 1 }: {chapter.title}</ListItemText>
                      {isAuthor ? <Button variant="outlined" size="small" color="secondary" href={`/edit/${storyId}/${index}`} >Edit Chapter</Button>:null}
                   </ListItem>))}  
              </List>
               : 
               <div className={classes.cardHolder}><Card className={classes.card} >Currently there are no chapters published for this story</Card></div>}
               {/* {isAuthor ?  
                <Fab className={classes.fab} color="secondary" aria-label="add" href={`/write/${storyId}/addChapter`} >
                    <Add/>
                </Fab> : null} */}
            </Container>
        )
    }
    else{
        return (<div>Loading....</div>)
    }
}

const mapState = state => ({user:state.user})

export default connect(mapState)(Story)