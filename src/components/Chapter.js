import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import history from '../history'
import {useParams} from 'react-router-dom'
import { makeStyles, Container, Button, Typography} from '@material-ui/core';

//baseUrl/:storyId/:chapterNumber
//this component should get all chapters for a given story and sort them by chapterNumber ascending and keep it in an array on state
//the currentChapter it should display is :chapterNumber

const useStyles = makeStyles((theme)=>({

}))

function Chapter(props){
    const classes = useStyles();
    const {storyId, chapterNumber} = useParams()

    const [currentChapter, setCurrentChapter] = useState(chapterNumber)
    const [chapters, setChapters] = useState([])

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
            <Container>
                <div>chapters.length: {chapters.length} , currentChapNum: {currentChapter} </div>
                <Typography>{chapters[currentChapter].title}</Typography>
                <Typography>{chapters[currentChapter].content} </Typography>
                <Button>Prev</Button>
                <Button>Next</Button>
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