import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  regular } from '@fortawesome/fontawesome-svg-core/import.macro' 
import { ReactComponent as GripDots } from '../svg/grip_vertical_icon.svg';

export default function HoverButtons(props){
    return (
        <div className={'w-12 h-full bg-gradient-to-l flex items-center justify-center '+(props.complete?"from-emerald-500 via-emerald-500 ":"from-slate-100 via-slate-100")}>
            <FontAwesomeIcon icon={regular('trash-can')} size='md' className={'me-2 '+(props.complete?"text-white":"text-slate-500")} />
            <GripDots className={(props.complete?"text-white":"text-slate-500")} />
        </div>
    ); 
}