import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import history from '../history'
import { makeStyles, Container, Button, Typography, TextField, FormLabel, RadioGroup, Radio, FormControlLabel, FormControl, FormGroup, Checkbox } from '@material-ui/core';


//#region Styles
const useStyles = makeStyles((theme) => ({
    inputGroup: {
      display: 'flex',
      flexDirection:'row',
      flexWrap: 'wrap',
      alignSelf:'flex-start'
    },
    buttonGroup:{
      display: 'flex',
      flexDirection:'row',
      justifyContent:"flex-end"
    },

    extraMargin:{
        margin: "0.5rem"
    },

    formLabel:{
        textAlign:'left'
    },
    formControl: {
      margin: theme.spacing(3),
    },
  }));    
//#endregion

function AddOrEditStory(props){
    let {storyId} = useParams() 
    console.log("STORYID:", storyId)
    const {mode} = props
    if( mode !== "edit"){
        storyId = null
    }

//#region Form State
    const defaultCategories = {
        romance:false,
        historical:false,
        fantasy:false,
        sciFi:false,
        fiction:false,
        adventure:false,
        mystery:false,
        horror:false,
        sport:false
    }
    const [state, setState] = useState({
        story:{},
        title:'Untitled', 
        description:'', 
        public:true, 
        category:defaultCategories
    })


    useEffect(()=>{
        if(storyId){
            console.log("storyId b4 axios call:", storyId)
            axios.get(`/api/stories/${storyId}`)
            .then(res => {
                const story = res.data
                const newState= {}
                newState.story = story
                newState.title = story.title
                newState.description = story.description
                newState.public = story.public

                const newCats = {
                    romance:false,
                    historical:false,
                    fantasy:false,
                    sciFi:false,
                    fiction:false,
                    adventure:false,
                    mystery:false,
                    horror:false,
                    sport:false
                }
                story.category.forEach(cat => {
                    newCats[cat] = true
                })
                newState.category = newCats
                setState(newState)
            })
            .catch(err => console.log("error:", err))
        }       
    },[storyId])
    
//#endregion

    const categories = Object.keys(state.category)
    const classes = useStyles();
    
//#region Input handlers
    const handleDetailsChange = (e)=>{
        let value = e.target.value;
        if(e.target.name == 'public'){
            e.target.value == 'true' ? value = true : value = false;
        }
        setState({...state, [e.target.name]:value})
    }

    const handleCategoryChange = (e) => {
        let updatedCategories = ({...state.category, [e.target.name]: e.target.checked})
        setState({...state, category:updatedCategories})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        let storyObj = Object.assign({}, state)
        storyObj.category = []
        for(let key in state.category){
            if(state.category[key]){
                storyObj.category.push(key)
            }
        }
        if(props.user.id){
            storyObj.userId = props.user.id
            console.log("storyObj:", storyObj, "state:",state)
            axios.post('/api/stories', storyObj)
            .then(res => history.push(`/read/${res.data.id}`))
            .catch(err => console.log("error:", err))
        }
        else{
            console.log("Error: you must be logged into write a story")
        }

    }

    const handleCancel = (e) =>{
        e.preventDefault()
        history.push('/')
    }

//TO-DO: Validate Form

    const validateForm = ()=> {
        //to-do
        //return valid or return error
    }
//#endregion

    return(
        <Container maxWidth="sm">
            <Typography component="h1" variant="h5">
                Write a New Story
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoFocus
                value={state.title}
                onChange={handleDetailsChange}
                />
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                autoFocus
                value={state.description}
                onChange={handleDetailsChange}
                />
                <FormControl component="fieldset" variant="outlined" margin="normal">
                    <FormLabel component="legend" className={classes.formLabel}>Category</FormLabel>
                    <FormGroup className={classes.inputGroup}>
                        {categories.map(currentCategory => (
                            <FormControlLabel
                            key={currentCategory}
                            control={<Checkbox checked={state.category[currentCategory]} onChange={handleCategoryChange} name={currentCategory} />}
                            label={currentCategory.toUpperCase()}
                            />
                        ))}
                        
                    </FormGroup>
                </FormControl>
                <FormControl component="fieldset" variant="outlined" margin="normal"className={classes.inputGroup}>
                    <FormLabel className={classes.formLabel} component="legend">Story Visibility</FormLabel>
                    <RadioGroup className={classes.inputGroup} aria-label="public" name="public" value={state.public} onChange={handleDetailsChange}>
                        <FormControlLabel value={true} control={<Radio />} label="Public" />
                        <FormControlLabel value={false} control={<Radio />} label="Private" />
                    </RadioGroup>
                </FormControl>
                <FormControl className={classes.buttonGroup} >
                    <Button type="submit" className={classes.extraMargin} variant="contained" color="primary">Create</Button>
                    <Button className={classes.extraMargin} variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
                </FormControl>             
                
            </form>
        </Container>
    )

}

const mapState = state => ({user:state.user})

export default connect(mapState)(AddOrEditStory)