// Convert a single comment object to JSON API format
exports.toCommentJsonApi = (comment) => ({
  data: {
    type: "comments",
    id: comment.id,
    attributes: {
      comment: comment.comment,
      publishDate: comment.publish_date,
    },
    relationships: {
      user: comment.user_address
        ? {
            data: {
              type: "users",
              address: comment.user_address,
            },
          }
        : null,
      company: comment.company_id
        ? {
            data: {
              type: "companies",
              id: comment.company_id,
              name: comment.name,
            },
          }
        : null,
      event: {
        data: {
          type: "events",
          id: comment.event_id,
        },
      },
    },
  },
});

// Convert a list of comment objects to JSON API format
exports.toCommentsJsonApi = (comments, links) => ({
  data: comments.map((comment) => ({
    type: "comments",
    id: comment.id,
    attributes: {
      comment: comment.comment,
      publishDate: comment.publish_date,
    },
    relationships: {
      user: comment.user_address
        ? {
            data: {
              type: "users",
              address: comment.user_address,
            },
          }
        : null,
      company: comment.company_id
        ? {
            data: {
              type: "companies",
              id: comment.company_id,
              name: comment.name,
            },
          }
        : null,
      event: {
        data: {
          type: "events",
          id: comment.event_id,
        },
      },
    },
  })),
  links,
});
