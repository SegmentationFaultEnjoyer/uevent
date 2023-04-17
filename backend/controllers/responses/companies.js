// Convert a single company object to JSON API format
exports.toCompanyJsonApi = (company) => ({
  data: {
    type: 'companies',
    id: company.id,
    attributes: {
      name: company.name,
      description: company.description,
      owner: company.owner,
      email: company.email,
      phone: company.phone,
      telegram: company.telegram,
      instagram: company.instagram
    }
  }
});

// Convert a list of company objects to JSON API format
exports.toCompaniesJsonApi = (companies, links) => ({
  data: companies.map(company => ({
    type: 'companies',
    id: company.id,
    attributes: {
      name: company.name,
      description: company.description,
      owner: company.owner,
      email: company.email,
      phone: company.phone,
      telegram: company.telegram,
      instagram: company.instagram
    }
  })),
  links
});