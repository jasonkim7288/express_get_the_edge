const User = require('../models/user');
const Crawl = require('../models/crawl');

const addCrawl = function (req) {
  return new Crawl(req.body);
};




module.exports = {
    addCrawl
};
