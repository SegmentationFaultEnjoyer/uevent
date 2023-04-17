import './PromocodeInfoCard.scss'

import { FC, useMemo } from 'react'
import { ErrorOutline, CheckCircleOutline } from '@mui/icons-material'

type SCHEME = 'valid' | 'invalid'

interface Props {
    scheme?: SCHEME
    percent?: number
}

const PromocodeInfoCard: FC<Props> = ({ scheme = 'valid', percent = 0 }) => {
    const classes = useMemo(() => {
        return `promocode-info-card promocode-info-card--${scheme}`
    }, [scheme])


    return (
        <div className={classes}>
            {scheme === 'invalid' ?
                <ErrorOutline color='primary_main' /> :
                <CheckCircleOutline color='primary_main' />
            }
            {scheme === 'invalid' ?
                <p className='promocode-info-card__label'>
                    Promocode is invalid
                </p> :
                <p className='promocode-info-card__label'>
                    {`Your discount is ${percent}%`}
                </p>}
        </div>
    )
}

export default PromocodeInfoCard