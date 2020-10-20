const User = require('../models/user');
const Crawl = require('../models/crawl');
const crawls_controller = require('../controllers/crawls_controller');
const { find } = require('../models/user');
const crawl = require('../models/crawl');
const user = require('../models/user');


const addCrawl = (req) => {
  return new Crawl(req.body);
};

const getAllCrawls = async (req) => {
  let foundCrawls = await Crawl.find({ isDefault: true });
  if (req.user && req.user.crawls.length > 0) {
    for (let i = 0; i < req.user.crawls.length; i++) {
      const foundUserCrawl = await Crawl.findById(req.user.crawls[i]._id);
      foundCrawls.push(foundUserCrawl);
    }
  }
  console.log('foundCrawls:', foundCrawls);
  return foundCrawls;
};

const removeCrawl = (id) => {
  return Crawl.remove({isDefault: false, _id: id});
};

const updateCrawl = (req) => {
  console.log(req.params.id);
  return Crawl.findOneAndUpdate({isDefault: true, _id: req.params.id}, req.body, {new: true});
};

const getOneCrawl = (req) => {
  return Crawl.findById(req.params.id);
};


module.exports = {
  addCrawl,
  removeCrawl,
  updateCrawl,
  getAllCrawls,
  getOneCrawl
};
