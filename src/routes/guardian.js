const router = require('express').Router();
const config = require('../../config');
const request = require('request');
const guardian_static = require('./static_guardian.json');
const functions = require('../functions');

const parseGuardianNews = functions.parseGuardianNews;
const parseGuardianSpecificNews = functions.parseGuardianSpecificNews;

router.get('/home', async (req, response) => {
    const url = "https://content.guardianapis.com/search?api-key=" + config["Guardian"] + "&section=(sport|business|technology|politics|world)&show-blocks=all";
    //response.json(guardian_static);
        request(url, { json: true }, (err, res, body) => {
        if (err) {
            response.json({ 
                'failure': true,
                'msg': "Unable to fetch news from guardian", 
                'extra': err 
            });
        }
        let news = parseGuardianNews(body, -1);
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
        let news = parseGuardianNews(body, 10);
        response.status(200).json({
            'failure':false,
            'data':news
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