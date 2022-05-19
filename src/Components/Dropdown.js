import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  solid } from '@fortawesome/fontawesome-svg-core/import.macro' 
import { useEffect, useRef, useState } from 'react';

export default function Dropdown(props){
    const [open, setOpen] = useState(false);

    function useOutsideAlerter(ref) {
        useEffect(() => {
          function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
              setOpen(false);
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [ref]);
      }

      const wrapperRef = useRef(null);
      useOutsideAlerter(wrapperRef);

      function closeApp(){
        window.api.send('close', 'close');
      }

    return (
        <div className="relative self-start">
            <FontAwesomeIcon icon={solid('bars')} className="text-slate-400 hover:text-slate-500 m-2 cursor-pointer" size='lg' onClick={() => setOpen(!open)} />
            {open && (<div className='w-48 h-fit bg-white shadow absolute top-8 left-2 z-30' ref={wrapperRef}>
                <div className='m-1 p-1 cursor-pointer hover:bg-slate-200' onClick={props.resetTasks}>
                    <p className='text-left'>
                        Reset Tasks
                    </p>
                </div>
                <div className='m-1 p-1 cursor-pointer hover:bg-slate-200' onClick={() => {props.toggleChangeBackground(); setOpen(false);}}>
                    <p className='text-left'>
                        Change Background
                    </p>
                </div>
                <hr />
                <div className='m-1 p-1 cursor-pointer hover:bg-slate-200' onClick={closeApp}>
                    <p className='text-left'>
                        Quit
                    </p>
                </div>
            </div>)
            }
        </div>
    ); 
}