import { EventContract__factory } from "@/types/contracts";
import { useMemo } from "react";
import { useProviderInit } from "@/hooks";
import { handleEthError } from "@/helpers";
import { EthProviderRpcError } from "@/types";

export function useEventContract(contractAddress: string) {
    const { provider } = useProviderInit()

    const contractInterface = EventContract__factory.createInterface()

    const contractInstance = useMemo(() =>
        (provider
            && provider.currentSigner
            && contractAddress
            && EventContract__factory.connect(contractAddress, provider.currentSigner))
        ||
        undefined, [provider.currentProvider, contractAddress]
    )

    const mintTicket = async (
        payerAdders: string,
        discount: string,
        tokenURI: string,
        value?: string
    ) => {
        if (!contractInstance) return

        try {
            const tx = await contractInstance.mintTicket(
                payerAdders,
                discount,
                tokenURI,
                ...(value ? [{ value }] : [])
            )

            const receipt = await tx.wait()
            return receipt
        } catch (error) {
            handleEthError(error as EthProviderRpcError)
        }

    }

    const getTokenIdsByAddress = async (address: string) => {
        if (!contractInstance) return

        try {
            const data = await contractInstance.getTicketsIdOfOwner(address)

            return data
        } catch (error) {
            handleEthError(error as EthProviderRpcError)
        }
    }

    return {
        mintTicket,
        getTokenIdsByAddress,
        contractInstance,
    }
}