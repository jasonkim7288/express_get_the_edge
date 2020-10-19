var Crawler = require('crawler');
const Crawl = require('../models/crawl');

var c = new Crawler({
  rateLimit: 10,
})

var workQueue = [];
var theEndOfPages;
var crawlObject;
var totalNum = 0;

function runCrawl (crawlObject, url, pageNum) {
  theEndOfPages = false;
  c.queue([{
    uri: `${url}${pageNum === 1 ? '' : '?page=' + pageNum}`,
    callback: (err, res, done) => {
      let hrefs = null;
      if (err) {
        console.log('err:', err);
        return done();
      } else {
        let $ = res.$;
        let aKey;
        let keysWithAttribs = Object.keys($('a')).filter(key => {
          aKey = $('a')[key]
          return aKey.attribs && aKey.attribs.href && /\/job\//.test(aKey.attribs.href)
        });
        hrefs = keysWithAttribs.map(key => `https://www.seek.com.au${$('a')[key].attribs.href}`)
        console.log('keysWithAttribs:', hrefs);


        if (hrefs && hrefs.length > 0) {
          totalNum += hrefs.length;
          hrefs.forEach((href, index) => {
            c.queue([{
              uri: href,
              callback: (err, res, done) => {
                if (err) {
                  console.log('err:', err);
                } else {
                  let $ = res.$;
                  // console.log($('li').text());
                  // let strBody = res.body;
                  // console.log(strBody.match(/.{30}angular.{30}/gi));
                  // /.{30}angular.{30}/gi.test(strBody) && count++;
                  // console.log($('li').text().match(/.{30}rest.{30}/gi));

                  counts.forEach(count => {
                    $('li').text().toLowerCase().includes(count.keyword) && count.count++;
                  })

                  if (index === hrefs.length - 1) {
                    console.log('totalNum, count:', totalNum, counts);
                  }

                  if (theEndOfPages && index === hrefs.length - 1) {
                    Crawl.findById(crawlObject._id)
                      .then(foundCrawl => {
                        console.log('counts:', counts);
                        foundCrawl.results.unshift({skills: counts});
                        return foundCrawl.save();
                      })
                      .then(res => {
                        console.log('saved');
                      })
                      .catch(err => {
                        console.log('err:', err);
                      })
                      .finally(() => {
                        workQueue.shift();
                        if (workQueue.length > 0) {
                          crawlObject = workQueue[0];
                          counts = crawlObject.skills.map(keyword => ({ keyword: keyword.keyword, count: 0}));
                          runCrawl(crawlObject, getUrl(crawlObject), 1);
                        }
                      });
                  }
                }
                done();
              }
            }])
          })
        }

        done();

        $('a').each(function (index) {
          if ($(this).text() === 'Next') {
            setTimeout(() => {
              runCrawl(crawlObject, url, ++pageNum);
            }, 10);
            return false;
          } else {
            theEndOfPages = true;
          }
        })
      }
    }
  }]);
};

function getUrl (crawlInstance) {
  const jobTitle = crawlInstance.jobTitle.split(' ').join('-') + '-jobs';
  const region = 'in-' + crawlInstance.region.split(' ').join('-');
  const returnUrl = `https://www.seek.com.au/${jobTitle}/${region}`;
  console.log('returnUrl:', returnUrl);
  return returnUrl;
}

function startCrawl (crawlInstance) {
  console.log('workQueue:', workQueue);
  if (workQueue.length === 0) {
    crawlObject = crawlInstance.toObject();
    counts = crawlObject.skills.map(keyword => ({ keyword: keyword.keyword, count: 0}));
    workQueue.push({ job: crawlObject });
    runCrawl(crawlObject, getUrl(crawlObject), 1);
    return 'started';
  } else {
    indexFound = workQueue.findIndex(job => job._id === crawlObject._id);
    if (indexFound !== -1) {
      return 'duplicated';
    } else {
      workQueue.push({ job: crawlInstance.toObject() });
      return 'queued';
    }
  }
}

module.exports = {startCrawl};