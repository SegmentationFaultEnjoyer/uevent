import { AxiosError } from 'axios';
import { Notificator } from '@/common';
import { setCookie } from '@/helpers';

import log from 'loglevel'

function getErrorMessage(error: unknown) {
    if (error instanceof AxiosError) {
        if (!error.response || !error.response.data.errors) return error.message

        const { title, detail } = error.response.data.errors;
        console.error(title, detail, error);
        return detail;
    }
    else if (error instanceof Error)
        return error.message;
}

export class ErrorHandler {
    static process(error: unknown) {
        Notificator.error(getErrorMessage(error));
    }

    static processWithoutFeedback(error: Error | unknown): void {
        log.error(error)
    }

    static clearTokens() {
        setCookie('token', '', 0);
        setCookie('refresh', '', 0);
    }
}
