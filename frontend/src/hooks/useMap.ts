import { useLoadScript } from '@react-google-maps/api'
import { config } from '@/config';
import { Dispatch, SetStateAction } from 'react';
import { useEffectOnce } from 'react-use';

type Coords = {
    lat: number
    lng: number
}

export function useMap() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: config.GOOGLE_API_KEY,
        libraries: ['places'],
    })

    const getAddressFromCoordsRaw = (lat: number, lng: number): Promise<google.maps.GeocoderResult> | null => {
        if (!isLoaded) return null

        const geocoder = new window.google.maps.Geocoder();
        const latlng = new window.google.maps.LatLng(lat, lng);

        const request: google.maps.GeocoderRequest = {
            location: latlng
        }

        return new Promise((resolve, reject) => {
            geocoder.geocode(request, results =>
                results?.length ? resolve(results[0]) : reject(null)
            );
        })
    }

    const getAddressFromCoords = (lat: number, lng: number): Promise<string> | null => {
        if (!isLoaded) return null

        const geocoder = new window.google.maps.Geocoder();
        const latlng = new window.google.maps.LatLng(lat, lng);

        const request: google.maps.GeocoderRequest = {
            location: latlng
        }

        return new Promise((resolve, reject) => {
            geocoder.geocode(request, results =>
                results?.length ? resolve(results[0].formatted_address) : reject(null)
            );
        })
    }

    const getCoordsFromAddress = (address: string): Promise<Coords> | null => {
        if (!isLoaded) return null

        const geocoder = new window.google.maps.Geocoder();
        const request: google.maps.GeocoderRequest = {
            address,
        }

        return new Promise((resolve, reject) => {
            geocoder.geocode(request, results =>
                results?.length ? resolve({
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                }) : reject(null))
        })
    }

    const setSearchAutoComplete = (el: HTMLInputElement, stateSetter: Dispatch<SetStateAction<string>>) => {
        if (!isLoaded) return

        const settings: google.maps.places.AutocompleteOptions = {
            types: ['address'],
        }

        const autocompleter = new window.google.maps.places.Autocomplete(el)

        autocompleter.addListener('place_changed', () => {
            const place = autocompleter.getPlace()

            if (!place.formatted_address) return


            stateSetter(place.formatted_address)
            el.blur()

        })
    }

    return {
        isLoaded,
        loadError,
        getAddressFromCoords,
        getAddressFromCoordsRaw,
        getCoordsFromAddress,
        setSearchAutoComplete,
    }
}