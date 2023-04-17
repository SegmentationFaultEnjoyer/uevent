import './EventPreview.scss'

import dayjs from 'dayjs'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { LocalActivityOutlined as TicketIcon } from '@mui/icons-material'

import { EventProps } from '@/hooks'
import { formatFiatAsset, formatIPFSLink } from '@/helpers'
import { EventDetailCard } from '@/components'
import { ROUTES } from '@/enums'
import { config } from '@/config'


interface Props {
    event: EventProps
}

const EventPreview: FC<Props> = ({ event }) => {
    const navigate = useNavigate()

    return (
        <div className='event-preview'>
            <main className='event-preview__main'>
                <div className='event-preview__banner-wrapper'>
                    <img
                        className='event-preview__banner'
                        src={formatIPFSLink(event.attributes.banner_hash!)}
                        alt="event-banner" />
                    <Button
                        variant='contained'
                        size='large'
                        endIcon={<TicketIcon />}
                        color='primary_light'
                        onClick={() => navigate(`${ROUTES.event}/${event.id}`)}>
                        {Number(event.attributes.price) > 0 ? 'Buy ticket' : 'Claim ticket'}
                    </Button>
                </div>
                <div className='event-preview__info'>
                    <header>
                        <h1 className='event-preview__title'>{event.attributes.title}</h1>
                        {Number(event.attributes.price) > 0 &&
                            <h3 className='event-preview__subtitle'>{formatFiatAsset(event.attributes.price!, 'USD')}</h3>
                        }
                    </header>

                    <section className='event-preview__details'>
                        <EventDetailCard
                            title='start date'
                            subtitle={dayjs(event.attributes.start_date).format('DD.MM.YYYY')} />
                        <EventDetailCard
                            title='location'
                            subtitle={event.attributes.is_offline ? event.attributes.location?.split(' ').at(-1) as string : 'Online event'} />


                        <EventDetailCard
                            title='supported by'
                            subtitle={config.FACTORY_CHAIN_NAME} />
                    </section>

                </div>
            </main>
        </div>
    )
}

export default EventPreview