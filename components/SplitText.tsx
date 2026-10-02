import { motion } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  stagger?: number
  mode?: 'chars' | 'words'
  once?: boolean
  viewport?: boolean
}

const charVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -40, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.03,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.07,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export default function SplitText({
  text,
  className,
  style,
  delay = 0,
  stagger = 0.03,
  mode = 'chars',
  once = true,
  viewport = true,
}: SplitTextProps) {
  if (mode === 'words') {
    const words = text.split(' ')
    return (
      <span
        className={className}
        style={{ display: 'inline-block', overflow: 'visible', ...style }}
        aria-label={text}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={wordVariants}
            initial="hidden"
            whileInView={viewport ? 'visible' : undefined}
            animate={!viewport ? 'visible' : undefined}
            viewport={once ? { once: true } : undefined}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    )
  }

  const chars = text.split('')
  return (
    <span
      className={className}
      style={{ display: 'inline-block', overflow: 'visible', ...style }}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          custom={i + delay / stagger}
          variants={charVariants}
          initial="hidden"
          whileInView={viewport ? 'visible' : undefined}
          animate={!viewport ? 'visible' : undefined}
          viewport={once ? { once: true } : undefined}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </span>
  )
}
