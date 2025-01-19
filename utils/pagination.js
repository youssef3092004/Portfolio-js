function getPagination(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
  
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be positive integers');
    }
  
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }
  
  module.exports = getPagination;
