import './CreateEvent.scss'

import { TextField, Button, Checkbox } from '@mui/material'

import { useState, useEffect, FormEvent, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'

import {
    CompanyProps,
    useCompany,
    useProviderInit,
    useEventFactory,
    useEvents,
    useIpfsUpload,
    useMap
} from '@/hooks'
import { ErrorHandler, useDidUpdateEffect, switchChain, sleep, getShortAddress } from '@/helpers'
import { ROUTES } from '@/enums'
import { Notificator, DotsLoader, Map, Image, TriangleLoader } from '@/common'
import { DateTimePicker, FileField, AutocompleteInput } from '@/fields'
import { config } from '@/config'

import { BN } from '@/utils'
import { ProviderUserRejectedRequest } from '@/errors/runtime.errors'
import { Buffer } from 'buffer'

const MIN_DAY_OFFSET = 2

export default function CreateEventPage() {
    const initialDate = useMemo(() => dayjs(Date.now()).add(MIN_DAY_OFFSET, 'day'), [])

    const [eventName, setEventName] = useState('')
    const [eventSymbol, setEventSymbol] = useState('')
    const [eventDesc, setEventDesc] = useState('')
    const [price, setPrice] = useState('')
    const [startDate, setStartDate] = useState(initialDate)
    const [endDate, setEndDate] = useState(initialDate.add(1, 'hour'))
    const [eventBanner, setEventBanner] = useState<File | null>(null)
    const [linkToEvent, setLinkToEvent] = useState('')
    const [category, setCategory] = useState('')

    const [isNotificate, setIsNotificate] = useState(true)
    const [amountOfTickets, setAmountOfTickets] = useState(20)

    const [isOfflineEvent, setIsOfflineEvent] = useState(false)
    const [marker, setMarker] = useState({
        position: {
            lat: 49.843366,
            lng: 24.024905,
        },
        label: { color: "white", text: "P1" },
    })

    const [categories, setCategories] = useState<string[]>([])

    const [isAIBanner, setIsAIBanner] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedEventBanner, setGeneratedEventBanner] = useState('')
    const [generatedEventBannerB64, setGeneratedEventBannerB64] = useState('')
    const [promt, setPromt] = useState('')

    const { company_id } = useParams()
    const { getCompany } = useCompany()
    const { upload: uploadBanner, uploadBase64 } = useIpfsUpload()
    const { deployEvent } = useEventFactory(config.EVENT_FACTORY_ADDRESS)
    const { createEvent, getEventsCategories, generateEventBanner } = useEvents()
    const { getAddressFromCoordsRaw } = useMap()

    const [company, setCompany] = useState<CompanyProps>()
    const [isLoading, setIsLoading] = useState(true)
    const [isProviderInitialized, setIsProviderInitialized] = useState(false)

    const { provider } = useProviderInit(setIsProviderInitialized)

    const navigate = useNavigate()

    const isValidChain = useMemo(
        () => Number(config.EVENT_FACTORY_CHAIN_ID) === Number(provider.chainId),
        [provider.chainId]
    )

    useEffect(() => {
        const init = async () => {
            if (!company_id) return

            try {
                const { data } = await getCompany(company_id)

                setCompany(data)

                const categoriesList = await getEventsCategories()

                setCategories(categoriesList)
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

    const handleBannerUpload = async () => {
        let fileHash: string | undefined = undefined

        if (eventBanner && !isAIBanner) {
            fileHash = await uploadBanner(eventBanner)
        }

        if (isAIBanner && generatedEventBanner) {
            fileHash = await uploadBase64(generatedEventBannerB64)
        }

        return fileHash
    }

    const submit = async (event: FormEvent) => {
        if (!company?.attributes.name) return

        event.preventDefault()

        setIsLoading(true)
        try {
            const weiPrice = price ? new BN(price).toWei().toString() : '0'

            const contractResponse = await deployEvent(
                weiPrice,
                startDate.unix().toString(),
                endDate.unix().toString(),
                eventName,
                eventSymbol,
                company.attributes.name,
                isOfflineEvent ? `${marker.position.lat} ${marker.position.lng}` : linkToEvent,
                isOfflineEvent,
                config.IPFS_GATEWAY,
            )

            if (!contractResponse) return

            const deployedEventAddress = contractResponse.logs[0].address

            const fileHash = await handleBannerUpload()

            let rawAddress: google.maps.GeocoderResult | null = null

            if (isOfflineEvent) {
                rawAddress = await getAddressFromCoordsRaw(marker.position.lat, marker.position.lng)
                if (!rawAddress) throw new Error('failed to geocode marker coords')
            }

            await createEvent({
                title: eventName,
                description: eventDesc,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                price,
                company_id,
                banner_hash: fileHash,
                contract_address: deployedEventAddress,
                is_offline: isOfflineEvent,
                category,
                location: !isOfflineEvent ? '' : getShortAddress(rawAddress!.address_components!)
            })

            // give IPFS time раздуплиться 
            await sleep(2000)

            Notificator.success('Event succesfully created!')
            navigate(`${ROUTES.company}/${company_id}`)

        } catch (error) {
            if (error instanceof ProviderUserRejectedRequest) {
                ErrorHandler.processWithoutFeedback(error)
            } else {
                ErrorHandler.process(error)
            }

        }
        setIsLoading(false)
    }

    const generateBanner = async () => {
        if (!promt) return

        try {
            setIsGenerating(true)
            const { b64_json } = await generateEventBanner(promt)

            const arrayBuffer = Buffer.from(b64_json, 'base64')

            const imageData = new Blob([new Uint8Array(arrayBuffer)], { type: 'image/*' });

            const src = URL.createObjectURL(imageData)

            setGeneratedEventBanner(src)
            setGeneratedEventBannerB64(b64_json)

        } catch (error) {
            ErrorHandler.process(error)
        }
        setIsGenerating(false)
    }

    return (
        <div className='create-event'>
            <h1>Create Event</h1>
            <form className='create-event__form' onSubmit={submit}>
                {isLoading ?
                    <div className='create-event__loader'> <DotsLoader /> </div>
                    :
                    <>
                        <TextField
                            variant='filled'
                            label='Event name'
                            color='secondary_main'
                            required
                            value={eventName}
                            onChange={e => { setEventName(e.target.value) }}
                        />
                        <TextField
                            variant='filled'
                            label='Token symbol'
                            color='secondary_main'
                            required
                            placeholder='Need for smart contract'
                            value={eventSymbol}
                            onChange={e => { setEventSymbol(e.target.value) }} />
                        <TextField
                            variant='filled'
                            label='Max amount of tickets'
                            color='secondary_main'
                            required
                            type='number'
                            placeholder='Need for smart contract'
                            value={amountOfTickets}
                            onChange={e => { setAmountOfTickets(Number(e.target.value)) }} />
                        <TextField
                            variant='filled'
                            label='Description'
                            color='secondary_main'
                            required
                            multiline
                            placeholder='Need for smart contract'
                            value={eventDesc}
                            onChange={e => { setEventDesc(e.target.value) }} />
                        <TextField
                            variant='filled'
                            type='number'
                            label='Price per ticket ($)'
                            color='secondary_main'
                            placeholder='Leave blank for free enterance'
                            value={price}
                            onChange={e => { setPrice(e.target.value) }} />
                        <AutocompleteInput
                            value={category}
                            setValue={setCategory}
                            label='Category'
                            options={categories}
                        />
                        <DateTimePicker
                            label='Event start'
                            value={startDate}
                            setValue={setStartDate}
                            minDateTime={initialDate} />
                        <DateTimePicker
                            label='Event end'
                            value={endDate}
                            setValue={setEndDate}
                            minDateTime={startDate.add(1, 'hour')} />
                        {!isAIBanner && <FileField
                            file={eventBanner}
                            setFile={setEventBanner}
                            label='Upload your event banner'
                            sublabel='Any image less than 5 mb' />
                        }
                        <div className='create-event__checkbox'>
                            <Checkbox
                                color='primary_light'
                                value={isAIBanner}
                                onChange={e => { setIsAIBanner(e.target.checked) }} />
                            <span>Generate banner using AI</span>
                        </div>

                        {isAIBanner &&
                            <>
                                {!isGenerating ?
                                    <>
                                        <TextField
                                            variant='filled'
                                            label='Promt'
                                            required
                                            color='secondary_main'
                                            placeholder='Describe your future banner'
                                            value={promt}
                                            onChange={e => { setPromt(e.target.value) }} />
                                        <Button
                                            color='primary_light'
                                            variant='outlined'
                                            onClick={generateBanner}>
                                            Generate
                                        </Button>
                                    </> :
                                    <div className='create-event__ai-generation'>
                                        <TriangleLoader />
                                        <p>Generating...</p>
                                    </div>

                                }

                            </>
                        }

                        {generatedEventBanner && !isGenerating &&
                            <div className='create-event__images-wrapper'>
                                <Image url={generatedEventBanner} alt='generated banner' />
                            </div>
                        }

                        <div className='create-event__checkbox'>
                            <Checkbox
                                color='primary_light'
                                value={isOfflineEvent}
                                onChange={e => { setIsOfflineEvent(e.target.checked) }} />
                            <span>Offline event</span>
                        </div>

                        {isOfflineEvent &&
                            <Map
                                marker={marker}
                                setMarker={setMarker}
                            />
                        }

                        {!isOfflineEvent &&
                            <TextField
                                variant='filled'
                                type='url'
                                required
                                label='Link to online event'
                                color='secondary_main'
                                value={linkToEvent}
                                onChange={e => { setLinkToEvent(e.target.value) }} />
                        }

                        <div className='create-event__checkbox'>
                            <Checkbox
                                color='primary_light'
                                value={isNotificate}
                                onChange={e => { setIsNotificate(e.target.checked) }} />
                            <span>Notifications</span>
                        </div>


                        <section className='create-event__actions'>
                            <Button
                                color='primary_light'
                                size='large'
                                type='reset'
                                variant='outlined'
                                onClick={() => navigate(`${ROUTES.company}/${company_id}`)}>
                                Cancel
                            </Button>
                            {isValidChain ?
                                <Button
                                    size='large'
                                    type='submit'
                                    color='primary_light'
                                    variant='contained'>
                                    Create
                                </Button> :
                                <Button
                                    size='large'
                                    color='primary_light'
                                    variant='contained'
                                    onClick={() => switchChain(config.EVENT_FACTORY_CHAIN_ID, provider)}>
                                    Switch Chain
                                </Button>
                            }

                        </section>
                    </>
                }

            </form>
        </div>
    )
}