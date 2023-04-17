const status = require('../../../helpers/types/httpStatus');

exports.Unauthorized = function(detail = '') {
    return {
        errors: {
            title: "Bad auth credentials provided",
            status: status.UNAUTHORIZED,
            detail
        }
    }
}

exports.InternalError = function(detail = '') {
    return {
        errors: {
            title: "Internal server error",
            status: status.INTERNAL_ERROR,
            detail
        }
    }
}

exports.BadRequest = function(detail = '') {
    return {
        errors: {
            title: "Bad request",
            status: status.BAD_REQUEST,
            detail
        }
    }
}

exports.NotFound = function(detail = '') {
    return {
        errors: {
            title: "Not found",
            status: status.NOT_FOUND,
            detail
        }
    }
}

exports.Forbidden = function(detail = '') {
    return {
        errors: {
            title: "Forbidden",
            status: status.FORBIDDEN,
            detail
        }
    }
}