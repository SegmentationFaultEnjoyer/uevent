import { ToastContainer, ToastOptions, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './style.scss'

const options: ToastOptions = Object.freeze({
    autoClose: 3000,
    style: {
        backgroundColor: 'var(--primary-main)'
    }
}) 

class Notificator {
    static success(payload: string) {
        toast.success(payload, {...options, 
            progressStyle: {backgroundColor: 'var(--success-light)'},
            className: 'icon-success'
        });
    }

    static info(payload: string) {
        toast.info(payload, {
            ...options,
            progressStyle: {backgroundColor: 'var(--tertiary-dark)'},
            className: 'icon-info'
        })
    }

    static error(payload: string) {
        toast.error(payload, {
            ...options,
            progressStyle: {backgroundColor: 'var(--error-dark)'},
            className: 'icon-error'
        })
    }

    static warning(payload: string) {
        toast.warn(payload, {
            ...options

        })
    }
}

export { Notificator, ToastContainer }
