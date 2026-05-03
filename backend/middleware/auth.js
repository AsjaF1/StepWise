/* Auth removed — single-user mode with a fixed owner ID */
const OWNER_ID = process.env.OWNER_USER_ID || '00000000-0000-0000-0000-000000000000';

module.exports = function auth(req, res, next) {
  req.userId = OWNER_ID;
  next();
};
