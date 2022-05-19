import '../App.css';

export default function TaskText(props){
    return (
        <div className='w-full text-left '>
            <div className={'rounded px-1 w-fit '+(props.complete?"":"hover:bg-slate-200")} onClick={props.handleClick}>
                <p className={'text-lg whitespace-normal cursor-default select-none '+(props.complete?"text-white line-through":"text-slate-900")}>{props.text}</p>
            </div>
        </div>
    ); 
}