import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { makeStyles, Container, Divider, Typography, TextField, MenuItem} from '@material-ui/core';

import {StoryList} from "./index"

//#region Styles
const useStyles = makeStyles(theme =>({
    root:{
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    input:{
        margin:theme.spacing(1)
    },
    featured:{
        padding:0,
        margin:0,
        marginTop:theme.spacing(2),
        marginBottom: theme.spacing(4),
    },
    browse:{
        padding:0,
        margin:0,
        paddingTop:theme.spacing(2)
        
    },
    divider:{
        margin:theme.spacing(3)
    }
}))
//#endregion

//#region Component
function Read(props){

    //#region Constants
    const classes = useStyles()
    const categories = ["romance",
        "historical",
        "fantasy",
        "sciFi",
        "fiction",
        "adventure",
        "mystery",
        "horror",
        "sport"]

    //#endregion
    

    //#region Component State
    const [allStories, setAllStories] = useState([])
    const [state, setState] = useState({
        category:"all",
        search:"",
        selectedStories: allStories
    })
    

    useEffect(()=>{
        axios.get('/api/stories')
        .then(res => {
            setAllStories(res.data)
        })
        .catch(err => console.log("error:", err))
    },[])
    useEffect(()=>{
        setState( s => ({...s,selectedStories:allStories.slice()}))
    },[allStories])
    
    //#endregion
    
    //To Do: Actually implement featured stories - update story models etc. (lower priority)
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
        e.target.name === "category" ? filter = e.target.value : filter = state.category
        
        if(filter !== "all"){           
            filteredStories = stories.filter(story => story.category.includes(filter)) 
        }
        if(e.target.name ==="search"){
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
    return(
        <Container className={classes.root} >
            <Typography className={classes.title} variant="h2">Discover A New Story</Typography>
            <Divider className={classes.divider} variant="middle"/>
            <section className={classes.featured} >
                <Typography className={classes.title} variant="h6">Featured Stories</Typography>
                <StoryList stories={featuredStories} />
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
                        <MenuItem 
                        key={category} 
                        value={category}
                        >
                            {category.toUpperCase()}
                        </MenuItem>
                    ) )}
                </TextField>
                <StoryList stories={state.selectedStories} />
            </section>
        </Container>
    )

    //#endregion
}
//#endregion

//#region MapState and default export

const mapState = state => ({user:state.user})
export default connect(mapState)(Read)

//#endregion

