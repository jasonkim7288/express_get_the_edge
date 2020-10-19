const express = require('express');
const router = express.Router();

const CrawlsController = require('../controllers/crawls_controller')

router.route('/')
  .get(CrawlsController.index)
  .post(CrawlsController.create);

router.route(':id/edit')
  .get(CrawlsController.edit)

router.route('/new')
  .get(CrawlsController.newForm)

router.route('/:id')
  .get(CrawlsController.show)
  .put(CrawlsController.update)
  .delete(CrawlsController.destroy);

module.exports = router;