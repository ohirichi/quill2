import React from "react";


export {default as Login} from "./Login";
export {default as AddStory} from "./AddStory";
export {default as AddChapter} from "./AddChapter"
export {default as Story} from "./ViewStory"
export {default as ReadChapter} from "./ReadChapter"

export function Test (props){
    return(<div>
        <p>Test</p>
        {Object.keys(props).map(prop => console.log("prop:", prop))}

    </div>)
}

