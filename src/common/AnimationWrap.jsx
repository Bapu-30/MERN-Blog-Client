import { AnimatePresence, animate, motion } from 'framer-motion'
const AnimationWrap = ({ children, initial = { opacity: 0 }, animate = { opacity: 1 }, transition = { duration: 1 }, keyVal, className }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={ initial }
        animate={ animate }
        transition={ transition }
        key={keyVal}
        className={ className }
      >
        { children }
      </motion.div>
    </AnimatePresence>
  )
}
export default AnimationWrap