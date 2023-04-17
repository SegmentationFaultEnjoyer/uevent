// Convert a single user object to JSON API format
exports.toUserJsonApi = (user) => {
 return  {
    data: {
      type: 'users',
      id: user.id,
      attributes: {
        address: user.address
      }
    }
}};
  
// Convert a list of user objects to JSON API format
exports.toUsersJsonApi = (users, links) => ({
    data: users.map(user => ({
        type: 'users',
        id: user.id,
        attributes: {
            address: user.address
        }
    })),
    links
});