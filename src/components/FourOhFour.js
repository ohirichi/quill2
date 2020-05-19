import React from 'react'
import { makeStyles, Container, Divider, Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    extraMargin:{
        margin: "1em"
    }
}))

export default function FourOhFour(props){
    const classes = useStyles()
    return(
        <Container>
            <Typography variant="h2">404</Typography>
            <Divider />
            <Typography className={classes.extraMargin} variant="h6">Sorry that page does not exist. Please try again.</Typography>
        </Container>
    )
}