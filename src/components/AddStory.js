import React, {useState} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

//#region  Material UI Component imports
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
//#endregion


//#region Styles
const useStyles = makeStyles((theme) => ({
    categories: {
      display: 'flex',
      flexDirection:'row',
      flexWrap: 'wrap'
    },

    formLabel:{
        textAlign:'left'
    },
    formControl: {
      margin: theme.spacing(3),
    },
  }));    
//#endregion

//#region Notes
//Component for adding a story
//It should let the user give a title - untitled by default
//It should let the user pick zero or more genres/categories for the story
//It should let the user add a description to the story
//It should let the user create the story with the details as long as mandatory fields have been provided
//It should let the user cancel creating the story

//Bonus: It should warn the user when navigating away from the page that they will lose data if it hasnt been submitted

//Does this component need to be connected to the global redux state?
//Component will basically be a form
//it does need to know who the current user is - pass in current userId as a prop
//#endregion

const AddStory = (props) => {

    //#region Form State
    const [storyDetails, setStoryDetails] = useState({
        title:'Untitled',
        description:''
    })

    const [storyCategories, setStoryCategories] = useState({
        romance:false,
        historical:false,
        fantasy:false,
        sciFi:false,
        fiction:false,
        adventure:false,
        mystery:false,
        horror:false,
        sport:false
    })
    //#endregion

    const categories = Object.keys(storyCategories)
    const classes = useStyles();
    //#region Input handlers
    const handleDetailsChange = (e)=>{
        setStoryDetails({...storyDetails, [e.target.name]:e.target.value})
    }

    const handleCategoryChange = (e) => {
        setStoryCategories({...storyCategories, [e.target.name]: e.target.checked})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()

    }

    //TO-DO: Validate Form

    const validateForm = ()=> {
        //to-do
        //return valid or return error
    }
    //#endregion

    

    return(
        <Container>
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
                value={storyDetails.title}
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
                value={storyDetails.description}
                onChange={handleDetailsChange}
                />               
                <FormLabel component="legend" className={classes.formLabel}>Category</FormLabel>
                <FormGroup className={classes.categories}>
                    {categories.map(category => (
                        <FormControlLabel
                        key={category}
                        control={<Checkbox checked={storyCategories[category]} onChange={handleCategoryChange} name={category} />}
                        label={category.toUpperCase()}
                        />
                    ))}
                    
                </FormGroup>
            </form>
        </Container>
    )

}

export default AddStory