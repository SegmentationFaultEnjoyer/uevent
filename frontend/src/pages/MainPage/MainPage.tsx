import './MainPage.scss';

import { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import { LoadingButton } from '@mui/lab'
import { Button } from '@mui/material';

import { TriangleLoader } from '@/common';
import { EventPreview } from '@/components';
import { useEvents, usePaginate, EventsListResponse } from '@/hooks';

import { ErrorHandler, useDidUpdateEffect } from '@/helpers';
import { SingleSelect } from '@/fields'
import dayjs from 'dayjs';

export default function MainPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [eventList, setEventList] = useState<EventsListResponse>()
    const [category, setCategory] = useState('All')
    const [categories, setCategories] = useState<string[]>(['All'])
    const { getEventsCategories } = useEvents()

    const { getEventsList } = useEvents()

    const [filters, setFilters] = useState({
        category: category !== 'All' ? category : null,
        start_date: dayjs(Date.now()).toISOString(),
    })

    const pageLoader = async (filters: Object) => {
        const promocodesList = await getEventsList(filters)

        return promocodesList
    }

    const { loadMore, init: loadEvents, isLoadingMore, isLoadMoreShown } = usePaginate<EventsListResponse>(
        eventList,
        // @ts-ignore
        setEventList,
        pageLoader,
        filters,
    )

    useDidUpdateEffect(() => {
        setFilters(prev => ({
            ...prev,
            category: category !== 'All' ? category : null,
        }))
    }, [category])

    useEffect(() => {
        const initPage = async () => {
            try {
                await loadEvents()

                const categoriesList = await getEventsCategories()

                setCategories(prev => [...prev, ...categoriesList])
            } catch (error) {
                ErrorHandler.process(error)
            }

            setIsLoading(false)
        }

        initPage()
    }, []);

    return (
        <section className="main-page">
            {isLoading ?
                <div className="main-page__loader-container">
                    <p>Loading...</p>
                    <TriangleLoader />
                </div>
                :
                <>
                    <header className='main-page__header'>
                        <h1>Recent Events</h1>
                        {categories.length > 0 &&
                            <div className='main-page__filter-wrapper'>
                                <SingleSelect
                                    value={category}
                                    setValue={setCategory}
                                    label='Category'
                                    choices={categories} />
                            </div>

                        }
                    </header>

                    <section className='main-page__events'>
                        {eventList && eventList.data.length > 0 &&
                            eventList.data.map(event =>
                                <EventPreview event={event} key={event.id} />)}
                    </section>

                    {isLoadMoreShown && eventList && eventList.data.length > 0 && (!isLoadingMore ?
                        <Button
                            variant='outlined'
                            size='large'
                            color='primary_light'
                            className='main-page__load-more-btn'
                            onClick={loadMore}>
                            Load More
                        </Button> :
                        <LoadingButton className='main-page__load-more-btn' loading variant='outlined'>
                            Submit
                        </LoadingButton>)
                    }

                    <CookieConsent
                        containerClasses='slide-top'
                        style={{ background: "var(--primary-main)" }}
                        buttonStyle={{
                            backgroundColor: "var(--secondary-main)",
                            color: "var(--tertiary-main)",
                            borderRadius: "5px"
                        }}>
                        This website uses cookies to enhance the user experience.
                    </CookieConsent>
                </>}
        </section>
    )
}