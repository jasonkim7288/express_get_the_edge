const Crawl = require('../models/crawl');
const User = require('../models/user');

const { startCrawl } = require('../utils/api_crawl_utils');

module.exports = {
  start: (req, res) => {
    console.log('craw started');
    const crawlId = req.query.crawlId;
    
    if (crawlId) {
      if (req.user) {
        User.findById(req.user._id).populate('crawls.crawl')
        .then(curUser => {
          console.log('curUser:', curUser);
          console.log('curUser.crawls[0]:', curUser.crawls[0])
          const checkCrawlId = curUser.crawls.find(crawl => crawl._id == crawlId)
          if (checkCrawlId) {
            Crawl.findById(crawlId)
            .then(crawl => {
              console.log('crawl:', crawl);
              const result = startCrawl(crawl);
              res.json({crawl, result});
            })
            .catch(err => {
              res.json({ error: err });
            });
          } else {
            Crawl.find({_id: crawlId, isDefault: true})
            .then(crawl => {
              console.log('default crawl:', crawl);
              const result = startCrawl(crawl);
              res.json({crawl, result});
            })
            .catch(err => {
              res.json({ error: err });
            });
          }
        });
      } else {
        Crawl.find({_id: crawlId, isDefault: true})
        .then(crawl => {
          console.log('default crawl:', crawl);
          const result = startCrawl(crawl);
          res.json({crawl, result});
        })
        .catch(err => {
          res.json({ error: 'Cannot match crawl id' });
        });
      }
    }
  },
  check: (req, res) => {
    res.json({stage: crawlStage});
  },
  create: (req, res) => {
    Crawl.create({
      jobTitle: 'front end developer',
      region: 'All Brisbane QLD',
      skills: [
        { keyword: 'react' },
        { keyword: 'angular' },
        { keyword: 'vue' },
        { keyword: 'javascript' },
        { keyword: 'html' }
      ],
      isDefault: true
    })
      .then(console.log)
    res.send('ok');
  },
  addCrawl: (req, res) => {
    Crawl.findById('5f8aab3aa6db7e259849ba55')
      .then(foundCrawl => {
        console.log('foundCrawl:', foundCrawl)
        // User.findByIdAndUpdate(req.user._id, {$set: {crawls: [tempCrawl]}})
        //   .then(res => res.json({status: 'success'}));
        User.findById(req.user._id)
          .then(foundUser => {
            console.log('req.user._id:', req.user._id);
            foundUser.crawls.unshift(foundCrawl);
            console.log('foundUser.crawls[0]:', foundUser.crawls[0])
            return foundUser.save();
          })
          .then(updatedUser => {
            res.json(updatedUser.crawls);
          });
      });
  }
}
  