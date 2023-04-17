import { Erc721__factory } from "@/types/contracts";
import { useMemo } from "react";
import { useProviderInit } from "@/hooks";
import { handleEthError } from "@/helpers";
import { EthProviderRpcError } from "@/types";
import { useState } from "react";


export function useErc721(_contractAddress?: string) {
    const { provider } = useProviderInit()

    const [contractAddress, setContractAddress] = useState(_contractAddress)

    const contractInterface = Erc721__factory.createInterface()

    const contractInstance = useMemo(() =>
        (provider
            && provider.currentProvider
            && contractAddress
            && Erc721__factory.connect(contractAddress, provider.currentProvider))
        ||
        undefined, [provider.currentProvider, contractAddress]
    )

    const init = (address: string) => {
        setContractAddress(address)
    }

    async function listTokensOfOwner(account: string) {
        if (!contractInstance) return

        const sentLogs = await contractInstance.queryFilter(
            contractInstance.filters.Transfer(account, null),
        );
        const receivedLogs = await contractInstance.queryFilter(
            contractInstance.filters.Transfer(null, account),
        );

        const logs = sentLogs.concat(receivedLogs)
            .sort(
                (a, b) =>
                    a.blockNumber - b.blockNumber ||
                    a.transactionIndex - b.transactionIndex,
            );

        const owned = new Set();

        for (const log of logs) {
            const { from, to, tokenId } = log.args;

            if (to === account) {
                owned.add(tokenId.toString());
            } else if (from === account) {
                owned.delete(tokenId.toString());
            }
        }

        return Array.from(owned)
    };

    const getBalanceOf = async (address: string) => {
        if (!contractInstance) return

        try {
            return contractInstance.balanceOf(address)
        } catch (error) {
            handleEthError(error as EthProviderRpcError)
        }
    }

    const tokenURI = async (tokenId: number) => {
        if (!contractInstance) return

        try {
            return contractInstance.tokenURI(tokenId)
        } catch (error) {
            handleEthError(error as EthProviderRpcError)
        }
    }

    return {
        getBalanceOf,
        tokenURI,
        contractInstance,
        contractAddress,
        listTokensOfOwner,
        init,
    }
}