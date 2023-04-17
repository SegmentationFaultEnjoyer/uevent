const knex = require("../../data/db");
const crypto = require('crypto');
const setLinks = require("../../helpers/setLinks");
const httpStatus = require("../../helpers/types/httpStatus");
const {toPromoCodeJsonApi, toPromoCodesJsonApi} = require("../responses/promocodes")

// Create a new promocode
exports.CreatePromocode = async (req, res) => {
  const {
    discount,
    company_id,
    initial_usages,
    expire_date} = req.body.data.attributes;
  try {
    const [promocode] = await knex("promocodes").insert( {
      code: crypto.randomUUID(),
      discount,
      company_id,
      initial_usages,
      usages: 0,
      expire_date
    }).returning("*");
    res.json(toPromoCodeJsonApi(promocode));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};

// Retrieve all promocodes
exports.GetPromocodesList = async (req, res) => {
  try {
    let query = knex("promocodes")
      .select("*")
      .modify((queryBuilder) => {
        if (req.query.filter) {
          // Filter by event_id, company_id, is_active, initial_usages, usages, and end_date
          if (req.query.filter.event_id) {
            queryBuilder.where("event_id", req.query.filter.event_id);
          }
          if (req.query.filter.company_id) {
            queryBuilder.where("company_id", req.query.filter.company_id);
          }
          if (req.query.filter.is_active) {
            queryBuilder.where("is_active", req.query.filter.is_active);
          }
          if (req.query.filter.initial_usages) {
            queryBuilder.where("initial_usages", req.query.filter.initial_usages);
          }
          if (req.query.filter.usages) {
            queryBuilder.where("usages", req.query.filter.usages);
          }
          if (req.query.end_date) {
            queryBuilder.where("end_date", "<=", req.query.end_date);
          }
        }        
      });

    const { page } = req.query;
    let limit = page && page.limit ? page.limit : 15
    let number = page && page.number ? page.number : 0
    sortColumn = req.query.sort ? req.query.sort : "id"
    order = page && page.order ? page.order : undefined
    
    query.orderBy(sortColumn, order)

    const promocodes = await query.select('*').limit(limit).offset(number * limit);
    res.json(toPromoCodesJsonApi(promocodes, setLinks(new URL("http://localhost:3000/promocodes" + req.url), number)));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};

// Retrieve a specific promocode
exports.GetPromocodeById = async (req, res) => {
  try {
    const promocode = await knex("promocodes")
      .select("*")
      .where({
        id: req.params.id,
      })
      .first();

    if (!promocode) {
      return res.status(404).json({
        error: {
          message: "Promocode not found",
        },
      });
    }

    res.json(toPromoCodeJsonApi(promocode));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};

// Retrieve a specific promocode
exports.ValidatePromocodeByCode = async (req, res) => {
  try {
    const promocode = await knex("promocodes")
      .select("*")
      .where({
        code: req.params.code,
      })
      .first();

    if (!promocode) {
      return res.status(404).json({
        error: {
          message: "Promocode not found",
        },
      });
    }
    if (promocode.usages >= promocode.initial_usages || Date(promocode.expire_date) >= Date.now() ) {
      return res.status(401).json({
        error: {
          message: "Promocode is inactive",
        },
      });
    }
    res.json(toPromoCodeJsonApi(promocode));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};

// Update a promocode
exports.UpdatePromocodeById = async (req, res) => {
  try {
    const [promocode] = await knex("promocodes")
      .where({
        id: req.params.id,
      })
      .update(req.body.data.attributes)
      .returning("*");

    if (!promocode) {
      return res.status(404).json({
        error: {
          message: "Promocode not found",
        },
      });
    }

    res.json(toPromoCodeJsonApi(promocode));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};

// Update a promocode
exports.UsePromocodeById = async (req, res) => {
  try {
    let promocode = await knex("promocodes")
      .select("*")
      .where({
        id: req.params.id,
      })
      .first();
     
    if (!promocode) {
      return res.status(404).json({
        error: {
          message: "Promocode not found",
        },
      });
    }
    if (promocode.usages >= promocode.initial_usages || Date(promocode.expire_date) >= Date.now() ) {
      return res.status(401).json({
        error: {
          message: "Promocode is inactive",
        },
      });
    }
    await knex("promocodes")
      .where({
        id: promocode.id,
      })
      .update({usages: promocode.usages + 1})
      .returning("*");

    
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};
// DELETE an event
exports.DeletePromocodeById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPromocode = await knex("promocodes")
      .where({ id })
      .del()
      .returning("*");
    if (!deletedPromocode) {
      res.sendStatus(404);
    } else {
      res.sendStatus(httpStatus.NO_CONTENT);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
