import React, {useState} from 'react'
import axios from 'axios'
import history from '../history'

import {makeStyles, Typography, TextField, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button} from '@material-ui/core'

const useStyles = makeStyles((theme)=>({
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

export default function AddChapter(props){
    //constants
    const classes = useStyles()
    //const {storyId} = props
    const storyId = 2

    //#region Form State
    const [chapterDetails, setChapterDetails] = useState({
        title:'Untitled',
        public:true,
        content:''
    })
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

    const handleSubmit = async function(e){
        e.preventDefault();
        let chapterObj = Object.assign({},chapterDetails)
        chapterObj.storyId = storyId
        console.log("submit clicked! chapterObj:", chapterObj)
        try{
            let res = await axios.post('/api/chapters',chapterObj)
            let chapterId = res.data.id
            console.log("success from server - new chap added:", res.data)
            if(chapterId){
                history.push('/')
            }
            else throw new Error("No ChapterId")
        }
        catch(err){
            console.log("error:", err)
        }

    }

    const handleCancel = (e) =>{
        e.preventDefault()
        history.push('/')
    }
    //#endregion

    return(
        <Container>
            <Typography>
                Add New Chapter
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
                rows='25'
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
                <FormControl className={`${classes.flexRow} ${classes.alignEnd}`} >
                        <Button className={classes.extraMargin} type="submit"  variant="contained" color="primary">Save</Button>
                        <Button className={classes.extraMargin} variant="contained" color="default" onClick={handleCancel}>Cancel</Button>
                </FormControl>
            </form>
        </Container>
    )


}