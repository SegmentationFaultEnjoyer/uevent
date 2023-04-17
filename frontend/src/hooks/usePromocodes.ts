import { api } from "@/api";
import { formatFiltersQuery, formatPageQuery } from "@/helpers";
import { ApiLinks, QueryParams } from "@/types";

export type PromocodeAttributes = {
    code: string
    discount: number
    expire_date: string
    initial_usages: number
    usages: number
    is_active: boolean
    company_id: string
}

export type PromocodeProps = {
    id: number
    type: string
    attributes: PromocodeAttributes
    relationships: PromocodeRelationships
}

export type PromocodeRelationships = {
    company: {
        data: {
            type: "companies"
            id: number
        }
    }
    event: {
        data: {
            type: "events",
            id: number,
        },
    }
}

export type PromocodeResponse = {
    data: PromocodeProps
}

export type PromocodesListResponse = {
    data: Array<PromocodeProps>
    links: ApiLinks
}

export function usePromocodes() {
    const createPromocode = async (
        opts: Pick<PromocodeAttributes, 'discount' | 'expire_date' | 'initial_usages' | 'company_id'>) => {
        await api.post(`/promocodes`, {
            data: {
                attributes: opts
            }
        })
    }

    const getPromocodesList = async (
        opts?: Partial<PromocodeAttributes> & {
            company_id?: string
        },
        query?: QueryParams) => {
        let filters = formatFiltersQuery(opts)

        if (query) filters = Object.assign(filters, formatPageQuery(query))

        const { data } = await api.get<PromocodesListResponse>('/promocodes', {
            params: filters
        })

        return data
    }

    const deletePromocode = async (id: string) => {
        await api.delete(`/promocodes/${id}`)
    }

    const validatePromocode = async (promocode: string) => {
        const { data } = await api.get<PromocodeResponse>(`/promocodes/${promocode}/validate`)

        return data
    }

    return {
        createPromocode,
        getPromocodesList,
        deletePromocode,
        validatePromocode,
    }
}