import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import history from '../history'
import { makeStyles, Container, Button, Typography, TextField, FormLabel, FormHelperText, RadioGroup, Radio, FormControlLabel, FormControl, FormGroup, Checkbox } from '@material-ui/core';
import {Alert} from "@material-ui/lab"

import {Login} from "./index"


//#region Styles
const useStyles = makeStyles((theme) => ({
    root:{
        paddingTop: theme.spacing(4)
    },

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
    const {mode, user} = props
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
        category:defaultCategories,
        imgUrl:''
    })

    const [err, setError] = useState({
        error:false,
        errorMessage:"",
        show:true
    })

    useEffect(()=>{
        if(storyId){
            axios.get(`/api/stories/${storyId}`)
            .then(res => {
                const story = res.data
                const newState= {}
                for(let key in story){
                    newState[key] = story[key]
                }

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
            .catch(err => setError({error: true, errorMessage:err}))
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

    function validateForm (){
        if(state.title.length > 255 || !state.title.length){
            return false
        }
        if(state.description.length > 500 || !state.description.length){
            return false
        }
        return true
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log("handleSubmit")
        let validSubmission = validateForm()
        if(!validSubmission){
            console.log("validate form failed")
            setError({error:true, errorMessage:"Please correct the errors on the form before resubmitting", show:true})
        }
        else{
            console.log("validate form passed")
            let storyObj = Object.assign({}, state)
            storyObj.category = []
            for(let key in state.category){
                if(state.category[key]){
                    storyObj.category.push(key)
                }
            }
            if(user.id){
                storyObj.userId = props.user.id
                console.log("storyObj:", storyObj, "state:",state)
                if(mode == "edit"){
                    axios.put(`/api/stories/${storyId}`, storyObj)
                    .then(res => history.push(`/read/${res.data.id}`))
                    .catch(err => setError({error:err, errorMessage:"Something went wrong please try again", show:true}))
                }
                else{
                    axios.post('/api/stories', storyObj)
                    .then(res => history.push(`/read/${res.data.id}`))
                    .catch(err => setError({error:err, errorMessage:"Something went wrong please try again", show:true}))
                }
                
            }
            else{
                setError({error:true, errorMessage:"You must be logged in to write a story", show:true})
            }
        }
        

    }

    const handleCancel = (e) =>{
        e.preventDefault()
        let urlStr
        storyId ? urlStr = `/read/${storyId}` : urlStr = "/write"
        history.push(urlStr)
    }

//#endregion
    if(!user.id){
        return(
            <Container maxWidth="sm" className ={classes.root}>
                <Typography component="h1" variant="h5">
                You must be logged in write or edit stories!
                </Typography>
                <Login/>
            </Container>
            
        )
    }
    return(
        <Container maxWidth="sm" className ={classes.root} >
            
            <Typography component="h1" variant="h5">
                {mode == "edit" ? "Edit Story Details": "Write a New Story"}
            </Typography>
            <form onSubmit={handleSubmit} >
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                error={state.title.length > 255}
                helperText={`${state.title.length}/255 characters`}
                id="title"
                label="Title"
                name="title"
                autoFocus
                value={state.title}
                onChange={handleDetailsChange}
                />
                <TextField
                multiline
                rowsMax="3"
                helperText={`${state.description.length}/500 characters`}
                error={state.description.length > 500}
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
                <TextField
                name="imgUrl"
                value={state.imgUrl}
                label="Cover Image URL"
                variant="outlined"
                margin="dense"
                fullWidth
                onChange={handleDetailsChange}
                 />
                <FormControl component="fieldset" variant="outlined" margin="normal"className={classes.inputGroup}>
                    <FormLabel className={classes.formLabel} component="legend">Story Visibility</FormLabel>
                    <RadioGroup className={classes.inputGroup} aria-label="public" name="public" value={state.public} onChange={handleDetailsChange}>
                        <FormControlLabel value={true} control={<Radio />} label="Public" />
                        <FormControlLabel value={false} control={<Radio />} label="Private" />
                    </RadioGroup>
                </FormControl>
                {Boolean(err.error) && err.show ? <Alert severity="error" onClose={()=> setError({...err, show:false})} variant="filled">{err.errorMessage}</Alert> : null}
                <FormControl className={classes.buttonGroup} >
                    <Button type="submit" className={classes.extraMargin} variant="contained" color="primary">Save</Button>
                    <Button className={classes.extraMargin} variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
                </FormControl>             
                
            </form>
        </Container>
    )

}

const mapState = state => ({user:state.user})

export default connect(mapState)(AddOrEditStory)