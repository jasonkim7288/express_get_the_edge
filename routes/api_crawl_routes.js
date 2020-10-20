const express = require('express');
const router = express.Router();

const CrawlsController = require('../controllers/api_crawl_controller');

router.get('/start/:id', CrawlsController.start);
router.get('/check', CrawlsController.check);
router.get('/create', CrawlsController.create);
router.get('/addCrawl', CrawlsController.addCrawl);

module.exports = router;