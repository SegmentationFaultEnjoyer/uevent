require("dotenv").config();
const setLinks = require("../../helpers/setLinks");
const knex = require("../../data/db");
const httpStatus = require("../../helpers/types/httpStatus");
const { toEventJsonApi, toEventsJsonApi } = require("../responses/events")
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// GET all events
exports.GetEventsList = async (req, res) => {
  try {
    const query = knex("events");

    if (req.query.filter) {
      if (req.query.filter.category_id) {
        query.join("event_category", "event_category.event_id", "=", "events.id").
          where("event_category.category_id", req.query.filter.category_id)
      }

      // Filter by title (case-insensitive)
      if (req.query.filter.title) {
        query.whereRaw(
          "LOWER(title) LIKE ?",
          `%${req.query.filter.title.toLowerCase()}%`
        );
      }

      // Filter by start_date (greater than or equal to)
      if (req.query.filter.start_date) {
        query.where("start_date", ">=", req.query.filter.start_date);
      }

      // Filter by price (less than or equal to)
      if (req.query.filter.price) {
        query.where("price", "<=", req.query.filter.price);
      }

      // Filter by price (less than or equal to)
      if (req.query.filter.company_id) {
        query.where("company_id", req.query.filter.company_id);
      }

      // Filter by price (less than or equal to)
      if (req.query.filter.is_offline) {
        query.where("is_offline", req.query.filter.is_offline);
      }

      // Filter by locatio
      if (req.query.filter.location) {
        query.where("location", req.query.filter.location);
      }

      // Filter by category
      if (req.query.filter.category) {
        query.where("category", req.query.filter.category);
      }
    }

    const { page } = req.query;
    let limit = page && page.limit ? page.limit : 15
    let number = page && page.number ? page.number : 0

    sortColumn = req.query.sort ? req.query.sort : "id"
    order = page && page.order ? page.order : undefined
    
    query.orderBy(sortColumn, order)

    const events = await query.select('*').limit(limit).offset(number * limit);

    res.json(toEventsJsonApi(events, setLinks(new URL("http://localhost:3000/events" + req.url), number)));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// GET event by ID
exports.GetEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await knex("events").select("*").where({ id }).first();
    if (!event) {
      res.sendStatus(404);
    } else {
      const company = await knex("companies").select("*").where({ id: event.company_id }).first();
      res.json(toEventJsonApi(event, company));
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// CREATE a new event
exports.CreateEvent = async (req, res) => {
  const {
    title,
    contract_address,
    description,
    start_date,
    end_date,
    location,
    is_offline,
    banner_hash,
    category,
    price,
    company_id,
  } = req.body.data.attributes;
  try {

    let banner = banner_hash ? banner_hash : process.env.DEFAULT_BANNER_HASH
    const priceValue = price || 0

    const [newEvent] = await knex("events")
      .insert({
        title,
        contract_address,
        description,
        start_date,
        end_date,
        location,
        is_offline,
        banner_hash: banner,
        price: priceValue,
        company_id,
        category
      })
      .returning("*");
    res.json(toEventJsonApi(newEvent));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// UPDATE an existing event
exports.UpdateEventById = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    start_date,
    end_date,
    location,
    is_offline,
    price,
    company_id,
  } = req.body.data.attributes;
  try {
    const [updatedEvent] = await knex("events")
      .where({ id })
      .update({
        title,
        description,
        start_date,
        location,
        is_offline,
        end_date,
        price,
        company_id,
        category
      })
      .returning("*");
    if (!updatedEvent) {
      res.sendStatus(404);
    } else {
      res.json(toEventJsonApi(updatedEvent));
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// DELETE an event
exports.DeleteEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await knex("events")
      .where({ id })
      .del()
      .returning("*");
    if (!deletedEvent) {
      res.sendStatus(404);
    } else {
      res.status(httpStatus.NO_CONTENT.end());
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// GET an event categories
exports.GetCategoriesList = async (req, res) => {
  try {
    const categories = await knex.select('category')
    .distinct()
    .from('events')
    .orderBy('category', 'ASC')

    res.json({
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// GET event banner
exports.GenerateBanner = async (req, res) => {
  const { prompt } = req.query;
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json"
    });
    res.json({
      data: {
        attributes: {
          b64_json: response.data.data[0].b64_json
        }
      }
    })
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
