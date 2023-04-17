import './CompanyForm.scss'

import { FC, FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { CompanyAttributes, useCompany } from '@/hooks'
import { ErrorHandler } from '@/helpers'
import { Notificator } from '@/common'

interface Props {
    closeModal: () => void
    pageReloader: () => void,
    owner: string
    companyInfo?: CompanyAttributes
}

const CreateCompanyForm: FC<Props> = ({ closeModal, owner, pageReloader, companyInfo }) => {
    const [name, setName] = useState(companyInfo?.name ?? '')
    const [desc, setDesc] = useState(companyInfo?.description ?? '')
    const [email, setEmail] = useState(companyInfo?.email ?? '')
    const [phone, setPhone] = useState(companyInfo?.phone ?? '')
    const [telegram, setTelegram] = useState(companyInfo?.telegram ?? '')
    const [instagram, setInstagram] = useState(companyInfo?.instagram ?? '')

    const { createCompany, updateCompany } = useCompany()

    const { id } = useParams()

    const submit = async (e: FormEvent) => {
        e.preventDefault()

        const requestPayload = {
            name,
            description: desc,
            email,
            telegram,
            instagram,
            phone,
            owner,
        }

        try {
            if (companyInfo) {
                await updateCompany(id as string, requestPayload)
            } else {
                await createCompany(requestPayload)
            }



            Notificator.success(companyInfo ? 'Company info updated' : 'Company created!')
            closeModal()
            pageReloader()
        } catch (error) {
            ErrorHandler.process(error)
        }

    }

    return (
        <form className='create-company' onSubmit={submit}>
            <h2 className='create-company__title '>
                {companyInfo ? 'Update company info' : 'Create company'}
            </h2>
            <TextField
                className='create-company__input'
                required
                variant='outlined' label='name'
                color='primary_light'
                value={name}
                onChange={e => { setName(e.target.value) }} />
            <TextField
                className='create-company__input'
                multiline
                maxRows={16}
                variant='outlined' label='decription'
                color='primary_light'
                value={desc}
                onChange={e => { setDesc(e.target.value) }} />
            <TextField
                className='create-company__input'
                required
                type='email'
                variant='outlined' label='email'
                color='primary_light'
                value={email}
                onChange={e => { setEmail(e.target.value) }} />
            <TextField
                className='create-company__input'
                required
                variant='outlined' label='phone'
                color='primary_light'
                value={phone}
                onChange={e => { setPhone(e.target.value) }} />
            <TextField
                className='create-company__input'
                variant='outlined' label='telegram'
                color='primary_light'
                value={telegram}
                onChange={e => { setTelegram(e.target.value) }} />
            <TextField
                className='create-company__input'
                variant='outlined' label='instagram'
                color='primary_light'
                value={instagram}
                onChange={e => { setInstagram(e.target.value) }} />
            <section className='create-company__actions'>
                <Button
                    variant='outlined'
                    type='reset'
                    size="large"
                    color="primary_light"
                    onClick={closeModal}
                >
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    type='submit'
                    size="large"
                    color="primary_light"
                >
                    {companyInfo ? 'Update' : 'Create'}
                </Button>
            </section>

        </form>
    )
}

export default CreateCompanyForm