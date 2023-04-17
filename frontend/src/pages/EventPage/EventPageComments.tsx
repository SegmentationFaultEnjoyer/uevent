import './EventPageComments.scss'

import { FC, useMemo, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { AccountCircle, ContactMail as CompanyIcon } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { CommentForm } from '@/forms'
import { useProviderInit, useComments, CommentProps, usePaginate, CommentsListResponse } from '@/hooks'
import { cropAddress, ErrorHandler } from '@/helpers'
import { ROUTES } from '@/enums'
import dayjs from 'dayjs'

const EventPageComments: FC = () => {
    const { provider } = useProviderInit()
    const { getCommentsList } = useComments()
    const { event_id } = useParams()

    const [commentList, setCommentsList] = useState<CommentsListResponse>()
    const [filters, setFilters] = useState({
        event_id: event_id as string
    })

    const pageLoader = async (filters: Object) => {
        // @ts-ignore
        const eventsList = await getCommentsList(filters)

        return eventsList
    }

    const { loadMore, init: loadComments, isLoadingMore, isLoadMoreShown } = usePaginate<CommentsListResponse>(
        commentList,
        // @ts-ignore
        setCommentsList,
        pageLoader,
        filters,
    )

    const isProviderConnected = useMemo(
        () => Boolean(provider.selectedAddress),
        [provider.selectedAddress])

    const init = async () => {
        try {
            await loadComments()

        } catch (error) {
            ErrorHandler.processWithoutFeedback(error)
        }
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div className='event-page-comments'>
            <p className='event-page-comments__title'>
                Comments
            </p>
            <main className='event-page-comments__main'>
                {
                    commentList && commentList.data.length > 0 &&
                    commentList.data.map(comment =>
                        <div
                            className='event-page-comments__item'
                            key={comment.id}>
                            <header className='event-page-comments__item-head'>
                                <div className='event-page-comments__item-author'>
                                    {comment.relationships.company ?
                                        <CompanyIcon fontSize='large' /> :
                                        <AccountCircle fontSize='large' />
                                    }

                                    {comment.relationships.company ?
                                        <Link
                                            className='event-page-comments__link'
                                            to={`${ROUTES.company}/${comment.relationships.company.data.id}`}>
                                            {comment.relationships.company.data.name}
                                        </Link> :
                                        <p>{cropAddress(comment.relationships.user.data.address)}</p>
                                    }

                                </div>

                                <p className='event-page-comments__publish-date'>
                                    {dayjs(comment.attributes.publishDate).format('DD MMM YYYY HH:mm')}
                                </p>
                            </header>

                            <p className='event-page-comments__comment'>{comment.attributes.comment}</p>

                        </div>
                    )
                }

                {isLoadMoreShown && commentList && commentList.data.length > 0 && (!isLoadingMore ?
                    <Button
                        variant='outlined'
                        size='large'
                        color='primary_light'
                        className='event-page-comments__load-more-btn'
                        onClick={loadMore}>
                        Load More
                    </Button> :
                    <LoadingButton className='event-page-comments__load-more-btn' loading variant='outlined'>
                        Submit
                    </LoadingButton>)
                }

            </main>
            <section className='event-page-comments__actions'>
                {isProviderConnected &&
                    <CommentForm
                        userAddress={provider.selectedAddress}
                        pageReloader={init} />
                }
            </section>

        </div>)
}

export default EventPageComments