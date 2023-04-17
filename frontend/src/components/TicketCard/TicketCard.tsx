import './TicketCard.scss'

import { FC, useEffect, useState } from 'react'
import { cropAddress, formatFiatAssetFromWei } from '@/helpers'
import { useErc721, TicketDataWithId } from '@/hooks'
import { BN } from '@/utils'

type MetaData = {
    name: string
    image: string
    description: string
    properties: {
        contractAddress: string
    }
    tokenId: number
}

interface Props {
    ticket: TicketDataWithId
}

const TicketCard: FC<Props> = ({ ticket }) => {
    const { getBalanceOf, tokenURI, contractInstance } = useErc721(ticket.event_address)

    const [metadata, setMetadata] = useState<MetaData>()

    useEffect(() => {
        const init = async () => {
            const URI = await tokenURI(Number(ticket.tokenId))

            if (!URI) return

            const metadata = await fetch(URI)
            const json: MetaData = await metadata.json()

            setMetadata({
                ...json,
            })
        }

        init()
    }, [contractInstance])

    const getLink = (address: string, tokenId: string) => {
        return `https://testnets.opensea.io/assets/mumbai/${address}/${tokenId}`
    }

    return (
        <div className='ticket-card'>
            {metadata &&
                <>
                    <img className='ticket-card__image' src={metadata.image} alt={metadata.name} />
                    <h1>{`#${ticket.tokenId}`}</h1>
                    <div className='ticket-card__info ticket-card__info--aligned'>
                        <p >Link to NFT: </p>
                        <h3 className='ticket-card__address' onClick={() => {
                            window.open(getLink(metadata.properties.contractAddress, ticket.tokenId), '_blank')
                        }}>
                            {cropAddress(metadata.properties.contractAddress)}
                        </h3>
                    </div>

                    <div className='ticket-card__info'>
                        <p className='ticket-card__label'>Description:</p>
                        <p className='ticket-card__value'>{metadata.description}</p>
                    </div>
                </>
            }
            <section className='ticket-card__info-wrapper'>
                <div className='ticket-card__info'>
                    <p className='ticket-card__label'>Company:</p>
                    <p className='ticket-card__value'>{ticket.company_name}</p>
                </div>
                <div className='ticket-card__info'>
                    <p className='ticket-card__label'>Event name:</p>
                    <p className='ticket-card__value'>{ticket.event_name}</p>
                </div>
                <div className='ticket-card__info'>
                    <p className='ticket-card__label'>Event location:</p>
                    <p className='ticket-card__value'>{ticket.eventLocation}</p>
                </div>
                <div className='ticket-card__info'>
                    <p className='ticket-card__label'>Starts:</p>
                    <p className='ticket-card__value'>{ticket.time_start.format('DD.MM.YYYY HH:mm')}</p>
                </div>
                <div className='ticket-card__info'>
                    <p className='ticket-card__label'>Ends:</p>
                    <p className='ticket-card__value'>{ticket.time_end.format('DD.MM.YYYY HH:mm')}</p>
                </div>
                <div className='ticket-card__info'>
                    <p className='ticket-card__label'>Price:</p>
                    <p className='ticket-card__value'>{formatFiatAssetFromWei(ticket.price, 'USD')}</p>
                </div>
            </section>
        </div>
    )
}

export default TicketCard