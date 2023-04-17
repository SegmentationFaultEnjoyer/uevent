import './CompanyCard.scss'

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyProps } from '@/hooks'
import { ROUTES } from '@/enums'
import { cropAddress } from '@/helpers'

interface Props {
    company: CompanyProps
}

const CompanyCard: FC<Props> = ({ company }) => {
    const navigate = useNavigate()

    return (
        <div
            className='company-card'
            onClick={() => {
                navigate(`${ROUTES.company}/${company.id}`)
            }}>
            <h3 className='company-card__title'>
                {company.attributes.name}
            </h3>
            <div className='company-card__main'>
                <p className='company-card__description'>
                    {company.attributes.description}
                </p>
                <section className='company-card__details'>
                    <div className='company-card__details-item'>
                        <span>owned by</span>
                        <span>{cropAddress(company.attributes.owner!)}</span>
                    </div>
                    <div className='company-card__details-item'>
                        <span>email</span>
                        <span>{company.attributes.email}</span>
                    </div>
                    <div className='company-card__details-item'>
                        <span>your role</span>
                        <span>{'owner'}</span>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default CompanyCard