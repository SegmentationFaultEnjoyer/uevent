import './CompaniesPage.scss'

import { TriangleLoader, Modal } from '@/common'
import { CompanyCard } from '@/components'
import { Button } from '@mui/material'
import { AddBusiness as AddCompanyIcon } from '@mui/icons-material'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyProps, useCompany, useProviderInit } from '@/hooks'
import { ErrorHandler, useDidUpdateEffect } from '@/helpers'
import { CompanyForm } from '@/forms'
import { ROUTES } from '@/enums'

export default function CompaniesPage() {
    const [isProviderInitialized, setIsProviderInitialized] = useState(false)
    const [isCreateModalShown, setIsCreateModalShown] = useState(false)
    const [companies, setCompanies] = useState<CompanyProps[]>()
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    const { getCompaniesList } = useCompany()
    const { provider } = useProviderInit(setIsProviderInitialized)

    const loadPage = async () => {
        setIsLoading(true)
        try {
            const { data } = await getCompaniesList({
                owner: provider.selectedAddress,
            })

            setCompanies(data)
        } catch (error) {
            ErrorHandler.process(error)
        }
        setIsLoading(false)
    }

    useDidUpdateEffect(() => {
        loadPage()
    }, [provider.selectedAddress])

    return (
        <div className="companies-page">
            {!isProviderInitialized || isLoading ? <TriangleLoader /> :
                <>
                    {!provider.selectedAddress ?
                        <div className='companies-page__metamask'>
                            <h2>You have to connect to Metamask to interact with companies</h2>
                        </div>

                        :
                        <>
                            {!companies?.length &&
                                <section className='companies-page__not-found'>
                                    <h1 className="companies-page__title">No companies found</h1>
                                    <h2>Would like to create one?</h2>
                                </section>}

                            <Button
                                variant='outlined'
                                color='primary_main'
                                endIcon={<AddCompanyIcon />}
                                onClick={() => { setIsCreateModalShown(true) }}>
                                Create Company
                            </Button>

                            {companies && companies?.length > 0 &&
                                (
                                    <section className='companies-page__companies'>
                                        {companies.map(company =>
                                            <CompanyCard company={company} key={company.id} />)}
                                    </section>
                                )}

                            <Modal
                                setIsShown={setIsCreateModalShown}
                                isShown={isCreateModalShown}>
                                <CompanyForm
                                    closeModal={() => { setIsCreateModalShown(false) }}
                                    pageReloader={loadPage}
                                    owner={provider.selectedAddress} />
                            </Modal>
                        </>}

                </>
            }
        </div>
    )
}