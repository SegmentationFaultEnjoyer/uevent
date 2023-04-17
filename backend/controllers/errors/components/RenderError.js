module.exports = function(resp, error) {
    const status = error.errors.status;
    
    resp.status(status).json(error)
}