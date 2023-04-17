import './PromocodesPage.scss'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, IconButton } from '@mui/material'
import { CopyAll as CopyIcon, DeleteForeverOutlined as DeleteIcon } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'

import { Notificator, TriangleLoader, Modal, ConfirmationModal } from '@/common'
import { PromocodeForm } from '@/forms'
import {
    CompanyProps,
    useCompany,
    usePromocodes,
    usePaginate,
    PromocodesListResponse,
    useProviderInit
} from '@/hooks'
import { copyToClipboard, cropAddress, ErrorHandler, useDidUpdateEffect } from '@/helpers'
import { ROUTES } from '@/enums'
import dayjs from 'dayjs'

export default function PromocodesPage() {
    const { company_id } = useParams()
    const { getCompany } = useCompany()
    const { getPromocodesList, deletePromocode } = usePromocodes()

    const navigate = useNavigate()

    const [company, setCompany] = useState<CompanyProps>()
    const [promocodes, setPromocodes] = useState<PromocodesListResponse>()
    const [isLoading, setIsLoading] = useState(true)
    const [isProviderInitialized, setIsProviderInitialized] = useState(false)
    const [isCreatingPromocode, setIsCreatingPromocode] = useState(false)
    const [isDeletingPromocode, setIsDeletingPromocode] = useState(false)

    const { provider } = useProviderInit(setIsProviderInitialized)


    const [filters, setFilters] = useState({
        company_id,
    })

    const pageLoader = async (filters: Object) => {
        const promocodesList = await getPromocodesList(filters)

        return promocodesList
    }

    const { loadMore, init: loadPromocodes, isLoadingMore, isLoadMoreShown } = usePaginate<PromocodesListResponse>(
        promocodes,
        // @ts-ignore
        setPromocodes,
        pageLoader,
        filters,
    )

    const copyPromocode = async (value: string) => {
        await copyToClipboard(value)
        Notificator.info('Promocode copied')
    }

    const deletePromocodeHandler = async (id: string) => {
        try {
            await deletePromocode(id)
            await loadPromocodes()
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    useEffect(() => {
        const init = async () => {
            if (!company_id) return

            try {
                const { data } = await getCompany(company_id)

                setCompany(data)

                await loadPromocodes()
            } catch (error) {
                ErrorHandler.processWithoutFeedback(error)
            }

            setIsLoading(false)

        }
        init()
    }, [])

    useDidUpdateEffect(() => {
        if (isLoading || !isProviderInitialized) return

        if (provider.selectedAddress !== company?.attributes.owner) {
            Notificator.warning('You have no rights for this action')
            navigate(`${ROUTES.company}/${company_id}`)
        }
    }, [provider.selectedAddress, company, isProviderInitialized])

    return (
        <div className="promocodes-page">
            {isLoading ?
                <div className="promocodes-page__loader">
                    <TriangleLoader />
                </div> :

                company &&
                <>
                    <header className='promocodes-page__header'>
                        <h1>{`"${company.attributes.name}" promocodes`}</h1>
                        <Button
                            variant='outlined'
                            color='primary_light'
                            onClick={() => { setIsCreatingPromocode(true) }}>
                            Create Promocode
                        </Button>
                    </header>

                    <Modal
                        isShown={isCreatingPromocode}
                        setIsShown={setIsCreatingPromocode}>
                        <PromocodeForm
                            closeModal={() => { setIsCreatingPromocode(false) }}
                            pageReloader={loadPromocodes} />
                    </Modal>



                    <main className='promocodes-page__main'>
                        {promocodes?.data && promocodes.data.length > 0 &&
                            promocodes.data.map(el =>
                                <div className='promocodes-page__item' key={el.id}>
                                    <div className='promocodes-page__item-value'>
                                        <span>
                                            Promocode
                                        </span>
                                        <span className='promocodes-page__item-action'>
                                            {cropAddress(el.attributes.code)}
                                            <IconButton size='small' color='primary_main' onClick={() => { copyPromocode(el.attributes.code) }}>
                                                <CopyIcon fontSize='small' />
                                            </IconButton>
                                        </span>
                                    </div>

                                    <div className='promocodes-page__item-value'>
                                        <span>
                                            Discount
                                        </span>
                                        <span>
                                            {el.attributes.discount + '%'}
                                        </span>
                                    </div>
                                    <div className='promocodes-page__item-value'>
                                        <span>
                                            Initial usages
                                        </span>
                                        <span>
                                            {el.attributes.initial_usages}
                                        </span>
                                    </div>

                                    <div className='promocodes-page__item-value'>
                                        <span>
                                            Used
                                        </span>
                                        <span>
                                            {el.attributes.usages}
                                        </span>
                                    </div>

                                    <div className='promocodes-page__item-value'>
                                        <span>
                                            Expire date
                                        </span>
                                        <span>
                                            {dayjs(el.attributes.expire_date).format('DD.MM.YYYY HH:mm')}
                                        </span>

                                    </div>

                                    <IconButton color='primary_main' size='small' onClick={() => { setIsDeletingPromocode(true) }}>
                                        <DeleteIcon />
                                    </IconButton>

                                    <ConfirmationModal
                                        isOpen={isDeletingPromocode}
                                        setIsOpen={setIsDeletingPromocode}
                                        message='Promocode deleted'
                                        action={async () => { deletePromocodeHandler(el.id.toString()) }} />
                                </div>
                            )
                        }
                        {isLoadMoreShown && promocodes && promocodes.data.length > 0 && (!isLoadingMore ?
                            <Button
                                variant='outlined'
                                size='large'
                                color='primary_light'
                                className='promocode-page__load-more-btn'
                                onClick={loadMore}>
                                Load More
                            </Button> :
                            <LoadingButton className='promocode-page__load-more-btn' loading variant='outlined'>
                                Submit
                            </LoadingButton>)
                        }

                        {!promocodes?.data || promocodes.data.length === 0 && <h2>No promocodes</h2>}
                    </main>
                </>

            }

        </div>
    )
}