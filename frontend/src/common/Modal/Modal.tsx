import './styles.scss'

import { AnimatePresence, motion, MotionProps } from 'framer-motion'
import { Dispatch, FC, HTMLAttributes, SetStateAction, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClickAway } from 'react-use'

type Props = {
  isShown: boolean
  setIsShown: Dispatch<SetStateAction<boolean>>
  isCloseByClickOutside?: boolean
} & HTMLAttributes<HTMLDivElement> &
  MotionProps

const modalRoot = document.getElementById('modal') as HTMLElement

const Modal: FC<Props> = ({
  isShown,
  setIsShown,
  isCloseByClickOutside = true,
  children,
  className,
  ...rest
}) => {
  const modalPaneRef = useRef(null)

  useClickAway(modalPaneRef, () => {
    if (isCloseByClickOutside) {
      setIsShown(false)
    }
  })

  return createPortal(
    <>
      <AnimatePresence initial={false}>
        {isShown && (
          <motion.div
            className={`modal ${className || ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            {...rest}
          >
            <div ref={modalPaneRef} className='modal__pane'>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    modalRoot,
  )
}

export default Modal
