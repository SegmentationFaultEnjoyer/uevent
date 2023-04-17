import './EventCard.scss'

import { FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatFiatAsset } from '@/helpers'
import { ROUTES } from '@/enums'

interface Props {
    name: string
    date: string,
    imgUrl: string
    price: string
    id: number,
    scheme?: 'expired' | 'default'
}

const EventCard: FC<Props> = ({ name, date, imgUrl, price, id, scheme = 'default' }) => {
    const navigate = useNavigate()

    const toEventPage = () => {
        navigate(`${ROUTES.event}/${id}`)
    }

    const eventCardClasses = useMemo(() => `event-card event-card--${scheme}`, [])

    return (
        <div className={eventCardClasses} onClick={() => toEventPage()}>
            <img className='event-card__banner' src={imgUrl} alt='event-banner' />
            <div className='event-card__details'>
                <header className='event-card__header'>
                    <p className='event-card__details-item event-card__details-item--bold'>{name}</p>
                    <p className='event-card__details-item event-card__details-item--bold event-card__details-item--italic'>
                        {formatFiatAsset(price, 'USD')}
                    </p>
                </header>

                <p className='event-card__details-item'>{date}</p>
            </div>
        </div>
    )
}

export default EventCard