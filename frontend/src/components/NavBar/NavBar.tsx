import './NavBar.scss';

import {
    Wallet as WalletIcon,
} from '@mui/icons-material'

import { io } from "socket.io-client";
import { FC, useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use'
import { useNavigate } from 'react-router-dom';

import { ErrorHandler, useDidUpdateEffect, cropAddress } from '@/helpers';
import { DotsLoader } from '@/common';

import { Button } from '@mui/material'

import { useAppDispatch, updateProviders } from '@/store'
import { useWeb3, useProviderInit } from '@/hooks';
import { ROUTES } from '@/enums';


const NavBar: FC = () => {
    // useEffect(() => {
    //     const socket = io('http://localhost:8088', {
    //         auth: {
    //             id: userID
    //         }
    //     });

    //     socket.on("connect", async () => {
    //         console.log('socket connection established', userID);
    //     })

    //     socket.on("notification", async (data) => {
    //         Notificator.info(data)
    //     })

    // }, [userID])
    const [isProviderInitialized, setIsProviderInitialized] = useState(false)
    const navigate = useNavigate()

    const dispatch = useAppDispatch()
    const { provider, connect } = useProviderInit(setIsProviderInitialized)
    const web3 = useWeb3()

    const initWeb3Providers = useCallback(async () => {
        try {
            await web3.init()
        } catch (error) {
            ErrorHandler.process(error)
        }
    }, [web3])


    useEffectOnce(() => {
        initWeb3Providers()
    })

    setTimeout(() => {
        setIsProviderInitialized(true)
    }, 2500)

    useDidUpdateEffect(() => {
        dispatch(updateProviders(web3.providers))
    }, [dispatch, web3.providers])

    return (
        <nav className='nav-bar'>
            <div className='nav-bar__header' onClick={() => navigate(ROUTES.main)}>
                <h2 className='nav-bar__logo' >UEVENT</h2>
            </div>
            <section className='nav-bar__actions'>
                {!isProviderInitialized ? <DotsLoader /> :
                    <div className='nav-bar__icon' >
                        {
                            provider?.selectedAddress ?
                                <p className='nav-bar__address'>{cropAddress(provider.selectedAddress)}</p> :
                                <Button
                                    color='secondary_main'
                                    size='large'
                                    variant='outlined'
                                    endIcon={<WalletIcon />}
                                    onClick={connect}>
                                    Connect to Metamask
                                </Button>
                        }

                    </div>
                }

            </section>
        </nav>

    )
}

export default NavBar