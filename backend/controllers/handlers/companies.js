const knex = require("../../data/db");
const setLinks = require("../../helpers/setLinks");
const {toCompaniesJsonApi, toCompanyJsonApi} = require("../responses/companies")

// Create a new company
exports.CreateCompany = async (req, res) => {
  const { name, description, email, phone, telegram, instagram, user_address } = req.body.data.attributes;

  try {
    const [result] = await knex("companies")
      .insert({ name, description, email, phone, telegram, instagram, owner: user_address })
      .returning("*");
    await knex("user_company")
    .insert({ user_address, "company_id": result.id, role: "owner" })

    res.status(201).json(toCompanyJsonApi(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all companies
exports.GetCompaniesList = async (req, res) => {
  try {

      // Build the initial query using knex
      let query = knex("companies").select("*");
    if (req.query.filter) {
      const { name, email, phone, owner, telegram, instagram, user_address } = req.query.filter;

  
      if (user_address) {
        query.join("user_company", "user_company.company_id", "=", "companies.id")
        .where("user_company.user_address", user_address)
      }
      // Apply the filters if they are present
      if (name) {
        query = query.where("name", "ilike", `%${name}%`);
      }   
      if (owner) {
        query = query.where("owner", "ilike", `%${owner}%`);
      }
      if (email) {
        query = query.where("email", "ilike", `%${email}%`);
      }
      if (phone) {
        query = query.where("phone", "ilike", `%${phone}%`);
      }
      if (telegram) {
        query = query.where("telegram", "ilike", `%${telegram}%`);
      }
      if (instagram) {
        query = query.where("instagram", "ilike", `%${instagram}%`);
      }
    }
   
    const { page } = req.query;
    let limit = page && page.limit ? page.limit : 15
    let number = page && page.number ? page.number : 0
    sortColumn = req.query.sort ? req.query.sort : "id"
    order = page && page.order ? page.order : undefined
    
    query.orderBy(sortColumn, order)
    const companies = await query.limit(limit).offset(number * limit);
    res.json(toCompaniesJsonApi(companies, setLinks(new URL("http://localhost:3000/companies" + req.url), number)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a specific company by ID
exports.GetCompanyById = async (req, res) => {
  const { id } = req.params;

  try {
    const [company] = await knex("companies").select("*").where({ id });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(toCompanyJsonApi(company));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a specific company by ID
exports.UpdateCompanyById = async (req, res) => {
  const { id } = req.params;
  const { name, description, email, phone, telegram, instagram } = req.body.data.attributes;

  try {
    const [result] = await knex("companies")
      .where({ id })
      .update({ name, description, email, phone, telegram, instagram })
      .returning("*");
    if (!result) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(toCompanyJsonApi(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a specific company by ID
exports.DeleteCompanyById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await knex("companies").where({ id }).del().returning("*");
    if (!result) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
