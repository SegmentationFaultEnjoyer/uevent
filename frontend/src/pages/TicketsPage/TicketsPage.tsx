import './TicketsPage.scss'

import { useMemo, useState } from 'react'
import { TicketData, TicketDataWithId, useEventFactory, useProviderInit } from '@/hooks'
import { config } from '@/config'
import { ErrorHandler, useDidUpdateEffect } from '@/helpers'
import { TicketCard } from '@/components'
import { TriangleLoader } from '@/common'
import { EventContract__factory } from '@/types/contracts'
import { BN } from '@/utils'

export default function TicketsPage() {
    const { getTicketsByAddress } = useEventFactory(config.EVENT_FACTORY_ADDRESS)
    const { provider } = useProviderInit()

    const [ticketList, setTicketList] = useState<TicketDataWithId[]>()
    const [isLoading, setIsLoading] = useState(false)

    useDidUpdateEffect(() => {
        if (!provider.selectedAddress) return

        const initPage = async () => {
            if (!provider.currentProvider) return
            setIsLoading(true)
            try {
                const rawData = await getTicketsByAddress(provider.selectedAddress)
                if (!rawData) return

                const tickets: TicketDataWithId[] = []

                for (const el of rawData) {
                    const eventContract = EventContract__factory.connect(el.event_address, provider.currentProvider)
                    const tokenIdsRaw = await eventContract.getTicketsIdOfOwner(provider.selectedAddress)
                    const tokenIds = tokenIdsRaw.map(el => new BN(el._hex).toString())

                    for (const id of tokenIds) {
                        tickets.push({
                            ...el,
                            tokenId: id,
                        })
                    }
                }

                setTicketList(tickets)

            } catch (error) {
                ErrorHandler.processWithoutFeedback(error)
            }
            setIsLoading(false)
        }

        initPage()
    }, [provider.selectedAddress])

    const isProviderConnected = useMemo(() => Boolean(provider.selectedAddress), [provider])

    return (
        <div className='tickets-page'>
            <h1>Your tickets</h1>
            {isProviderConnected ?
                <>
                    {isLoading ? <div className='tickets-page__loader'>
                        <TriangleLoader />
                    </div> :
                        <section className='tickets-page__items'>
                            {ticketList ? ticketList.map((ticket, idx) => <TicketCard ticket={ticket} key={idx} />) :
                                <h3 className='tickets-page__empty'>No tickets found </h3>
                            }
                        </section>
                    }
                </> : <h3 className='tickets-page__empty'>Please connect metamask to see your tickets </h3>
            }


        </div>
    )
}