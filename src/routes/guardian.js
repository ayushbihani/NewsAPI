const router = require('express').Router();
const config = require('../../config');
const request = require('request');
const functions = require('../functions');

const parseGuardianNews = functions.parseGuardianNews;
const parseGuardianSpecificNews = functions.parseGuardianSpecificNews;
const parseLatestGuardianNews = functions.parseLatestGuardianNews;

router.get('/home', async (req, response) => {
    const url = "https://content.guardianapis.com/search?api-key=" + config["Guardian"] + "&section=(sport|business|technology|politics|world)&show-blocks=all";
        request(url, { json: true }, (err, res, body) => {
        if (err) {
            response.json({ 
                'failure': true,
                'msg': "Unable to fetch news from guardian", 
                'extra': err 
            });
        }
        let news = parseGuardianNews(body);
        response.status(200).json({
            'failure':false,
            'data':news
        });
    });
});


router.get('/', async (req, response)=>{
    let section = req.query["section"].toLowerCase();
    console.log(section);
    if(section =="sports")
        section = "sport";
    if(section == null){
        res.json({
            "failure":true,
            "msg":"Section field cannot be empty",
            "status": -2
        });
    }

    const endpoint = config["g_url"] + section +"?api-key="+ config["Guardian"] +"&show-blocks=all";
    request(endpoint, { json: true }, (err, res, body) => {
        if (err) {
            response.json({ 
                'failure': true,
                'msg': "Unable to fetch news from guardian", 
                'extra': err 
            });
        }
        let news = parseGuardianNews(body);
        response.status(200).json({
            'failure':false,
            'data':news
        });
    });
});


router.get('/latest', async(req, response)=>{
    const endpoint = "https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key="+config["Guardian"];
    request(endpoint, {json:true},(err, res, body)=>{
        const news = parseLatestGuardianNews(body);
        response.status(200).json({
            'failure':false,
            'data': news,
        });
    }); 
});

router.get('/detail', async(req, response)=>{
    const id = req.query["id"];
    const url = config["g_url"]+ id + "?api-key=" + config["Guardian"]+"&show-blocks=all";
    request(url, {json:true}, (err, res, body)=>{
        if (err) {
            response.json({ 
                'failure': true,
                'msg': "Unable to fetch news from guardian", 
                'extra': err 
            });
        }
        let parsedResponse = parseGuardianSpecificNews(body);
        response.status(200).json({
            "failure":false,
            "data":parsedResponse
        });
    });
});

module.exports = router;