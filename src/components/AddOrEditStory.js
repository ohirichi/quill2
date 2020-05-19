import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import history from '../history'
import { makeStyles, Container, Dialog, DialogActions, DialogContent, Button, Typography, TextField, FormLabel, RadioGroup, Radio, FormControlLabel, FormControl, FormHelperText, FormGroup, Checkbox } from '@material-ui/core';
import {Alert} from "@material-ui/lab"

import {Login} from "./index"


//#region Styles
const useStyles = makeStyles((theme) => ({
    root:{
        paddingTop: theme.spacing(4)
    },
    deleteSection:{
        display:"flex",
        flexDirection: "column",
        alignItems:"start",
        justifyContent:"start",
        border:"1px solid gray",
        borderRadius:"5px",
        padding: "1em",
        marginBottom:"1em",
        "& *":{
            marginBottom: ".5em"
        }

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
    const {mode, user} = props
    if( mode !== "edit"){
        storyId = null
    }

//#region Form State

    //Confirmation Dialog state
    const [open, setOpen] = useState(false)


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
    //get existing story details if editing a story
    useEffect(()=>{
        if(storyId){
            axios.get(`/api/stories/${storyId}`)
            .then(res => {
                const story = res.data
                const newState= {}
                if(res.data){
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
                }
                else{
                    history.push('/404')
                }
                
            })
            .catch(err => setError({error: true, errorMessage:err}))
        }       
    },[storyId])
    
//#endregion

    const categories = Object.keys(state.category)
    const classes = useStyles();
    let isAuthor = true
    if(state.story && state.story.id && state.story.userId !== user.id) isAuthor = false
    
//#region Input handlers
    const handleDetailsChange = (e)=>{
        let value = e.target.value;
        if(e.target.name === 'public'){
            e.target.value === 'true' ? value = true : value = false;
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
    const handleDelete = (e) =>{
        e.preventDefault()
        axios.delete(`/api/stories/${storyId}`)
        .then(res => history.push(`/write`))
        .catch(err => console.log("error:", err))

    }

    const handleOpen = function(e){
        setOpen(true)
    }
    const handleClose = function(e){
        setOpen(false)
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        let validSubmission = validateForm()
        if(!validSubmission){
            setError({error:true, errorMessage:"Please correct the errors on the form before resubmitting", show:true})
        }
        else{
            let storyObj = Object.assign({}, state)
            storyObj.category = []
            for(let key in state.category){
                if(state.category[key]){
                    storyObj.category.push(key)
                }
            }
            if(user.id){
                storyObj.userId = props.user.id
                if(mode === "edit"){
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
//checking that user is logged in and is the author of the story to edit it
    if(!user.id || !isAuthor){
        let message = "You must be logged in write or edit stories!"
        if (!isAuthor) message = "You do not have permission to edit this story"
        return(
            <Container maxWidth="sm" className ={classes.root}>
                <Typography component="h1" variant="h5">
                {message}
                </Typography>
                <Login/>
            </Container>
            
        )
    }
    return(
        <Container maxWidth="sm" className ={classes.root} >
            
            <Typography component="h1" variant="h5">
                {mode === "edit" ? "Edit Story Details": "Write a New Story"}
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
                {mode === "edit" ? <div >
                    <FormControl className={classes.deleteSection}>
                        <FormLabel>Delete Story</FormLabel>
                        <FormHelperText>Do you wish to delete the chapter? This cannot be undone later and will delete all the chapters associated with this story as well.</FormHelperText>
                        <Button onClick={handleOpen}  variant="contained" color="default">Delete Story</Button>
                    </FormControl> 
                    <Dialog
                    open={open}
                    onClose={handleClose}
                    >
                        <DialogContent>Please confirm if you want to delete this story and all of its chapters.</DialogContent>
                        <DialogActions>
                        <Button autoFocus onClick={handleDelete} color="secondary">Delete</Button>
                            <Button onClick={handleClose} color="default">Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>: null}
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