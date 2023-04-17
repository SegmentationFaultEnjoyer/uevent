import { EventFactory__factory } from "@/types/contracts";
import { Event } from '@/types/contracts/EventContract'
import { useMemo } from "react";
import { useProviderInit } from "@/hooks";
import { handleEthError, sleep } from "@/helpers";
import { EthProviderRpcError } from "@/types";
import { TransactionReceipt } from "@ethersproject/providers";
import { ethers } from "ethers";
import { BN } from "@/utils";
import dayjs from "dayjs";

export type TicketData = {
    event_address: string
    price: string
    event_name: string
    event_symbol: string
    eventLocation: string
    time_end: dayjs.Dayjs
    time_start: dayjs.Dayjs
    isOfflineEvent: boolean
    company_name: string
    owner: string
}

export type TicketDataWithId = {
    tokenId: string
} & TicketData

export function useEventFactory(contractAddress: string) {
    const { provider } = useProviderInit()

    const contractInterface = EventFactory__factory.createInterface()

    const contractInstance = useMemo(() =>
        (provider
            && provider.currentProvider
            && contractAddress
            && EventFactory__factory.connect(contractAddress, provider.currentProvider))
        ||
        undefined, [provider.currentProvider, contractAddress]
    )

    const getEventsByAddress = async (userAddress: string) => {
        if (!contractInstance) return

        try {
            const data = await contractInstance.getEventsByAddress(userAddress)

            return data
        } catch (error) {
            handleEthError(error as EthProviderRpcError)
        }
    }

    const _formatTicket = (rawData: Event.DataStructOutput): TicketData => {
        return {
            event_address: rawData.event_address,
            price: new BN(rawData.price._hex).toString(),
            event_name: rawData.event_name,
            event_symbol: rawData.event_symbol,
            eventLocation: rawData.eventLocation,
            time_end: dayjs.unix(parseInt(new BN(rawData.time_end._hex).toString())),
            time_start: dayjs.unix(parseInt(new BN(rawData.time_start._hex).toString())),
            isOfflineEvent: rawData.isOfflineEvent,
            company_name: rawData.company_name,
            owner: rawData.owner,
        }
    }

    const getTicketsByAddress = async (userAddress: string) => {
        if (!contractInstance) return

        try {
            const data = await contractInstance.getTicketsByAddress(userAddress)

            const filteredData = data
                .filter(el => el.event_address !== ethers.constants.AddressZero)
                .map(el => _formatTicket(el))

            return filteredData
        } catch (error) {
            handleEthError(error as EthProviderRpcError)
        }
    }

    const deployEvent = async (
        pricePerTicket: string,
        timeStart: string,
        timeEnd: string,
        eventName: string,
        eventSymbol: string,
        companyName: string,
        eventLocation: string,
        isOfflineEvent: boolean,
        baseURI: string
    ) => {
        try {
            const data = contractInterface.encodeFunctionData('deployEvent', [
                pricePerTicket,
                timeStart,
                timeEnd,
                eventName,
                eventSymbol,
                companyName,
                eventLocation,
                isOfflineEvent,
                baseURI
            ])

            const receipt = await provider.signAndSendTx({
                to: contractAddress,
                data
            })

            await sleep(1000)
            return receipt as TransactionReceipt
        } catch (error) {
            handleEthError(error as EthProviderRpcError)
        }

    }

    return {
        deployEvent,
        getEventsByAddress,
        getTicketsByAddress,
    }
}