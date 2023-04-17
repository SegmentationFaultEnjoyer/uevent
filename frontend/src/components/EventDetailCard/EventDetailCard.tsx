import './EventDetailCard.scss'

import { FC } from 'react'

interface Props {
    title: string
    subtitle: string
}

const EventDetailCard: FC<Props> = ({ title, subtitle }) => {


    return (
        <div className='event-detail-card'>
            <p className='event-detail-card__title'>{title}</p>
            <p className='event-detail-card__subtitle'>{subtitle}</p>
        </div>
    )
}

export default EventDetailCard