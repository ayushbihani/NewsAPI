const functions = require('../functions');
const router = require('express').Router();
const config = require('../../config');
const fetch = require('node-fetch');


router.get("/", async(req,response)=>{
    let query = req.query["query"];

    const guardian_url = config["g_url"]+"search?q=" + query + "&api-key="+ config["Guardian"] +"&show-blocks=all";
    const ny_url = config["ny_url"]+"svc/search/v2/articlesearch.json?q="+ query +"&api-key="+config["NY"];
    try{
        const guardian_news_response = await fetch(guardian_url);
        const guardian_news = await guardian_news_response.json();
        let guardian = functions.parseGuardianNews;
        let parsedGuardianNews = guardian(guardian_news);

        const ny_news_response = await fetch(ny_url);
        const ny_news = await ny_news_response.json();
        let ny = functions.parseNYSearchNews;
        let parseNYSearchNews = ny(ny_news);
        let news = parsedGuardianNews.concat(parseNYSearchNews);
        const result = {
            'failure':false,
            'data':news
        }
        response.status(200).json(result);

    } catch(err){
        console.log(err);
        response.json({'err':err});
    }
});

module.exports = router;