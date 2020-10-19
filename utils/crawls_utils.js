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
    let foundCrawls = await Crawl.find({isDefault: true});
    console.log('foundCrawls:', foundCrawls);
    if (req.user) {
        req.user.crawls.forEach(async crawl => {
            const foundUserCrawl = await Crawl.findById(crawl.crawl);
            foundCrawls.push(foundUserCrawl);
        });
    }
    return foundCrawls;
};

const removeCrawl = (id) => {
    return Crawl.findByIdAndRemove(id);
};

const updateCrawl = (req) => {
    return Crawl.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
};

const getOneCrawl = (req) => {
  if(req.user) {
    const foundCrawl = user.crawls.some(crawl => crawl.crawl === req.params.id);
    if(foundCrawl) {
      return Crawl.findById(req.params.id);
    }
  }
};


module.exports = {
    addCrawl,
    removeCrawl,
    updateCrawl,
    getAllCrawls,
    getOneCrawl
};
