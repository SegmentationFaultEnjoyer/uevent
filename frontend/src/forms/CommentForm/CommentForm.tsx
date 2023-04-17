import './CommentForm.scss'

import { FC, FormEvent, useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { TextField, Button, Checkbox } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import { ErrorHandler } from '@/helpers'
import { Collapse } from '@/common'
import { CompanyProps, useComments, useCompany } from '@/hooks'
import { SingleSelect } from '@/fields'


interface Props {
    userAddress: string
    pageReloader?: () => void
}

const CommentForm: FC<Props> = ({ pageReloader, userAddress }) => {
    const [comment, setComment] = useState('')
    const [fromCompanyName, setFromCompanyName] = useState(false)

    const [company, setCompany] = useState('')
    const [userCompanyList, setUserCompanyList] = useState<CompanyProps[]>([])

    const { createComment } = useComments()
    const { getCompaniesList } = useCompany()

    const { event_id } = useParams()

    const companyChoices = useMemo(
        () => userCompanyList.map(el => el.attributes.name),
        [userCompanyList]
    )

    useEffect(() => {
        const loadUserCompanies = async () => {
            const { data } = await getCompaniesList({
                owner: userAddress,
            })

            setUserCompanyList(data)
        }

        loadUserCompanies()
    }, [])

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            let companyId = undefined as string | undefined

            if (userCompanyList) {
                const pickedCompany = userCompanyList.find(el => el.attributes.name === company)

                if (pickedCompany) companyId = pickedCompany.id.toString()
            }

            await createComment({
                event_id: event_id as string,
                comment,
                ...(!fromCompanyName ? { user_address: userAddress } : { company_id: companyId })
            })


            if (pageReloader) pageReloader()
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    return (
        <form className='comment-form' onSubmit={submit}>
            <div className='comment-form__wrapper'>
                <TextField
                    className='comment-form__input'
                    required
                    multiline
                    variant='filled' label='Leave a comment'
                    color='primary_light'
                    value={comment}
                    onChange={e => { setComment(e.target.value) }} />
                <div className='comment-form__company'>
                    <Checkbox
                        color='primary_light'
                        value={fromCompanyName}
                        onChange={(e) => { setFromCompanyName(e.target.checked) }}
                    />
                    <label >leave from company name</label>
                    <Collapse isOpen={fromCompanyName}>
                        <SingleSelect
                            variant='standard'
                            size='medium'
                            value={company}
                            setValue={setCompany}
                            label='Companies'
                            choices={companyChoices as string[]} />
                    </Collapse>
                </div>
                <Button
                    className='comment-form__submit-btn'
                    variant='contained'
                    type='submit'
                    size="large"
                    endIcon={<SendIcon />}
                    color="primary_light">
                    Send
                </Button>

            </div>

        </form>
    )
}

export default CommentForm