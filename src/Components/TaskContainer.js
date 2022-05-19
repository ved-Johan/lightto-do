import { AnimatePresence, Reorder } from 'framer-motion';
import { useState } from 'react';
import '../App.css';
import Task from './Task';

export default function TaskContainer(props){
    const [reload, setReload] = useState(false);

    function toggleCompleteTask(task){
        const index = props.tasks.indexOf(task);
        let newtasks = props.tasks;
        newtasks[index].complete = !newtasks[index].complete;
        if(newtasks[index].complete){
          newtasks = reorder(newtasks, index, newtasks.length-1);
        }else{
          newtasks = reorder(newtasks, index, 0);
        }
        props.setTasks(newtasks);
        setReload(!reload);
      }

      function removeTask(task){
        const index = props.tasks.indexOf(task);
        let newtasks = props.tasks.filter(n => true);
        newtasks.splice(index, 1);
        props.setTasks(newtasks);
        setReload(!reload);
      }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
      };

    function setText(id, text){
      const ntasks = props.tasks.filter(n => true);
      let n = ntasks.findIndex(n => n.id === id);
      ntasks[n].text = text;
      props.setTasks(ntasks);
    }

    return (
        <Reorder.Group axis='y' 
                values={props.tasks} 
                onReorder={props.setTasks} 
                layoutScroll
                style={{ height:"77%" }}
                className='m-3 overflow-y-auto overflow-x-hidden flex flex-col gap-2.5 '  >
            <AnimatePresence>
                {props.tasks.map((n,index) => 
                    <Task 
                        value={n} 
                        key={"task-"+n.id} 
                        index={index} 
                        text={n.text}
                        toggleCompleteTask={() => toggleCompleteTask(n)}
                        removeTask={() => removeTask(n)}
                        setText={(text) => setText(n.id, text)}
                        complete={n.complete}
                    />    
                )}
            </AnimatePresence>
        </Reorder.Group>
    ); 
}