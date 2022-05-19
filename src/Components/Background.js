import { useCallback, useState } from 'react';
import '../App.css';

export default function Background(props){    
    return (
        <div className='h-full w-full absolute top-0 left-0 -z-10 flex flex-col'>
            <div className='w-full bg-neutral-100 shadow-lg' style={{height: "14%"}}></div>
            <div className='flex-auto bg-red-200 w-full -z-20 overflow-hidden' style={{height: "86%"}}>
                <img key={props.imgLoad} src={"lltd://bg.png?="+props.imgLoad} className="w-full h-full object-cover" alt="" />
            </div>
        </div>
    ); 
}