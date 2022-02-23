import { Float, Drag, Move, Resize } from "./Float.js";

export class TestFloat{
    constructor(){
     
    }
}


const t = new TestFloat();

Float.init(document.getElementById("q"));
Float.init(document.getElementById("q2"));

document.addEventListener("mousedown", (e)=>{
    
    
    console.log("document mouse down")})

//Float.center(document.getElementById("q"));

Move.init({main:document.getElementById("q"), hand:document.getElementById("q")});

Move.init({main:document.getElementById("q2"), hand:document.getElementById("q2")});

Float.show({e: document.getElementById("q2"), left:200,top:200})
//Float.init(document.getElementById("q2"));

//Float.center(document.getElementById("q2"));
Resize.init({main:document.getElementById("q2")});