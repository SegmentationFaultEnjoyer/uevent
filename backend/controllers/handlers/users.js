const knex = require("../../data/db")
const {toUserJsonApi, toUsersJsonApi} = require("../responses/users")
const setLinks = require("../../helpers/setLinks");

// GET /users
exports.GetUsersList = async (req, res) => {
  try {
    // Query the database with the filter parameters
    let query = knex("users");
    if (req.query.filter) {

      // Get the filter parameters from the request query
      const { address, company_id } = req.query.filter;

      if (company_id) {
        query.join("user_company", "user_company.user_address", "=", "users.address")
        .where("user_company.company_id", company_id)
      }
      if (address) {
        query = query.where("address", "like", `%${address}%`);
      }
    }

    const { page } = req.query;
    let limit = page && page.limit ? page.limit : 15
    let number = page && page.number ? page.number : 0

    sortColumn = req.query.sort ? req.query.sort : "id"
    order = page && page.order ? page.order : undefined
    
    query.orderBy(sortColumn, order)
    
    const users = await query.select().limit(limit).offset(number * limit);

    res.json(toUsersJsonApi(users, setLinks(new URL("http://localhost:3000/users" + req.url), number)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /users/:address
exports.GetUserByAddress = async (req, res) => {
  try {
    const { address } = req.params;
    const user = await knex("users").where("address", address).select();

    if (!user.length) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(toUserJsonApi(user[0]));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// POST /users
exports.CreateUser = async (req, res) => {
  try {
    const { address } = req.body.data.attributes;

    // Validate the request body
    if (!address) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Insert the new user into the database
    const [user] = await knex("users")
      .insert({ address })
      .returning("*");

      res.json(toUserJsonApi(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// DELETE /users/:address
exports.DeleteUserByAddress = async (req, res) => {
  try {
    const { address } = req.params;
    const user = req.user;

    // Delete the user from the database
    await knex("users").where("address", address).delete();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// POST /users/:user_address/companies/:company_id?role={role}
exports.AddUser = async (req, res) => {
  try {
    const { user_address, company_id } = req.params;
    const {role} = req.query

    // Insert the new user into the database
    const user = await knex("user_company")
      .insert({ address, company_id, role})
      .returning("*");
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// PATCH /users/:address/companies/:company_id?role={role}
exports.UpdateRole = async (req, res) => {
  try {
    const { user_address, company_id } = req.params;
    const {role} = req.query

    const user = await knex("user_company")
      .update({role})
      .where ("user_address", user_address)
      .where("company_id", company_id)
      .returning("*");
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// DELETE /users/:address/companies/:company_id
exports.DeleteUserFromCompany = async (req, res) => {
  try {
    const { user_address, company_id } = req.params;

   await knex("user_company")
      .where ("user_address", user_address)
      .where("company_id", company_id)
      .delete();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
