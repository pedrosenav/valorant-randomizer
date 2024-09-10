import { motion, HTMLMotionProps, useAnimation } from 'framer-motion'

export default function SpinOnClick({
  children,
  ...props
}: HTMLMotionProps<'div'>) {
  const controls = useAnimation()

  const handleClick = () => {
    controls.start({
      rotate: [0, 360], // Rotate 360 degrees
      transition: { duration: 1, ease: 'easeInOut' },
    })
  }

  return (
    <motion.div
      animate={controls} // Controls the animation
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.div>
  )
}
