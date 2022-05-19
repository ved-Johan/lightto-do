import { useCallback, useRef, useState } from 'react';
import '../App.css';
import CheckButton from './CheckButton';
import TaskText from './TaskText';
import { motion, AnimatePresence, Reorder, useDragControls, useMotionValue } from "framer-motion"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  regular } from '@fortawesome/fontawesome-svg-core/import.macro' 
import { ReactComponent as GripDots } from '../svg/grip_vertical_icon.svg';


export default function Task(props){
    const [hover, setHover] = useState(false);
    const [edit, setEdit] = useState(false);
    const [curText, setCurText] = useState(props.text);

    useCallback(() => setCurText(props.text),[props.text]);

    const y = useMotionValue(0);
    const controls = useDragControls()

    function closeEdit(){
        props.setText(curText);
        setEdit(false);
    }



      const inputEl = useRef(null);
      function setInputFocus() {
          inputEl.current.focus();
      };

      function handleKeypress(e) {
        //it triggers by pressing the enter key
        if (e.keyCode === 13) {
            closeEdit();
        }
    };

    return (
            <Reorder.Item 
                className={'rounded h-16 shadow-md transition-bg '+(props.complete?"bg-teal-500 opacity-90":"bg-white opacity-95")}
                initial={{ scale: 0.1 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.1 }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}                
                drag
                dragListener={false}
                dragControls={controls}
                style={{y, minHeight: "4rem"}}
                id={props.value}
                value={props.value}
            >
                <div className='flex flex-row items-center justify-center h-full w-full relative'>
                    
                    <AnimatePresence>{hover &&
                        <motion.div className='absolute right-0 h-full'    
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className={'w-12 h-full bg-gradient-to-l flex items-center justify-center '+(props.complete?"from-teal-500 via-teal-500 ":"from-slate-100 via-slate-100")}>
                                <FontAwesomeIcon icon={regular('trash-can')} className={'pr-4 cursor-pointer '+(props.complete?"text-white":"text-slate-500")} onClick={props.removeTask}/>
                            </div>
                        </motion.div>
                    }</AnimatePresence>
                    <AnimatePresence >{hover &&
                    <motion.div className='absolute right-0 '            
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                        <div className='h-full cursor-grab' onPointerDown={(e) => controls.start(e)}>
                            <GripDots className={(props.complete?"text-white":"text-slate-500")} />
                        </div>
                    </motion.div>
                    }</AnimatePresence>
                    <div className='basis-2/12'>
                        <CheckButton toggleCompleteTask={props.toggleCompleteTask} complete={props.complete}/>
                    </div>
                    <div className='basis-10/12 h-full flex items-center justify-center'>
                    {edit ? <input type="text" ref={inputEl} className={"rounded border p-2 w-11/12 me-3 focus:outline-none "} value={curText} onChange={(e) => setCurText(e.target.value)} onKeyUp={handleKeypress}/>
                         : <TaskText text={props.text} complete={props.complete} handleClick={async () => {await setEdit(true); setInputFocus();}}/>}
                    </div>
                </div>
            </Reorder.Item>
    ); 
}