// Convert a single promo code object to JSON API format
exports.toPromoCodeJsonApi = (promoCode) => ({
  data: {
    type: "promo_codes",
    id: promoCode.id,
    attributes: {
      code: promoCode.code,
      discount: promoCode.discount,
      expire_date: promoCode.expire_date,
      initial_usages: promoCode.initial_usages,
      usages: promoCode.usages
    },
    relationships: {
      company: {
        data: {
          type: "companies",
          id: promoCode.company_id,
        },
      }
    },
  },
});
// Convert a list of promo code objects to JSON API format
exports.toPromoCodesJsonApi = (promoCodes, links) => ({
  data: promoCodes.map((promoCode) => ({
    type: "promo_codes",
    id: promoCode.id,
    attributes: {
      code: promoCode.code,
      discount: promoCode.discount,
      expire_date: promoCode.expire_date,
      initial_usages: promoCode.initial_usages,
      usages: promoCode.usages
    },
    relationships: {
      company: {
        data: {
          type: "companies",
          id: promoCode.company_id,
        },
      }
    },
  })),
  links,
});
