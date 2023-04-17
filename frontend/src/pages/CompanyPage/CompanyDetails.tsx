import './CompanyDetails.scss'

import { FC } from "react"

import { CompanyAttributes } from "@/hooks"
import { CompanyContact } from "@/components"

import {
    MoreHoriz as MoreIcon,
    EmailOutlined as EmailIcon,
    PhoneOutlined as PhoneIcon,
    Telegram as TelegramIcon,
    Instagram as InstagramIcon,
    VisibilityOffOutlined as AddressIcon,
} from '@mui/icons-material'

interface Props {
    company: CompanyAttributes
}

const CompanyDetails: FC<Props> = ({ company }) => {
    return (
        <section className='company-details'>
            <CompanyContact
                label='e-mail'
                value={company.email as string}
                icon={<EmailIcon fontSize='large' />} />
            <CompanyContact
                label='phone'
                value={company.phone as string}
                icon={<PhoneIcon fontSize='large' />} />
            <CompanyContact
                label='telegram'
                value={company.telegram as string}
                icon={<TelegramIcon fontSize='large' />} />
            <CompanyContact
                label='instagram'
                value={company.instagram as string}
                icon={<InstagramIcon fontSize='large' />} />
            <CompanyContact
                label='owner address'
                value={company.owner as string}
                icon={<AddressIcon fontSize='large' />} />
        </section>
    )
}

export default CompanyDetails