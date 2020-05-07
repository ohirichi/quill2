import React from "react"
import { makeStyles, Typography } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    footer:{
        minHeight:"10vh",
        backgroundColor: "black",
        color:"white",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
    },
    a:{
        textDecoration:"none",
        color:"white"
    }


}))

export default function Footer(props){
    const classes = useStyles()

    return(
        <footer className={classes.footer}>
            <Typography>Coded by <a className={classes.a} href="https://github.com/ohirichi">ohirichi</a> | 2020 </Typography>
        </footer>
    )
}