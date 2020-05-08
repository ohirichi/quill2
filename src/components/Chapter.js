import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import history from '../history'
import {useParams} from 'react-router-dom'
import { makeStyles, Container, Divider, Button, Breadcrumbs, Link, Typography} from '@material-ui/core';

//baseUrl/:storyId/:chapterNumber
//this component should get all chapters for a given story and sort them by chapterNumber ascending and keep it in an array on state
//the currentChapter it should display is :chapterNumber

const useStyles = makeStyles((theme)=>({
    root:{
        paddingTop:theme.spacing(4),
        paddingBottom: theme.spacing(2)
    },
    extraMargin:{
        margin:theme.spacing(2)
    },
    text:{
        margin:theme.spacing(2),
        whiteSpace:'pre-wrap'
    }



}))

function Chapter(props){
    const classes = useStyles();
    const {storyId, chapterNumber} = useParams()

    const [currentChapter, setCurrentChapter] = useState(Number(chapterNumber))
    const [chapters, setChapters] = useState([])
    //TO DO: Better way to handle private chapters in chapter list
    //let publicChapters = chapters.filter(chapter => chapter.public)
    let isPrivate
    let isAuthor = false
    if(chapters.length){
        isAuthor = Boolean(chapters[0].story.userId && chapters[0].story.userId == props.user.id )
        isPrivate = !chapters[currentChapter].public
    }

    useEffect(()=>{
        axios.get(`/api/stories/${storyId}/chapters`)
        .then(res => {
            console.log("res.data:",res.data)
            setChapters(res.data)
        })
        .catch(err => console.log("error:", err))
    },[storyId])

    if(chapters.length){
        return(
            <Container className={classes.root} >
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href={`/read/${storyId}`}>
                        {chapters[0].story.title}
                    </Link>
                    <Typography color="textPrimary">Chapter {currentChapter + 1} </Typography>
                </Breadcrumbs>
                <Typography className={classes.extraMargin} variant="h4">{chapters[currentChapter].title}</Typography>
                {isAuthor ? <Button className={classes.extraMargin} variant="outlined" color="secondary" href={`/edit/${storyId}/${chapterNumber}`}>Edit Chapter</Button>:null}
                <Divider variant="middle" />
                {isPrivate && !isAuthor ? <Typography className={classes.text}>The content of this chapter is private</Typography> :<Typography variant="body1" align="left" paragraph className={classes.text}>{chapters[currentChapter].content} </Typography>}
                
                <Button variant="outlined" disabled={Boolean(currentChapter == 0)} href={`/read/${storyId}/${Number(currentChapter) - 1}`} >Prev</Button>
                <Button variant="outlined" disabled={Boolean(currentChapter == chapters.length - 1)} href={`/read/${storyId}/${Number(currentChapter) + 1}`} >Next</Button>
            </Container>
        )
    }
    else{
        return(
            <div>Loading....</div>
        )
    }
}

const mapState = (state) => ({user:state.user})

export default connect(mapState)(Chapter)