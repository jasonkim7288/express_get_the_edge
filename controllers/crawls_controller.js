const {
  addCrawl,
  removeCrawl,
  updateCrawl,
  getAllCrawls,
  getOneCrawl
} = require('../utils/crawls_utils');



module.exports = {
  index: async (req, res) => {
    const allCrawls = JSON.parse(JSON.stringify(await getAllCrawls(req)));
    console.log('allCrawls: ', allCrawls);
    res.render('crawls/index', {
      allCrawls
    });
  },
  create: (req, res) => {
    console.log(req.body);
    if (req.user) {
      const strSkills = req.body.skills;
      req.body.skills = strSkills.split(',').map(skill => ({keyword: skill.trim()}))
      addCrawl(req).save((err, crawl) => {
        if (err) {
          res.status(500);
          return res.json({
            error: err.message
          });
        }
        res.redirect('/crawls');
      });
    } else {
      res.redirect('/')
    }
  },
  edit: (req, res) => {
    if (req.user) {
      getOneCrawl(req).exec((err, crawl) => {
        if (err) {
          return res.status(500).json({error: err.message});
        }
        res.render('crawls/edit', { crawl: JSON.parse(JSON.stringify(crawl)) });
      })
    }
  },
  newForm: (req, res) => {
    res.render('crawls/new');
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