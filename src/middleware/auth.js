function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    res.redirect('/login');
  }
  
  function isNotAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return res.redirect('/dashboard');
    }
    next();
  }
  
  module.exports = {
    isAuthenticated,
    isNotAuthenticated
  };