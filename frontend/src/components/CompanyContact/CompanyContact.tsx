import './CompanyContact.scss'

import { FC, ReactNode } from 'react'

interface Props {
    icon: ReactNode
    label: string
    value: string
}

const CompanyContact: FC<Props> = ({ icon, label, value }) => {

    return (
        <div className='company-contact'>
            {icon}
            <div className='company-contact__details'>
                <p>
                    {label}
                </p>
                <p>
                    {value}
                </p>
            </div>
        </div>
    )
}

export default CompanyContact