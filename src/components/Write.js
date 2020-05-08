import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { makeStyles, Container, Card, Button, Divider, Typography, TextField, MenuItem} from '@material-ui/core';

import {Login, StoryList} from "./index"

//#region Styles
const useStyles = makeStyles(theme => ({
    root:{
        paddingTop:theme.spacing(2),
    },
    heading:{
        marginBottom: theme.spacing(2),
        minHeight:"30vh",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems: "center",
        '& h2':{
            margin: theme.spacing(3)
        },
        '& a':{
            marginTop: theme.spacing(2)
        }

    },

    editStories:{
        margin:theme.spacing(2),
        paddingTop: theme.spacing(1),
        display:"flex",
        flexDirection:"column",
    },
    card:{
        maxWidth:"300px",
        padding:theme.spacing(4),
        alignSelf:"center"
    }

}))
//#endregion

//#region Component
function Write(props){

    //#region Constants
    const classes = useStyles()
    const {user} = props
    //#endregion

    //#region Component State
    const [userStories, setUserStories] = useState([])
    useEffect(()=>{
        if(user.id){
            axios.get(`/api/stories/author/${props.user.id}`)
            .then(res => setUserStories(res.data))
        }       
    },[props.user.id])

    //#endregion

    if(!user.id){
        return (
            <Container className={classes.root}>
                <Typography variant="h4">You must be logged into write a story. Sign in or Register Below:</Typography>
                <Login />
            </Container>
        )
    }
    return(
        <Container className={classes.root} >
            <section className={classes.heading} >
                <Typography className={classes.title} variant="h2">Write Your Story</Typography>
                <Typography variant="body2">Rule one, you have to write. If you don't write, nothing will happen</Typography>
                <Typography variant="caption">-Neil Gaiman</Typography>
                <Button href="/write/new" className={classes.cta} variant="contained" color="primary" >Write New Story</Button>
            </section>
            <Divider variant="middle"/>
            <section className={classes.editStories}>
                <Typography variant="h5" align="left">Continue Writing A Story</Typography>
                {userStories.length ? <StoryList stories={userStories}/>: <Card className={classes.card}>You have not written any stories yet!</Card> }
            </section>
        </Container>
    )

}

//#endregion

//#region MapState and Connected component export
const mapState = state => ({user:state.user})
export default connect(mapState)(Write)

//#endregion
