import './Map.scss'

import { FC, useState, Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { TextField } from '@mui/material'

import { useMap } from '@/hooks'
import { useDidUpdateEffect } from '@/helpers'

type MarkerType = {
    position: {
        lat: number
        lng: number
    }
    label: {
        color: string
        text: string
    }
}

interface Props {
    marker: MarkerType
    setMarker: Dispatch<SetStateAction<MarkerType>>
}

const Map: FC<Props> = ({ marker, setMarker }) => {
    const { isLoaded, getAddressFromCoords, getCoordsFromAddress, setSearchAutoComplete } = useMap()

    const [location, setLocation] = useState('')
    const inputRef = useRef<HTMLInputElement>()

    const containerStyle = {
        width: "100%",
        height: "400px",
        borderRadius: '12px',
        border: '1px solid var(--tertiary-dark)'
    }

    const [center, setCenter] = useState({
        lat: 49.843366,
        lng: 24.024905,
    })

    const updateMarker = (lat: number, lng: number) => {
        setMarker(prev => ({
            position: {
                lat,
                lng,
            },
            label: prev.label
        }))
        setCenter({
            lat,
            lng,
        })
    }

    const mapClicked = (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return

        updateMarker(event.latLng.lat(), event.latLng.lng())
        locateAddress(event.latLng.lat(), event.latLng.lng())

    }

    const locateAddress = async (lat?: number, lng?: number) => {
        if (!isLoaded) return

        const LAT = lat ?? marker.position.lat
        const LNG = lng ?? marker.position.lng

        const address = await getAddressFromCoords(LAT, LNG)

        if (!address) return

        setLocation(address)
    }

    useDidUpdateEffect(() => {
        if (!isLoaded) return

        const getCoords = async () => {
            const res = await getCoordsFromAddress(location)

            if (!res) return

            updateMarker(res.lat, res.lng)

        }

        getCoords()

    }, [location])


    useDidUpdateEffect(() => {
        if (!isLoaded) return

        if (!inputRef.current) return

        setSearchAutoComplete(inputRef.current, setLocation)
        locateAddress()
    }, [isLoaded])


    return (
        <div className='map'>
            {isLoaded &&
                <>
                    <TextField
                        inputRef={inputRef}
                        variant='filled'
                        label='Event location'
                        color='secondary_main'
                        placeholder='Enter the address or pick on the map'
                        value={location}
                        onChange={e => { setLocation(e.target.value) }}
                    />
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={15}
                        onClick={mapClicked}>
                        <Marker position={marker.position} label={marker.label} draggable={false} />
                    </GoogleMap>
                </>

            }

        </div>

    )
}

export default Map