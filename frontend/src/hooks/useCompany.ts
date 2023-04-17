import { api } from "@/api"
import { formatFiltersQuery } from "@/helpers"

export type CompanyAttributes = {
    name?: string
    description?: string
    email?: string
    phone?: string
    telegram?: string
    instagram?: string
    owner?: string
}

export type CompanyProps = {
    id: number
    type: string
    attributes: CompanyAttributes
}

export type CompanyResponse = {
    data: CompanyProps
}

export type CompaniesListResponse = {
    data: Array<CompanyProps>
}

export function useCompany() {
    const getCompaniesList = async (opts?: Omit<CompanyAttributes, 'description'>) => {
        const filters = formatFiltersQuery(opts)

        const { data } = await api.get<CompaniesListResponse>(`/companies`, {
            params: filters
        })

        return data
    }

    const getCompany = async (id: string) => {
        const { data } = await api.get<CompanyResponse>(`/companies/${id}`)

        return data
    }

    const createCompany = async (opts: CompanyAttributes) => {
        await api.post('/companies', {
            data: {
                attributes: {
                    name: opts.name,
                    description: opts.description,
                    email: opts.email,
                    phone: opts.phone,
                    telegram: opts.telegram,
                    instagram: opts.instagram,
                    user_address: opts.owner,
                }
            }
        })
    }

    const updateCompany = async (id: string, opts: CompanyAttributes) => {
        await api.patch(`/companies/${id}`, {
            data: {
                attributes: {
                    name: opts.name,
                    description: opts.description,
                    email: opts.email,
                    phone: opts.phone,
                    telegram: opts.telegram,
                    instagram: opts.instagram,
                }
            }
        })
    }

    return {
        getCompaniesList,
        getCompany,
        createCompany,
        updateCompany,
    }

}