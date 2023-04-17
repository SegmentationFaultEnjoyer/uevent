import './Image.scss'

import { useState, useRef, FC } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ReactProps } from '@/types'
import { createPortal } from 'react-dom'

interface Props extends ReactProps {
    url: string
    alt: string
}

const Image: FC<Props> = ({ url, alt }) => {
    const [isFullScreen, setIsFullScreen] = useState(false)
    const fullScreenRef = useRef(null)


    const modalRoot = document.getElementById('modal') as HTMLElement

    return (
        <>
            <img
                src={url}
                alt={alt}
                onClick={() => setIsFullScreen(true)}
                className='image' />
            {createPortal(<CSSTransition
                nodeRef={fullScreenRef}
                in={isFullScreen}
                timeout={250}
                classNames='image'
                unmountOnExit
            >
                <div
                    className='image__fullscreen'
                    ref={fullScreenRef}
                    onClick={() => setIsFullScreen(false)}
                >
                    <img
                        src={url}
                        alt={alt}
                        className='image image--disable-hover' />
                </div>
            </CSSTransition>, modalRoot)}

        </>
    )
}

export default Image