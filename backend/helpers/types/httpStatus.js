const statusTypes = Object.freeze({
    CREATED: 201,
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_ERROR: 500,
    UNAUTHORIZED: 401,
    NO_CONTENT: 204,
    FOUND: 302,
    NOT_FOUND: 404,
    FORBIDDEN: 403
})

module.exports = statusTypes;