import './EventPage.scss'

import dayjs from 'dayjs'
import { useEffect, useState, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from '@mui/material'
import { LocalActivityOutlined as TicketIcon } from '@mui/icons-material'

import { TriangleLoader, Modal } from "@/common"
import { EventDetailCard } from '@/components'
import { EventComments } from '@/pages/EventPage'
import { EventProps, useEvents, useProviderInit } from "@/hooks"
import { formatFiatAsset, formatIPFSLink } from '@/helpers'
import { PurchaseTicketForm } from '@/forms'

import { ROUTES } from '@/enums'
import { config } from '@/config'

export default function EventPage() {
    const { event_id } = useParams()
    const { getEvent } = useEvents()
    const { provider, connect } = useProviderInit()

    const [isLoading, setIsLoading] = useState(true)
    const [isPurchaseModalShown, setIsPurchaseModalShown] = useState(false)
    const [event, setEvent] = useState<EventProps>()

    const isProviderConnected = useMemo(() => Boolean(provider.selectedAddress),
        [provider.selectedAddress])

    useEffect(() => {
        const init = async () => {
            if (!event_id) return

            const data = await getEvent(event_id)

            if (!data) return

            setEvent(data.data)
            setIsLoading(false)
        }
        init()
    }, [])

    return (
        <div className="event-page">
            {isLoading ?
                <div className="event-page__loader">
                    <TriangleLoader />
                </div>
                :
                <>
                    {event &&
                        <>
                            <main className='event-page__main'>
                                <div className='event-page__banner-wrapper'>
                                    <img
                                        className='event-page__banner'
                                        src={formatIPFSLink(event.attributes.banner_hash!)}
                                        alt="event-banner" />
                                    {event.attributes.price ?
                                        <div className='event-page__price-wrapper'>
                                            <p className='event-page__price-lbl'>Price per ticket:</p>
                                            <p className='event-page__price'>{formatFiatAsset(event.attributes.price!, 'USD')}</p>
                                        </div> :
                                        <p className='event-page__price-lbl event-page__price-lbl--free'>Free Enterance</p>
                                    }


                                </div>
                                <div className='event-page__info'>
                                    <header>
                                        <p className='event-page__category'>{event.attributes.category}</p>
                                        <h1 className='event-page__title'>{event.attributes.title}</h1>
                                        <h3 className='event-page__subtitle'>
                                            {`owned by `}
                                            <Link
                                                className='event-page__subtitle event-page__subtitle--link'
                                                to={`${ROUTES.company}/${event.relationships.company.data.id}`}>
                                                {event.relationships.company.data.attributes.name}
                                            </Link>
                                        </h3>
                                    </header>

                                    <section className='event-page__details'>
                                        <EventDetailCard
                                            title='location'
                                            subtitle={event.attributes.is_offline ? event.attributes.location as string : 'Online event'} />
                                        <EventDetailCard
                                            title='start date'
                                            subtitle={dayjs(event.attributes.start_date).format('DD.MM.YYYY HH:mm')} />
                                        <EventDetailCard
                                            title='end date'
                                            subtitle={dayjs(event.attributes.end_date).format('DD.MM.YYYY HH:mm')} />
                                        <EventDetailCard
                                            title='supported by'
                                            subtitle={config.FACTORY_CHAIN_NAME} />
                                    </section>
                                    {isProviderConnected ?
                                        <Button
                                            className='event-page__submit-btn'
                                            variant='contained'
                                            size='large'
                                            disabled={dayjs(event.attributes.start_date).isBefore(Date.now())}
                                            endIcon={<TicketIcon />}
                                            onClick={() => setIsPurchaseModalShown(true)}
                                            color='primary_main'>
                                            {Number(event.attributes.price) > 0 ? 'Buy ticket' : 'Claim ticket'}
                                        </Button> :
                                        <Button
                                            className='event-page__submit-btn'
                                            variant='contained'
                                            size='large'
                                            color='primary_main'
                                            onClick={() => connect()}>
                                            Connect to metamask
                                        </Button>
                                    }

                                    <Modal isShown={isPurchaseModalShown} setIsShown={setIsPurchaseModalShown}>
                                        <PurchaseTicketForm
                                            closeModal={() => { setIsPurchaseModalShown(false) }}
                                            eventInfo={event.attributes} />
                                    </Modal>

                                </div>
                            </main>
                            <div className='event-page__description'>
                                <p className='event-page__section-title'>
                                    Description
                                </p>
                                <p>{event.attributes.description}</p>
                            </div>

                            <EventComments />
                        </>
                    }
                </>}
        </div>
    )
}