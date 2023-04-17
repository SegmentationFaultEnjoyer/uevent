// Convert a auth info object to JSON API format
exports.toLoginJsonApi = (access_token, refresh_token) => { 
  return {
    data: {
        type: "auth-tokens",
        attributes: {
            access: access_token,
            refresh: refresh_token
        }
    }
  }
};
