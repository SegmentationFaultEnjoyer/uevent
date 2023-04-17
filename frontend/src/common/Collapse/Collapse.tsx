import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, FC } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { ReactProps } from '@/types'

interface Props extends ReactProps {
    isOpen: boolean,
    duration?: number,
}

const Collapse: FC<Props> = ({ isOpen, duration = 0.25, children, ...rest }) => {
    const uid = useMemo(() => uuidv4(), [])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key={`collapse-${uid}`}
                    initial='collapsed'
                    animate='open'
                    exit='collapsed'
                    variants={{
                        open: { opacity: 1, height: 'auto', overflowY: 'hidden' },
                        collapsed: { opacity: 0, height: 0, overflowY: 'hidden' },
                    }}
                    transition={{ duration: duration }}
                    {...rest}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )

}

export default Collapse