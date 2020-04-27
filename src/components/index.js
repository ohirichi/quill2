import React from "react";


export {default as Login} from "./Login";

export function Test (props){
    return(<div>
        <p>Test</p>
        {Object.keys(props).map(prop => console.log("prop:", prop))}

    </div>)
}

