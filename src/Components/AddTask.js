import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  solid } from '@fortawesome/fontawesome-svg-core/import.macro' 
import { useState } from 'react';

export default function AddTask(props){
    const [text, setText] = useState("");
    
    function newTask(){
        if(!/\S/.test(text)) return;
        const nt = {
            text: text,
            complete: false
        }
        props.addTask(nt);
        setText("");
    }

    function handleKeypress(e) {
        //it triggers by pressing the enter key
      if (e.keyCode === 13) {
        newTask();
      }
    };

    return (
        <div className='h-fit m-2 mb-2 mt-2'>
            <div className='h-12 rounded bg-slate-100 flex shadow-lg'>
                <input className='w-full h-full rounded-l focus:outline-none px-2 ' value={text || ""} onChange={(e) => setText(e.target.value)} onKeyUp={handleKeypress}/>
                <button className='h-full w-16 rounded-r border-l text-slate-500 hover:text-slate-700 transition' onClick={newTask}>
                    <FontAwesomeIcon icon={solid('plus')} />
                </button>
            </div>
        </div>
    ); 
}