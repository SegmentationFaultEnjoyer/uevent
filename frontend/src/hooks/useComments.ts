import { api } from "@/api";
import { formatFiltersQuery, formatPageQuery } from "@/helpers";
import { ApiLinks, QueryParams } from "@/types";

export type CommentAttributes = {
    comment: string
    publishDate: string
}

export type CommentProps = {
    id: number
    type: string
    attributes: CommentAttributes
    relationships: CommentsRelationships
}

export type CommentsRelationships = {
    user: {
        data: {
            type: 'users',
            address: string
        }
    },
    company: {
        data: {
            type: 'companies',
            id: string,
            name: string
        }
    }
}

export type CommentResponse = {
    data: CommentProps
}

export type CommentsListResponse = {
    data: Array<CommentProps>
    links: ApiLinks
}

export function useComments() {
    const createComment = async (opts: Pick<CommentAttributes, 'comment'> & {
        user_address?: string
        company_id?: string
        event_id: string
    }) => {
        await api.post(`/events/${opts.event_id}/comments`, {
            data: {
                attributes: {
                    ...(opts.user_address ? { user_address: opts.user_address } : {}),
                    ...(opts.company_id ? { company_id: opts.company_id } : {}),
                    comment: opts.comment,
                }
            }
        })
    }

    const getCommentsList = async (opts: {
        publish_date?: string
        user_address?: string
        company_id?: string
        event_id: string
    }, query?: QueryParams) => {
        let filters = formatFiltersQuery(opts)

        if (query) filters = Object.assign(filters, formatPageQuery(query))

        const { data } = await api.get<CommentsListResponse>(`/comments`, {
            params: filters
        })

        return data
    }

    return {
        createComment,
        getCommentsList,
    }
}