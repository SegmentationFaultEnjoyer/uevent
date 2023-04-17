import './ConfirmationModal.scss'

import { Dispatch, SetStateAction, FC, FormEvent } from 'react'

import { Modal, Notificator } from '@/common'
import { ErrorHandler } from '@/helpers';

import Button from '@mui/material/Button';
import { ReactProps } from '@/types';

interface Props extends ReactProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    action: () => Promise<void>
    message: string
}

const ConfirmationModal: FC<Props> = ({ isOpen, setIsOpen, action, message }) => {
    const cancel = () => {
        setIsOpen(false)
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await action()

            setIsOpen(false)

            if (!message) return

            Notificator.success(message)

        } catch (error) {
            ErrorHandler.process(error)
        }
    }

    return (
        <Modal isShown={isOpen} setIsShown={setIsOpen}>
            <div className='confirmation-modal'>
                <h1>Are you sure?</h1>
                <form onSubmit={onSubmit} className='confirmation-modal__actions'>
                    <Button
                        color='error'
                        variant='contained'
                        onClick={cancel}
                        size="large">No</Button>
                    <Button
                        color='success'
                        variant='contained'
                        type='submit'
                        size="large">Yes</Button>
                </form>
            </div>
        </Modal>
    )
}

export default ConfirmationModal