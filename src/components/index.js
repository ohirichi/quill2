import React from "react";

export {default as Navbar} from './Navbar'
export {default as Login} from "./Login";
export {default as AddOrEditStory} from "./AddOrEditStory";
export {default as AddOrEditChapter} from "./AddOrEditChapter"
export {default as Story} from "./Story"
export {default as Chapter} from "./Chapter"
export {default as StoryList} from "./StoryList"

export function Test (props){
    return(<div>
        <p>Test</p>
        {Object.keys(props).map(prop => console.log("prop:", prop))}

    </div>)
}

