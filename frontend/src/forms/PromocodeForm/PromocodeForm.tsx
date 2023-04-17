import './PromocodeForm.scss'

import { ChangeEvent, FC, useState, useMemo, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { DateTimePicker } from '@/fields'
import { usePromocodes } from '@/hooks'
import dayjs from 'dayjs'
import { ErrorHandler } from '@/helpers'
import { Notificator } from '@/common'

interface Props {
    closeModal?: () => void
    pageReloader?: () => void
}

const DEFAULT_DISCOUNT = 20
const MIN_DAY_OFFSET = 2

const PromocodeForm: FC<Props> = ({ closeModal, pageReloader }) => {
    const initialDate = useMemo(() => dayjs(Date.now()).add(MIN_DAY_OFFSET, 'day'), [])

    const [discount, setDiscount] = useState(DEFAULT_DISCOUNT)
    const [expireDate, setExpireDate] = useState(initialDate)
    const [initialUsages, setInitialUsages] = useState(10)

    const { createPromocode } = usePromocodes()
    const { company_id } = useParams()

    const onDiscountInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (discount < 0 || discount > 100) {
            setDiscount(DEFAULT_DISCOUNT)
            e.target.value = DEFAULT_DISCOUNT.toString()
            return
        }

        setDiscount(Number(e.target.value))
    }

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!company_id) return

        try {
            await createPromocode({
                discount,
                expire_date: expireDate.toISOString(),
                initial_usages: initialUsages,
                company_id,
            })

            Notificator.success('Promocode created!')

            if (closeModal) closeModal()
            if (pageReloader) pageReloader()
        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    return (
        <form className='promocode-form' onSubmit={submit}>
            <h1>Create promocode</h1>
            <TextField
                label='Discount (%)'
                required
                color='primary_light'
                value={discount}
                type='number'
                onChange={onDiscountInput}
            />
            <TextField
                label='Usages'
                required
                color='primary_light'
                value={initialUsages}
                type='number'
                onChange={(e) => { setInitialUsages(Number(e.target.value)) }}
            />
            <DateTimePicker
                variant='outlined'
                label='Expire date'
                value={expireDate}
                setValue={setExpireDate}
                minDateTime={initialDate.subtract(1, 'day')} />

            <section className='promocodes-form__actions'>
                <Button
                    size='large'
                    type='reset'
                    variant='outlined'
                    color='primary_light'
                    onClick={() => { if (closeModal) closeModal() }}
                >
                    Cancel
                </Button>
                <Button
                    size='large'
                    type='submit'
                    variant='contained'
                    color='primary_light'
                >
                    Create
                </Button>
            </section>
        </form>
    )
}

export default PromocodeForm