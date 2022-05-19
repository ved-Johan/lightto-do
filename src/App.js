import { useEffect, useState } from 'react';
import './App.css';
import AddTask from './Components/AddTask';
import TaskContainer from './Components/TaskContainer';
import Background from './Components/Background';
import Dropdown from './Components/Dropdown';
import BackgroundSetter from './Components/BackgroundSetter';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [tasks, setTasks] = useState([]);
  const [render, setRender] = useState(1);
  const [loading, setLoading] = useState(true);
  const [changeBackground, setChangeBackground] = useState(false)
  const [imgUrl, setImgUrl] = useState(null);
  const [imgLoad, setImgLoad] = useState(0);

  useEffect(() => {
    window.api.send('getJson', {}, (err) => console.log(err));
    window.api.send('gdp', {}, (err) => console.log(err));
  }, []);
  window.api.receive("receiveJson", (data) => {if(data){setTasks(data)}; setLoading(false);});
  window.api.receive("rdp", (data) => {setImgUrl(data+"\\bg.png")});

  useEffect(() => {
    if(!loading){
      window.api.send('write', tasks, (err) => {})
    }
  }, [tasks, loading]);

  function addTask(task){
    let hid=0;
    tasks.forEach(n => {if(n.id >= hid) hid=n.id+1;});
    task.id=hid;
    const completetasks = tasks.findIndex(n => n.complete);
    const ntasks = tasks.slice();
    if(completetasks !== -1)
      ntasks.splice(completetasks,0,task);
    else 
      ntasks.push(task);
    setTasks(ntasks);
    setRender((render+1)%4);
  }

  function resetTasks(){
    setTasks([]);
    setRender((render+1)%4);
  }

  function toggleChangeBackground(){
    setChangeBackground(!changeBackground);
    if(changeBackground)
      setImgLoad((imgLoad+1)%10);
  }

  return (
    <div className="App h-screen overflow-hidden font-sans flex flex-col justify-end">
      <AnimatePresence>
      {changeBackground && <BackgroundSetter toggleChangeBackground={toggleChangeBackground} imgUrl={imgUrl}/>}
      </AnimatePresence>
      <Background imgLoad={imgLoad}/>
      <Dropdown resetTasks={resetTasks} toggleChangeBackground={toggleChangeBackground} />
      <AddTask addTask={addTask}/>
      <TaskContainer key="render" tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default App;
