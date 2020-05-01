import React, {useState} from 'react'
import {connect} from 'react-redux'
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

export default function AddStory(props){

//#region Form State

    const [storyDetails, setStoryDetails] = useState({
        title:'Untitled',
        description:'',
        public:true
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
        let value = e.target.value;
        if(e.target.name == 'public'){
            e.target.value == 'true' ? value = true : value = false;
        }
        setStoryDetails({...storyDetails, [e.target.name]:value})
    }

    const handleCategoryChange = (e) => {
        setStoryCategories({...storyCategories, [e.target.name]: e.target.checked})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        let storyObj = Object.assign({}, storyDetails)
        storyObj.category = []
        for(let key in storyCategories){
            if(storyCategories[key]){
                storyObj.category.push(key)
            }
        }

        console.log("storyObj:", storyObj, "storyDetails:", storyDetails)
        axios.post('/api/stories', storyObj)
        .then(res => console.log("story created successfully! Story Id:", res.data.id))
        .catch(err => console.log("error:", err))

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
                <FormControl component="fieldset" variant="outlined" margin="normal">
                    <FormLabel component="legend" className={classes.formLabel}>Category</FormLabel>
                    <FormGroup className={classes.inputGroup}>
                        {categories.map(category => (
                            <FormControlLabel
                            key={category}
                            control={<Checkbox checked={storyCategories[category]} onChange={handleCategoryChange} name={category} />}
                            label={category.toUpperCase()}
                            />
                        ))}
                        
                    </FormGroup>
                </FormControl>
                <FormControl component="fieldset" variant="outlined" margin="normal"className={classes.inputGroup}>
                    <FormLabel className={classes.formLabel} component="legend">Story Visibility</FormLabel>
                    <RadioGroup className={classes.inputGroup} aria-label="public" name="public" value={storyDetails.public} onChange={handleDetailsChange}>
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
