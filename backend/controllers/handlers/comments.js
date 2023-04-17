const knex = require("../../data/db");
const setLinks = require("../../helpers/setLinks");
const {toCommentJsonApi, toCommentsJsonApi} = require("../responses/comments")

// GET /comments - get all comments
exports.GetCommentsList = async (req, res) => {
  try {
    const { filter } = req.query;
    const query = knex.select("comments.*", "companies.name").from("comments")
    .leftJoin("companies", "comments.company_id", "companies.id");

    if (filter) {
      if (filter.publish_date) {
        query.where("publish_date", filter.publish_date);
      }
      if (filter.user_address) {
        query.where("user_address", filter.user_address);
      }
      if (filter.company_id) {
        query.where("company_id", filter.company_id);
      }
      if (filter.event_id) {
        query.where("event_id", filter.event_id);
      }
    }

    const { page } = req.query;
    let limit = page && page.limit ? page.limit : 15
    let number = page && page.number ? page.number : 0
    sortColumn = req.query.sort ? req.query.sort : "id"
    order = page && page.order ? page.order : undefined
    
    query.orderBy(sortColumn, order)

    const comments = await query.limit(limit).offset(number * limit);
    
    res.json(toCommentsJsonApi(comments, setLinks(new URL("http://localhost:3000/comments" + req.url), number)));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ title: "Server error", detail: "Failed to fetch comments" }],
    });
  }
};

// GET /comments/:id - get a single comment by ID
exports.GetCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await knex
      .select("*")
      .from("comments")
      .where({ id })
      .first();
    if (!comment) {
      res.status(404).json({
        errors: [
          { title: "Not found", detail: `Comment with ID ${id} not found` },
        ],
      });
    } else {
      res.json(toCommentJsonApi(comment));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ title: "Server error", detail: "Failed to fetch comment" }],
    });
  }
};

// POST events/:event_id/comments - create a new comment
exports.CreateComment = async (req, res) => {
  const {event_id} = req.params
  const { comment, user_address, company_id } =
    req.body.data.attributes;
  publish_date = new Date()
  try {
    const [newComment] = await knex("comments")
      .insert({
        comment,
        publish_date: publish_date.toISOString(),
        event_id,
        user_address,
        company_id,
      })
      .returning("*");
    res.status(201).json(toCommentJsonApi(newComment));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ title: "Server error", detail: "Failed to create comment" }],
    });
  }
};

// PATCH /comments/:id - update a comment by ID
exports.UpdateCommentById = async (req, res) => {
  const { id } = req.params;
  const { comment} =
    req.body.data.attributes;
  try {
    const [updatedComment] = await knex("comments")
      .where({ id })
      .update({
        comment,
      })
      .returning("*");
    if (!updatedComment.length) {
      res.status(404).json({
        errors: [
          { title: "Not found", detail: `Comment with ID ${id} not found` },
        ],
      });
    } else {
      res.json(toCommentJsonApi(updatedComment));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ title: "Server error", detail: "Failed to update comment" }],
    });
  }
};

// DELETE /comments/:id - delete a comment by ID

exports.DeleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the user from the database
    const deletedComment = await knex("comments")
      .where({ id })
      .del()
      .returning("*");
    if (!deletedComment.length) {
      res.status(404).json({
        errors: [
          { title: "Not found", detail: `Comment with ID ${id} not found` },
        ],
      });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
