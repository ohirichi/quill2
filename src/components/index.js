import React from "react";


export {default as Login} from "./Login";
export {default as AddStory} from "./AddStory";

export function Test (props){
    return(<div>
        <p>Test</p>
        {Object.keys(props).map(prop => console.log("prop:", prop))}

    </div>)
}

