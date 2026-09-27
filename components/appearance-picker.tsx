"use client";
import { useState } from "react";
import { Laptop, Moon, Sun } from "lucide-react";

const modes=[{id:"light",label:"Light",icon:Sun},{id:"system",label:"System",icon:Laptop},{id:"dark",label:"Dark",icon:Moon}];
const accents=[{id:"rose",label:"Rose",colors:["#dc4f91","#fff3f8","#4a2038"]},{id:"violet",label:"Violet",colors:["#8b5cf6","#f6f1ff","#39285c"]},{id:"ocean",label:"Ocean",colors:["#168aad","#effaff","#163e52"]},{id:"forest",label:"Forest",colors:["#2e8b67","#f0faf5","#183f34"]}];

export function AppearancePicker({initialMode="system",initialAccent="rose"}:{initialMode?:string;initialAccent?:string}){
 const[mode,setMode]=useState(initialMode);const[accent,setAccent]=useState(initialAccent);
 function preview(nextMode:string,nextAccent:string){const root=document.documentElement;const dark=nextMode==="system"?matchMedia("(prefers-color-scheme: dark)").matches:nextMode==="dark";root.dataset.theme=dark?"dark":"light";root.dataset.accent=nextAccent;}
 function chooseMode(value:string){setMode(value);preview(value,accent)}function chooseAccent(value:string){setAccent(value);preview(mode,value)}
 return <section className="appearance-picker" aria-labelledby="appearance-title"><div className="appearance-title"><div><strong id="appearance-title">Appearance</strong><small>Preview changes instantly, then save your profile.</small></div></div><fieldset><legend>Brightness</legend><div className="mode-toggle">{modes.map(({id,label,icon:Icon})=><label className={mode===id?"selected":""} key={id}><input type="radio" name="theme_mode" value={id} checked={mode===id} onChange={()=>chooseMode(id)}/><Icon/><span>{label}</span></label>)}</div></fieldset><fieldset><legend>Color theme</legend><div className="palette-grid">{accents.map(item=><label className={accent===item.id?"selected":""} key={item.id}><input type="radio" name="accent_theme" value={item.id} checked={accent===item.id} onChange={()=>chooseAccent(item.id)}/><span className="palette-preview" style={{"--swatch-accent":item.colors[0],"--swatch-paper":item.colors[1],"--swatch-sidebar":item.colors[2]} as React.CSSProperties}><i/><b/><em/></span><span>{item.label}</span></label>)}</div></fieldset></section>;
}
