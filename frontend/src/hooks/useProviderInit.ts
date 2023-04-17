import { PROVIDERS } from "@/enums"
import { useAppSelector } from "@/store"
import { DesignatedProvider } from "@/types"
import { Dispatch, SetStateAction, useCallback, useEffect } from "react"
import { useProvider } from "@/hooks"
import { useLocation } from "react-use"
import { ErrorHandler } from "@/helpers"


/**
 * Initializes the provider and sets the provider state
 * @param setInitializedState - The state setter for the initialization status
 * @returns Returns an object containing the provider instance and connect method
 * that handles redirect in case of missing provider
 */
export function useProviderInit(setInitializedState?: Dispatch<SetStateAction<boolean>>) {
    const web3Providers: DesignatedProvider[] = useAppSelector(
        state => state.web3ProvidersSlice.providers,
    )

    const provider = useProvider()
    const location = useLocation()

    const redirect = () => {
        try {
            const METAMASK_APP_CONNECT_URL = `https://metamask.app.link/dapp/${window.location.host}${location.pathname}`

            window.open(METAMASK_APP_CONNECT_URL)
        } catch (error) {
            window.location.reload()
        }
    }

    const connect = async () => {
        try {
            if (!provider.currentProvider) {
                redirect()
                return
            }
            await provider.connect()
        } catch (error) {
            ErrorHandler.processWithoutFeedback(error)
        }
    }

    const initProvider = useCallback(async () => {
        if (!web3Providers.length) return

        const metamaskBrowserProvider = web3Providers.find(
            el => el.name === PROVIDERS.metamask,
        )

        if (!metamaskBrowserProvider) {
            return
        }

        await provider.init(metamaskBrowserProvider)
    }, [web3Providers])

    useEffect(() => {
        if (!web3Providers.length) return

        initProvider()

    }, [web3Providers])

    // wait until provider is initialized
    useEffect(() => {
        if (!provider.chainId) return

        if (setInitializedState) setInitializedState(true)

    }, [provider.selectedAddress])

    return {
        provider,
        connect,
    }
}