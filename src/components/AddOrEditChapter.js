import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {connect} from "react-redux"
import {useParams} from 'react-router-dom'
import history from '../history'
import {Login} from './index'

import {makeStyles, Typography, TextField, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button} from '@material-ui/core'
import {Alert} from "@material-ui/lab"

const useStyles = makeStyles((theme)=>({
    root:{
        paddingTop: theme.spacing(4)
    }
    ,
    flexRow:{
        display:"flex",
        flexDirection:"row",
        alignSelf:'flex-start'

    },
    alignEnd:{
        justifyContent:"flex-end"
    },

    alignLeft:{
        textAlign:"left"
    },

    extraMargin:{
        margin: "0.5rem"
    }
}))

function AddOrEditChapter(props){
    //constants
    const classes = useStyles()
    let {storyId, chapterNum} = useParams()
    const {mode} = props
    if (mode !== "edit"){
        chapterNum = null
    }
    

    //#region Form State
    //error state
    const [err, setError] = useState({
        error:null,
        errorMessage:"",
        show:true
    })
    
    //chapter Details
    const [chapterDetails, setChapterDetails] = useState({
        id:null,
        title:'Untitled',
        public:true,
        content:''
    })
    //get Chapter Details if editing an existing chapter
    useEffect(()=>{
        if(chapterNum){
            axios.get(`/api/stories/${storyId}/chapters/${chapterNum}`)
            .then(res => {
                const chapDetailsObj = {
                    id: res.data.id,
                    title:res.data.title,
                    public: res.data.public,
                    content: res.data.content
                }
                setChapterDetails(chapDetailsObj)
            })
            .catch(err => setError({
                error:err,
                errorMessage:"Failed to retrieve chapter details, Please try again.",
                show:true
            }))
        }
    },[chapterNum, storyId])


    //#endregion

    //#region  Input and Submit Handlers
    const handleChange = function(e){
        e.preventDefault()
        let value = e.target.value
        if(e.target.name == 'public'){
            e.target.value == 'true' ? value = true : value = false
        }
        setChapterDetails({...chapterDetails, [e.target.name]:value})
    }

    function validateForm(){
        if(chapterDetails.title.length > 255 || !chapterDetails.title.length){
            return false
        }
        if(!chapterDetails.content.length){
            return false
        }
        return true
    }

    const handleSubmit = async function(e){
        e.preventDefault();
        let valid = validateForm()
        if(!valid){
            setError({
                error:{error:true},
                errorMessage:"Please correct the errors on the form and then resubmit",
                show:true
            })
        }
        else{
            let chapterObj = Object.assign({},chapterDetails)
            chapterObj.storyId = storyId
            console.log("submit clicked! chapterObj:", chapterObj)
            if(mode !== "edit"){
                try{
                    let res = await axios.post('/api/chapters',chapterObj)
                    let chapterId = res.data.id
                    console.log("success from server - new chap added:", res.data)
                    if(chapterId){
                        history.push(`/read/${storyId}`)
                    }
                    else throw new Error("No ChapterId")
                }
                catch(err){
                    setError({
                        error:err,
                        errorMessage:"Failed to create new chapter. Please try again",
                        show:true
                    })
                }
            }
            else{
                try{
                    let res = await axios.put(`/api/chapters/${chapterDetails.id}`,chapterObj)
                    let chapterId = res.data.id
                    console.log("success from server - chapter updated:", res.data)
                    if(chapterId){
                        history.push(`/read/${storyId}`)
                    }
                    else throw new Error("No ChapterId")
                }
                catch(err){
                    setError({
                        error:err,
                        errorMessage:"Failed to update chapter. Please try again",
                        show:true
                    })
                } 
            }
        }
        
        

    }

    const handleCancel = (e) =>{
        e.preventDefault()
        let urlStr = `/read/${storyId}`
        if(chapterNum){
            urlStr += `/${chapterNum}`
        }
        history.push(urlStr)
    }
    //#endregion
    if(! props.user.id){
        return(
            <Container maxWidth="sm" className ={classes.root}>
                <Typography component="h1" variant="h5">
                You must be logged in write or edit stories!
                </Typography>
                <Login/>
            </Container>
            
        )
    }
    else return(
        <Container className={classes.root} >
            <Typography variant="h6">
                {mode == "edit" ? "Edit Chapter" :"Add New Chapter"}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Chapter Title"
                name="title"
                autoFocus
                error={chapterDetails.title.length > 255}
                helperText={`${chapterDetails.title.length}/255 characters`}
                value={chapterDetails.title}
                onChange={handleChange}
                />
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="content"
                label="Content"
                name="content"
                autoFocus
                multiline
                rows='15'
                value={chapterDetails.content}
                onChange={handleChange}
                />
                <FormControl 
                component="fieldset"
                variant="outlined"
                margin="normal"
                className={classes.flexRow}
                >
                    <FormLabel className={classes.alignLeft} component="legend">Chapter Visibility</FormLabel>
                    <RadioGroup className={classes.flexRow} aria-label="public" name="public" value={chapterDetails.public} onChange={handleChange}>
                        <FormControlLabel value={true} control={<Radio />} label="Public" />
                        <FormControlLabel value={false} control={<Radio />} label="Private" />
                    </RadioGroup>
                </FormControl>
                {Boolean(err.error) && err.show ? <Alert severity="error" variant="filled" onClose={()=> setError({...err, show:false})}>{err.errorMessage}</Alert> : null}
                <FormControl className={`${classes.flexRow} ${classes.alignEnd}`} >
                        <Button className={classes.extraMargin} type="submit"  variant="contained" color="primary">Save</Button>
                        <Button className={classes.extraMargin} variant="contained" color="default" onClick={handleCancel}>Cancel</Button>
                </FormControl>
            </form>
        </Container>
    )


}

const mapState = (state)=> ({
    user:state.user
})

export default connect(mapState)(AddOrEditChapter)