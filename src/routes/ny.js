const router = require('express').Router();
const config = require('../../config');
const request = require('request');
const static_ny = require('./static_ny.json');
const functions = require('../functions');

const parseNYTimesNews = functions.parseNYTimesNews;
const parseNYDetailNews = functions.parseNYDetailNews;

const mappingOfSections = {
    'sports':'sports',
    'politics':'politics',
    'politic':'politics',
    'business':'business',
    'technology':'technology',
    'world':'world',
    "home":"home"
}

router.get('/', async (req, response) => {

    const section = req.query["section"];
    const getSection = mappingOfSections[section];
    const url = "https://api.nytimes.com/svc/topstories/v2/" + getSection +".json?api-key="+ config["NY"];
    //response.json(static_ny);
    request(url, { json: true }, (err, res, body) => {
        if (err) {
            response.json({ 
                'failure': true,
                'msg': "Unable to fetch news from New York Times", 
                'extra': err 
            });
        }
        console.log(res);
        //response.json(body);
        let length = section=="home"?-1:10;
        let news = parseNYTimesNews(body);
        response.status(200).json({
            'failure':false,
            'data':news
        });
    });


});


router.get('/detail', async(req, response)=>{
    const article_weburl = req.query["id"];
    const url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(" + "\"" + article_weburl + "\"" +")&api-key="+config["NY"];
    console.log(url);
    request(url,{json:true},(err, res, body)=>{
        if (err || body == null||body.status !="OK") {
            console.log(err);
            response.json({ 
                'failure': true,
                'msg': "Unable to fetch news from New York Times", 
                'extra': err || body.status
            });
        } else{
            let article = parseNYDetailNews(body)
            response.status(200).json({
                'failure':false,
                'data':article
            });
        }
    });   
});

module.exports = router;