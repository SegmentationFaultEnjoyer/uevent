class BadRequestError extends Error {
    constructor(errorMessage = '') {
        super(errorMessage);
    }
}

class UnauthorizedError extends Error {
    constructor(errorMessage = '') {
        super(errorMessage);
    }
}

class NotFoundError extends Error {
    constructor(errorMessage = '') {
        super(errorMessage)
    }
}

class ForbiddenError extends Error {
    constructor(errorMessage = '') {
        super(errorMessage)
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    ForbiddenError
}