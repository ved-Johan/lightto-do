import '../App.css';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function CheckButton(props){
    const pathLength = useMotionValue(0)
    const opacity = useTransform(pathLength, [0.05, 0.15], [0, 1])

    return (
        <div className='flex justify-center'>
            <motion.div
            className='shadow border-slate-400 border'
                style={{
                    width: 35,
                    height: 35,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    borderColor: (props.complete?"white":"")
                }}
                animate={{
                    scale: props.complete ? 1 : 0.8,
                    backgroundColor: props.complete
                        ? "rgba(255, 255, 255, 0)"
                        : "rgba(255, 255, 255 ,0)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onTap={() => props.toggleCompleteTask()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox='0 0 150 150'
                >
                    <motion.path
                        d="M38 74.707l24.647 24.646L116.5 45.5"
                        fill="transparent"
                        strokeWidth="20"
                        stroke="white"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: props.complete ? 0.9 : 0 }}
                        style={{ pathLength: pathLength, opacity: opacity }}
                    />
                </svg>
            </motion.div>
        </div>
    )
}