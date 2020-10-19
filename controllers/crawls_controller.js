const {addCrawl} = require('../utils/crawls_utils');



module.exports = {
  index: (req, res) => {

  },
  create: (req, res) => {
    console.log(req.body);
    addCrawl(req).save((err, crawl) => {
      if (err) {
          res.status(500);
          return res.json({
              error: err.message
          });
      }
      res.status(201);
      res.send(crawl);
    });
  },
  edit: (req, res) => {

  },
  newForm: (req, res) => {

  },
  show: (req, res) => {

  },
  update: (req, res) => {

  },
  destroy: (req, res) => {

  }
}