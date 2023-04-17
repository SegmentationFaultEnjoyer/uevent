const { toCompanyJsonApi } = require("./companies");

// Convert a single event object to JSON API format
exports.toEventJsonApi = (event, company) => ({
  data: {
    type: 'events',
    id: event.id,
    attributes: {
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      location: event.location,
      is_offline: event.is_offline,
      category: event.category,
      contract_address: event.contract_address,
      banner_hash: event.banner_hash,
      price: event.price,
    },
    relationships: {
      company: company ? toCompanyJsonApi(company) : null,
      categories: event.categories? {
        data: event.categories.map(category => ({
          type: 'categories',
          id: category.id
        }))
      } : null
    }
  }
});

// Convert a list of event objects to JSON API format
exports.toEventsJsonApi = (events, links) => ({
  data: events.map(event => ({
    type: 'events',
    id: event.id,
    attributes: {
      title: event.title,
      description: event.description,
      contract_address: event.contract_address,
      start_date: event.start_date,
      end_date: event.end_date,
      location: event.location,
      category: event.category,
      is_offline: event.is_offline,
      banner_hash: event.banner_hash,
      price: event.price,
    },
    relationships: {
      company: {
        data: {
          type: 'companies',
          id: event.company_id
        }
      },
      categories: event.categories ? {
        data: event.categories.map(category => ({
          type: 'categories',
          id: category.id
        }))
      } : null
    }
  })),
  links
});
