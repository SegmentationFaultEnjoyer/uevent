import { api } from "@/api"
import { ApiLinks } from "@/types"
import { Dispatch, SetStateAction, useState } from "react"
import { useDidUpdateEffect } from "@/helpers"

type PaginatableEntity = {
    links: ApiLinks
    data: unknown[]
    [key: string]: unknown
}

export function usePaginate<T extends PaginatableEntity>(
    data: T | undefined,
    setData: Dispatch<SetStateAction<T>>,
    firstPageLoader: (filters: Object) => Promise<T>,
    filters?: Object) {

    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [isLoadMoreShown, setIsLoadMoreShown] = useState(true)

    const init = async () => {
        const data = await firstPageLoader(filters ?? {})

        setData(data)
    }

    const loadMore = async () => {
        if (!data) return

        setIsLoadingMore(true)
        try {
            const { data: _data } = await api.get<PaginatableEntity>(data.links.next)

            if (!_data) return

            if (_data.data.length < 1) {
                setIsLoadMoreShown(false)
                return
            }

            setData(prev =>
                ({
                    data: prev?.data.concat(_data.data),
                    links: _data.links
                }) as T
            )
        } catch (error) {
            throw error
        }
        setIsLoadingMore(false)

    }

    const loadFirstPage = async () => {
        if (!data) return

        const { data: _data } = await api.get(data.links.first)

        setData(_data)
    }

    useDidUpdateEffect(() => {
        init()
    }, [filters])

    return {
        loadMore,
        loadFirstPage,
        isLoadingMore,
        isLoadMoreShown,
        init,
    }

}