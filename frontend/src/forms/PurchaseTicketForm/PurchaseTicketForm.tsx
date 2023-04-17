import './PurchaseTicketForm.scss'

import { ChangeEvent, FC, FormEvent, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BN } from '@/utils'
import { DotsLoader, Notificator } from '@/common'
import { PromocodeInfoCard } from '@/components'

import { TextField, Button } from '@mui/material'

import { useProviderInit, useEventContract, useIpfsUpload, usePromocodes, PromocodeProps, EventAttributes } from '@/hooks'
import { ErrorHandler, formatFiatAsset, formatIPFSLink, switchChain } from '@/helpers'
import { ROUTES } from '@/enums'
import { debounce } from 'lodash-es'
import { config } from '@/config'

interface Props {
    closeModal?: () => void
    eventInfo: EventAttributes
}

const TOKEN_AMOUNT_COEFFICIENT = 1.05

const PurchaseTicketForm: FC<Props> = ({ closeModal, eventInfo }) => {
    const { provider } = useProviderInit()
    const { mintTicket } = useEventContract(eventInfo.contract_address as string)
    const { validatePromocode } = usePromocodes()
    const { uploadMetaData } = useIpfsUpload()

    const navigate = useNavigate()

    const [promocode, setPromocode] = useState('')
    const [isMinting, setIsMinting] = useState(false)
    const [isPromocodeInvalid, setIsPromocodeInvalid] = useState(false)
    const [promocodeInfo, setPromocodeInfo] = useState<PromocodeProps>()
    const [priceToPay, setPriceToPay] = useState(Number(eventInfo.price))

    const onPromocodeInput = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!e.target.value) return

        setPriceToPay(Number(eventInfo.price))
        try {
            setIsPromocodeInvalid(false)
            const { data } = await validatePromocode(e.target.value)

            setPromocodeInfo(data)

            setPriceToPay(prev => Number(prev) * (1 - Number(data.attributes.discount) / 100))

        } catch (error) {
            ErrorHandler.processWithoutFeedback(error)
            setPromocodeInfo(undefined)
            setIsPromocodeInvalid(true)

        }
    }

    const isValidChain = useMemo(
        () => Number(config.EVENT_FACTORY_CHAIN_ID) === Number(provider.chainId),
        [provider.chainId]
    )

    const promocodeInputHandler = debounce(onPromocodeInput, 300)

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!provider.selectedAddress || isPromocodeInvalid) return

        setIsMinting(true)

        try {
            const discount = promocodeInfo ?
                new BN(promocodeInfo.attributes.discount, { decimals: 25 }).mul(10000000).toWei().toString()
                : '0'

            const nativeTokenAmount = new BN(eventInfo.price as string)
                .toWei()
                .toString()

            const metadataHash = await uploadMetaData({
                name: eventInfo.title!,
                description: eventInfo.description!,
                image: formatIPFSLink(eventInfo.banner_hash!),
                properties: {
                    contractAddress: eventInfo.contract_address!
                },
            })


            await mintTicket(provider.selectedAddress, discount, metadataHash, nativeTokenAmount)

            Notificator.success('Ticket purchased!')

            if (closeModal) closeModal()

            navigate(ROUTES.tickets)

        } catch (error) {
            ErrorHandler.process(error)
        }

        setIsMinting(false)
    }

    return (
        <form className='purchase-ticket-form' onSubmit={submit}>
            <h1 className='purchase-ticket-form__title'>Buy ticket</h1>
            <p>Amount to pay:  {priceToPay}</p>
            {isMinting ?
                <div className='purchase-ticket-form__loader'>
                    <DotsLoader />
                </div> :
                <>
                    {
                        isValidChain ?
                            <>
                                {Number(eventInfo.price) > 0 &&
                                    <TextField
                                        label='Promocode'
                                        color='primary_light'
                                        value={promocode}
                                        onChange={(e) => {
                                            setPromocode(e.target.value)
                                            promocodeInputHandler(e)
                                        }}
                                    />
                                }

                                {
                                    (promocodeInfo || isPromocodeInvalid) &&
                                    <PromocodeInfoCard
                                        scheme={isPromocodeInvalid ? 'invalid' : 'valid'}
                                        percent={promocodeInfo ? (promocodeInfo as PromocodeProps).attributes.discount : 0} />
                                }

                                <section className='purchase-ticket-form__actions'>
                                    <Button
                                        variant='outlined'
                                        color='primary_light'
                                        onClick={() => {
                                            if (closeModal) closeModal()
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        color='primary_light'
                                    >
                                        Submit
                                    </Button>
                                </section>
                            </> :
                            <div className='purchase-ticket-form__wrong-chain'>
                                <h3>Invalid chain. Please switch network.</h3>
                                <section className='purchase-ticket-form__actions'>
                                    <Button
                                        variant='outlined'
                                        color='primary_light'
                                        onClick={() => {
                                            if (closeModal) closeModal()
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant='contained'
                                        color='primary_light'
                                        onClick={() => switchChain(config.EVENT_FACTORY_CHAIN_ID, provider)}
                                    >
                                        Switch chain
                                    </Button>
                                </section>
                            </div>
                    }


                </>
            }

        </form>
    )
}

export default PurchaseTicketForm