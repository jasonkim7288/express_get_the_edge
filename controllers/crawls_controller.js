const {
  addCrawl,
  removeCrawl,
  updateCrawl,
  getAllCrawls
} = require('../utils/crawls_utils');



module.exports = {
  index: async (req, res) => {
    const allCrawls = await getAllCrawls(req);
    console.log('allCrawls: ', allCrawls);
    res.send(allCrawls);
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
    if (req.error) {
      res.status(req.error.status);
      res.send(req.error.message);
  } else {
      // execute the query from updatePost
      updateCrawl(req).exec((err, crawl) => {
          if (err) {
              res.status(500);
              return res.json({
                  error: err.message
              });
          }
          res.status(200);
          res.send(crawl);
      });
  }
  },
  destroy: (req, res) => {
    if (req.error) {
      res.status(req.error.status);
      res.send(req.error.message);
    } else {
      // execute the query from deletePost
      removeCrawl(req.params.id).exec((err) => {
        if (err) {
          res.status(500);
          return res.json({
            error: err.message
          });
        }
        res.sendStatus(204);
      });
    }
  }
}