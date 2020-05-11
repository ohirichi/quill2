import React from 'react'
import {Link} from "react-router-dom"
import { makeStyles, Container,  CardHeader, Card, CardMedia, CardActionArea } from '@material-ui/core';

//#region  Styles
const useStyles = makeStyles(theme =>({
    storySection:{
        marginTop:theme.spacing(1),
        display:"flex",
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"center",
        alignItems:"center",
        padding:0
    },
    title:{
        paddingBottom: theme.spacing(2)
    },
    media:{
        height:0,
        paddingTop:"50%"
    },
    card:{
        margin: theme.spacing(1),
        width: 250

    }
}))

//#endregion

export default function StoryList(props){
 const {stories} = props
 const classes = useStyles()

 return(
    <Container maxWidth={false} className={classes.storySection}>
    {stories.map(story=>(
            <Card  className={classes.card} key={story.id}  >
                <CardActionArea 
                to={`/read/${story.id}`} component={Link} 
                title={story.title}
                >
                    <CardHeader 
                    title={story.title.length > 20 ? story.title.substring(0,15) + "..." : story.title} 
                    subheader={story.user.username}
                    />
                    <CardMedia 
                    className = {classes.media}
                    image={story.imgUrl || `https://source.unsplash.com/featured/?${story.category[0] || 'lights'}`}
                    title={story.title}
                    />
                </CardActionArea>
            </Card>
        ))}
    </Container>
 )
}