import { FC } from 'react'
import './style.scss'

import { ReactProps } from '@/types'

const AnimatedBackground: FC<ReactProps> = ({ children }) => {
    return (
        <div className="bubbles">
            {children}
            {new Array(50).fill('').map((_, i) => <div className='bubble' key={i}></div>)}
        </div>
    )
}

export default AnimatedBackground