import { motion } from 'framer-motion';

export default function RouteLoader(){
  return <motion.div className="route-loader" role="status" aria-live="polite" aria-label="Preparing your practice space" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}>
    <div className="route-loader-mark">
      <motion.i animate={{scale:[.88,1,.88],opacity:[.45,1,.45]}} transition={{duration:1.8,repeat:Infinity,ease:'easeInOut'}}/>
      <motion.b animate={{rotate:360}} transition={{duration:8,repeat:Infinity,ease:'linear'}}>ॐ</motion.b>
    </div>
    <span>PREPARING YOUR SPACE</span>
  </motion.div>
}
