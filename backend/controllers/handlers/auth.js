require("dotenv").config();
const jwt = require("jsonwebtoken");
const knex = require("../../data/db");

const { UpdateTokens } = require("../../helpers/tokens");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../errors/components/classes");
const ProcessError = require("../errors/handler");

const { toLoginJsonApi } = require("../responses/auth");

exports.LogIn = async function (req, resp) {
  try {
    const { address } = req.body.data.attributes;

    /* 
      contract logic
    */

    const {
      access_token,
      refresh_token,
      tokenLifeSpan,
      access_life,
      refresh_life,
    } = await UpdateTokens({ address }, { address });

    await knex("refresh")
      .insert({ token: refresh_token, expiresat: tokenLifeSpan, address })
      .onConflict("address")
      .merge();

    resp.cookie("refresh", refresh_token, { maxAge: refresh_life });
    resp.cookie("token", access_token, { maxAge: access_life });

    resp.json(toLoginJsonApi({ access_token, refresh_token }));
  } catch (error) {
    ProcessError(resp, error);
  }
};

exports.Refresh = async function (req, resp) {
  try {
    const { token } = req.body.data.attributes;
    const { id } = jwt.verify(token, process.env.JWT_TOKEN, {
      subject: "refresh-token",
    });


    let dbResp = await new usersQ().New().Get().WhereID(id).Execute();

    if (dbResp.error)
      throw new BadRequestError(`No such user: ${dbResp.error_message}`);

    const { email, role } = dbResp;

    dbResp = await new refreshQ().New().Get().WhereOwnerID(id).Execute();

    if (dbResp.error)
      throw new Error(`No token found: ${dbResp.error_message}`);

    if (dbResp.token !== token) throw new jwt.JsonWebTokenError();

    await new refreshQ().Transaction(async () => {
      const { access_token, refresh_token, tokenLifeSpan } = await UpdateTokens(
        { email, role, id },
        { id }
      );

      dbResp = await new refreshQ()
        .New()
        .Update({ token: refresh_token, due_date: tokenLifeSpan })
        .WhereOwnerID(id)
        .Execute();

      if (dbResp.error)
        throw new Error(`Error while updating token: ${dbResp.error_message}`);

      resp.cookie("refresh", refresh_token);
      resp.cookie("token", access_token);

      resp.json(toLoginJsonApi({ access_token, refresh_token }));
    });
  } catch (error) {
    ProcessError(resp, error);
  }
};

exports.CheckAuth = function (req, resp, next) {
  const token =
    req.body.token || req.cookies.token || req.headers["x-access-token"];
  let decoded;

  try {
    if (!token) throw new UnauthorizedError("No token provided");

    decoded = jwt.verify(token, process.env.JWT_TOKEN, {
      subject: "access-token",
    });
  } catch (error) {
    ProcessError(resp, error);
    return;
  }

  req.decoded = decoded;

  next();
};
