import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import history from '../history'
import {useParams} from 'react-router-dom'
import { makeStyles, Container, Divider, CardHeader, Avatar, Typography, TextField, MenuItem, Card, CardMedia, CardContent, CardActionArea } from '@material-ui/core';

//#region Styles
const useStyles = makeStyles(theme =>({
    root:{
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },
    title:{
        paddingBottom: theme.spacing(2)
    },
    media:{
        height:0,
        paddingTop:"50%"
    },
    storySection:{
        marginTop:theme.spacing(1),
        display:"flex",
        flexDirection:"row",
        flexWrap:"wrap",
        justifyContent:"space-between",
        alignItems:"center"
    },
    card:{
        margin: theme.spacing(1),
        width: 300

    },
    avatar:{
        backgroundColor: "lightpink"
    },
    input:{
        margin:theme.spacing(1)
    },
    featured:{
        margin:theme.spacing(2),
        marginBottom: theme.spacing(4)
    },
    browse:{
        paddingTop:theme.spacing(2)
        
    },
    divider:{
        margin:theme.spacing(3)
    }
}))
//#endregion

//#region Component
function StoryList(props){

    //#region Constants
    const classes = useStyles()

    //#endregion
    

    //#region Component State
    const [allStories, setAllStories] = useState([])
    const [state, setState] = useState({
        category:"all",
        search:"",
        selectedStories: allStories
    })
    const categories = ["romance",
        "historical",
        "fantasy",
        "sciFi",
        "fiction",
        "adventure",
        "mystery",
        "horror",
        "sport"]

    useEffect(()=>{
        axios.get('/api/stories')
        .then(res => {
            console.log("AllStories from server:", res.data)
            setAllStories(res.data)
        })
        .catch(err => console.log("error:", err))
    },[])
    useEffect(()=>{
        setState({...state,selectedStories:allStories.slice()})
    },[allStories])
    //#endregion
    let featuredStories =[]
    if(allStories.length){
        featuredStories = allStories.slice(0,3)
    }
    //#region Input Handlers
    const handleChange = (e)=>{
        e.preventDefault()
        let stories = allStories.slice()
        let filteredStories = stories
        let searchStr = state.search
        let filter
        e.target.name == "category" ? filter = e.target.value : filter = state.category
        
        if(filter !== "all"){           
            filteredStories = stories.filter(story => story.category.includes(filter)) 
        }
        if(e.target.name =="search"){
            searchStr = e.target.value   
        }
        //Regex matching between search terms and story.title
        if(searchStr.length){
            let re = new RegExp(searchStr,'i')
            filteredStories = filteredStories.filter(story => re.test(story.title))
        }
        setState({...state, selectedStories:filteredStories, [e.target.name]:e.target.value})
    }
    //#endregion

    //#region Render
    console.log("state:", state, "allStories:", allStories)
    return(
        <Container className={classes.root} >
            <Typography className={classes.title} variant="h2">Discover A New Story</Typography>
            <section className={classes.featured} >
                <Typography className={classes.title} variant="h6">Featured Stories</Typography>
                <section className={classes.storySection}>
                {featuredStories.map(story=>(
                        <Card  className={classes.card} key={story.id}  >
                            <CardActionArea href={`/read/${story.id}`} component="a" title={story.title} >
                                <CardHeader 
                                title={story.title.length > 20 ? story.title.substring(0,18) + "..." : story.title} 
                                subheader={story.user.username}
                                />
                                <CardMedia className = {classes.media}
                                image={story.imgUrl || `https://source.unsplash.com/featured/?${story.category[0] || 'lights'}`}
                                title={story.title}
                                />
                                {/* <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                    {story.description}
                                    </Typography>
                                </CardContent> */}
                            </CardActionArea>
                            
                        </Card>
                        
                    ))}
                </section>
            </section>
            <Divider className={classes.divider} variant="middle"/>
            <section className={classes.browse} >
                <Typography className={classes.title} variant="h6">Browse All Stories</Typography>
                <TextField
                className={classes.input}
                name="search"
                size="small"
                margin="dense"
                label="Search"
                variant="outlined"
                placeholder="Title...."
                helperText="Find story by title"
                value={state.search}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={handleChange}
                />
                <TextField
                className={classes.input}
                label="Category"
                size="small"
                margin="dense"
                select
                variant="outlined"
                name="category"
                helperText="Filter stories by category"
                value={state.category}
                onChange={handleChange}
                >
                    <MenuItem value="all">ALL</MenuItem>
                    {categories.sort().map(category => (
                        <MenuItem key={category} value={category}>{category.toUpperCase()}</MenuItem>
                    ) )}
                </TextField>
                <section className={classes.storySection} >
                    {state.selectedStories.map(story=>(
                        <Card  className={classes.card} key={story.id}  >
                            <CardActionArea href={`/read/${story.id}`} component="a" title={story.title} >
                                <CardHeader 
                                title={story.title.length > 20 ? story.title.substring(0,18) + "..." : story.title} 
                                subheader={story.user.username}
                                />
                                <CardMedia className = {classes.media}
                                image={story.imgUrl || `https://source.unsplash.com/featured/?${story.category[0] || 'lights'}`}
                                title={story.title}
                                />
                                {/* <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                    {story.description}
                                    </Typography>
                                </CardContent> */}
                            </CardActionArea>
                            
                        </Card>
                        
                    ))}
                </section>
            </section>
            
            
        </Container>
    )

    //#endregion
}
//#endregion

//#region MapState and default export

const mapState = state => ({user:state.user})
export default connect(mapState)(StoryList)

//#endregion

