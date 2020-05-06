import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import history from '../history'
import {useParams} from 'react-router-dom'
import { makeStyles, Container, Typography, TextField, MenuItem, Card } from '@material-ui/core';

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
        <Container>
            <TextField
            name="search"
            label="Search"
            helperText="Search by Title for a Story"
            value={state.search}
            onChange={handleChange}
            />
            <TextField
            label="Category"
            select
            name="category"
            helperText="Choose category to filter by"
            value={state.category}
            onChange={handleChange}
            >
                <MenuItem value="all">ALL</MenuItem>
                {categories.sort().map(category => (
                    <MenuItem key={category} value={category}>{category.toUpperCase()}</MenuItem>
                ) )}
            </TextField>
            <section>
                {state.selectedStories.map(story=>(
                    <Card key={story.id} >{story.title} </Card>
                ))}
            </section>
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

