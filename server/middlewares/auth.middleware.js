const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, it verifies access tokens to protect API endpoints.
const checkJwt = auth({
  audience: process.env.AUTHO_AUDIENCE, // The unique identifier for your API
  issuerBaseURL: process.env.AUTHO_ISSUER, // Your Auth0 domain
});

module.exports = checkJwt;
