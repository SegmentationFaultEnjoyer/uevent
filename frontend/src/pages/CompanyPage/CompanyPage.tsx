import './CompanyPage.scss'

import {
    MoreHoriz as MoreIcon,
    EmailOutlined as EmailIcon,
    PhoneOutlined as PhoneIcon,
    Telegram as TelegramIcon,
    Instagram as InstagramIcon,
    VisibilityOffOutlined as AddressIcon,
} from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { TriangleLoader, DropDown, Modal } from '@/common'
import { SingleSelect } from '@/fields'
import { CompanyForm } from '@/forms'
import { EventCard } from '@/components'
import { CompanyDetails } from '@/pages/CompanyPage'

import {
    CompanyProps,
    EventsListResponse,
    useCompany,
    useEvents,
    useProviderInit,
    usePaginate,
} from '@/hooks'
import { ErrorHandler, formatIPFSLink, useDidUpdateEffect } from '@/helpers'
import { ROUTES } from '@/enums'
import dayjs from 'dayjs'

enum EVENT_FILTERS {
    all = 'All events',
    available = 'Available events',
}

export default function CompanyPage() {
    const { id } = useParams()
    const { getCompany } = useCompany()
    const { getEventsList } = useEvents()
    const { provider } = useProviderInit()

    const navigate = useNavigate()

    const [company, setCompany] = useState<CompanyProps>()
    const [events, setEvents] = useState<EventsListResponse>()
    const [isLoading, setIsLoading] = useState(true)
    const [eventFilter, setEventFilter] = useState<string>(EVENT_FILTERS.all)
    const [dropDownAnchor, setDropDownAnchor] = useState<HTMLElement | null>(null)
    const dropDownRef = useRef(null)

    const [filters, setFilters] = useState({
        company_id: id,
        ...(eventFilter === EVENT_FILTERS.all ? {} : {
            start_date: dayjs(Date.now()).toISOString()
        })
    })

    const [isUpdateModalShown, setIsUpdateModalShown] = useState(false)

    const pageLoader = async (filters: Object) => {
        const eventsList = await getEventsList(filters)

        return eventsList
    }

    const { loadMore, init: loadEvents, isLoadingMore, isLoadMoreShown } = usePaginate<EventsListResponse>(
        events,
        // @ts-ignore
        setEvents,
        pageLoader,
        filters,
    )

    const isOwner = useMemo(
        () => provider.selectedAddress === company?.attributes.owner,
        [provider.selectedAddress, company]
    )

    const isExpired = (date: string) => {
        return dayjs(date).isBefore(Date.now())
    }

    const init = async () => {
        if (!id) return

        try {
            const { data: companyData } = await getCompany(id)
            await loadEvents()

            setCompany(companyData)
        } catch (error) {
            ErrorHandler.processWithoutFeedback(error)
        }

        setIsLoading(false)

    }

    useEffect(() => {
        init()
    }, [])

    useDidUpdateEffect(() => {
        setFilters(prev => ({
            ...prev,
            ...(eventFilter === EVENT_FILTERS.all ? { start_date: '' } : {
                start_date: dayjs(Date.now()).toISOString()
            })
        }))

    }, [eventFilter])


    return (
        <div className='company-page'>
            {isLoading ? <TriangleLoader /> :
                <>
                    {company ?
                        <>
                            <header className='company-page__header'>
                                <div className='company-page__header-actions'>
                                    <h1 className='company-page__title'>{company.attributes.name}</h1>
                                    {isOwner && <DropDown
                                        trigger={
                                            <IconButton
                                                color='primary_main'
                                                ref={dropDownRef}
                                                onClick={() => setDropDownAnchor(dropDownRef.current)}
                                            >
                                                <MoreIcon fontSize='large' />
                                            </IconButton>
                                        }
                                        anchorEl={dropDownAnchor}
                                        setAnchorEl={setDropDownAnchor}
                                    >

                                        <section className='company-page__actions-wrapper'>
                                            <Button
                                                color='secondary_main'
                                                onClick={() => {
                                                    setDropDownAnchor(null)
                                                    navigate(`${ROUTES.createEvent}/${id}`)
                                                }}>
                                                Create Event
                                            </Button>
                                            <Button
                                                color='secondary_main'
                                                onClick={() => {
                                                    setDropDownAnchor(null)
                                                    navigate(`${ROUTES.promocodes}/${id}`)
                                                }}>
                                                Promocodes
                                            </Button>
                                            <Button
                                                color='secondary_main'
                                                onClick={() => {
                                                    setDropDownAnchor(null)
                                                    setIsUpdateModalShown(true)
                                                }}>
                                                Edit Company Details
                                            </Button>
                                        </section>
                                    </DropDown>
                                    }
                                </div>

                                <CompanyDetails company={company.attributes} />

                                {company.attributes.description &&
                                    <p className='company-page__decscription'>
                                        {company.attributes.description}
                                    </p>}
                            </header>

                            <main className='company-page__events'>
                                <section className='company-page__events-header'>
                                    <h1 className='company-page__title'>Events</h1>
                                    <SingleSelect
                                        value={eventFilter}
                                        setValue={setEventFilter}
                                        label='Filter'
                                        choices={Object.values(EVENT_FILTERS)} />
                                </section>

                                <div className='company-page__events-wrapper'>
                                    {(events && events.data.length > 0) ? events.data.map(event => (
                                        <EventCard
                                            scheme={isExpired(event.attributes.start_date!) ? 'expired' : 'default'}
                                            key={event.id}
                                            id={event.id}
                                            name={event.attributes.title!}
                                            price={event.attributes.price!}
                                            date={dayjs(event.attributes.start_date).format('DD.MM.YYYY HH:mm')}
                                            imgUrl={formatIPFSLink(event.attributes.banner_hash!)} />
                                    )) : <h3 className='company-page__events-not-found'>No available events found</h3>}
                                </div>
                                {isLoadMoreShown && events && events.data.length > 0 && (!isLoadingMore ?
                                    <Button
                                        variant='outlined'
                                        size='large'
                                        color='primary_light'
                                        className='company-page__load-more-btn'
                                        onClick={loadMore}>
                                        Load More
                                    </Button> :
                                    <LoadingButton className='company-page__load-more-btn' loading variant='outlined'>
                                        Submit
                                    </LoadingButton>)
                                }

                            </main>
                            <Modal
                                setIsShown={setIsUpdateModalShown}
                                isShown={isUpdateModalShown}>
                                <CompanyForm
                                    closeModal={() => { setIsUpdateModalShown(false) }}
                                    pageReloader={init}
                                    companyInfo={company.attributes}
                                    owner={provider.selectedAddress} />
                            </Modal>

                        </>
                        : <h1 className='company-page__not-found'>No company found</h1>
                    }
                </>}
        </div>
    )
}