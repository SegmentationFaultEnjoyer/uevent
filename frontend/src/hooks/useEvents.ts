import { api } from "@/api"
import { ErrorHandler, formatFiltersQuery, formatPageQuery } from "@/helpers"
import { ApiLinks, QueryParams } from "@/types"
import { CompanyProps } from "./useCompany"

export type EventAttributes = {
    title?: string
    description?: string
    start_date?: string
    end_date?: string
    price?: string
    banner_hash?: string
    company_id?: string
    contract_address?: string
    is_offline?: boolean
    location?: string
    category?: string
}

export type EventRelationsShips = {
    company: {
        data: CompanyProps
    }
}

export type EventProps = {
    id: number
    type: string
    attributes: EventAttributes
    relationships: EventRelationsShips
}

export type EventResponse = {
    data: EventProps
}

export type EventsListResponse = {
    data: Array<EventProps>
    links: ApiLinks
}

export type BannerGenerateResponse = {
    data: {
        attributes: {
            b64_json: string
        }
    }
}

export function useEvents() {
    const createEvent = async (opts: EventAttributes) => {
        await api.post('/events', {
            data: {
                attributes: opts,
            }
        })

    }

    const generateEventBanner = async (prompt: string) => {
        const { data } = await api.get<BannerGenerateResponse>('/events/banner?prompt=' + prompt)

        return data.data.attributes

    }
    const getEvent = async (id: string) => {
        try {
            const { data } = await api.get<EventResponse>(`/events/${id}`)

            return data
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    const getEventsList = async (
        opts?: Pick<EventAttributes, 'title' | 'start_date' | 'price' | 'company_id' | 'category'>
            & { category_id?: number },
        query?: QueryParams
    ) => {
        let filters = formatFiltersQuery(opts)

        if (query) filters = Object.assign(filters, formatPageQuery(query))

        const { data } = await api.get<EventsListResponse>(`/events`, {
            params: filters
        })

        return data
    }

    const getEventsCategories = async () => {
        const { data } = await api.get<{
            data: Array<{
                category: string
            }>
        }>('/events/categories')

        return data.data.map(el => el.category)
    }

    return {
        createEvent,
        getEventsList,
        generateEventBanner,
        getEvent,
        getEventsCategories,
    }
}