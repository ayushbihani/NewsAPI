
function parseGuardianNews(object, len) {
    let response = object["response"];
    if (response["status"] != "ok" || response["results"] == null) {
        return {
            "msg": "Null response from Guardian API",
            'failure': true
        };
    }
    let results = response["results"];
    let resultsLen = results.length;
    let parsedResponse = Array();
    for (let i = 0; i < resultsLen; i++) {
        try{
            let article = results[i];
            let main = article["blocks"]["main"];
            let body = article["blocks"]["body"];
            let newResponse = new Map();
            newResponse["webUrl"] = article["webUrl"];
            newResponse["apiUrl"] = article["apiUrl"];
            newResponse["section"] =  article["sectionId"];
            newResponse["title"] = article["webTitle"];
            newResponse["id"] = article["id"];
            newResponse["source"] = "guardian";
            let date = article["webPublicationDate"];
            let convertedDate = new Date(date);
            newResponse["date"] = getDate(convertedDate);
            let elements = main["elements"][0]["assets"];
            //let elements = null;
            if (elements != null && elements[elements.length - 1] != null) {
                let lastElement = elements[elements.length - 1];
                newResponse["image"] = lastElement["file"];
            } else {
                newResponse["image"] = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
            }
            newResponse["description"] = body[0]["bodyTextSummary"];
            parsedResponse.push(newResponse);
            if(len != -1 && parsedResponse.length == 10 )
                break;
        } catch(err){
            continue;
        }
    }
    return parsedResponse;
}

function parseNYTimesNews(object, len){
    if (object["status"] != "OK") {
        return {
            "msg": "Null response from NYTime API",
            'failure': true,
        };
    }
    let results = object["results"];
    let resultsLen = results.length;
    let parsedResponse = Array();
    for (let i = 0; i < resultsLen; i++) {
        try{
            let article = results[i];
            let newResponse = new Map();
            newResponse["id"] = article["url"];
            newResponse["webUrl"] = article["url"];
            newResponse["apiUrl"] = article["uri"];
            newResponse["section"] = article["section"];
            newResponse["title"] = article["title"];
            newResponse["description"] = article["abstract"];  
            let date = article["published_date"];
            let convertedDate = new Date(date);
            newResponse["date"] = getDate(convertedDate);
            let multimedia = article["multimedia"];
            newResponse["image"] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            if(multimedia!=null){
                for(let j = 0; j < multimedia.length; j++){
                    let image = multimedia[j];
                    if(image["width"] > 2000){
                        newResponse["image"] = image["url"];
                        break;
                    }
                }
            }
            newResponse.source = "nytimes";
            parsedResponse.push(newResponse);
            if(len != -1 && parsedResponse.length == 10 )
                break;
        } catch(err){
            continue;
        }
    }
    return parsedResponse;
}

function parseNYDetailNews(object){

    if(object != null && object.status == "OK"){  
        try{
            let map = {};
            let response = object["response"]["docs"][0];
            map.title = response["headline"]["main"];
            map.image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            if("multimedia" in response){
                let multimedia = response["multimedia"];
                for(let i=0;i<multimedia.length;i++){
                    let temp = multimedia[i];
                    if(temp.width >= 2000){
                        map.image = "https://static01.nyt.com/"+temp["url"];
                        break;
                    }
                }
            }
            let date = response["pub_date"];
            map.id = response["web_url"];
            map._id=response["_id"];
            map.section = response["news_desk"];
            map.webUrl = response["web_url"];
            map.source="nytimes";
            let convertedDate = new Date(date);
            map.date = getDate(convertedDate);
            map.description = response["abstract"];
            return map;
        } catch(err){
            return {
                'failure':true,
                'err':err
            }
        }
    } 
}

function parseGuardianSpecificNews(object) {
    let response = object["response"];
    if (response == null || response["status"] != "ok") {
        return {
            "msg": "Null response from Guardian API",
            'failure': true
        };
    }
    try{
        let article = response["content"]; 
        let main = article["blocks"]["main"];
        let body = article["blocks"]["body"];
        let newResponse = new Map();
        newResponse["webUrl"] = article["webUrl"];
        newResponse["apiUrl"] = article["apiUrl"];
        newResponse["section"] =  article["sectionId"];
        newResponse["title"] = article["webTitle"];
        newResponse["id"] = article["id"];
        newResponse["source"] = "guardian";
        let date = article["webPublicationDate"];
        let convertedDate = new Date(date);
        newResponse["date"] = getDate(convertedDate);
        let elements = main["elements"][0]["assets"];
        //let elements = null;
        if (elements != null && elements[elements.length - 1] != null) {
            let lastElement = elements[elements.length - 1];
            newResponse["image"] = lastElement["file"];
        } else {
            newResponse["image"] = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
        }
        newResponse["description"] = body[0]["bodyTextSummary"];
        return newResponse;
    } catch(err){

    }
}

let parseNYSearchNews = function(object){
    if(object.status == "OK"){
        try{
            let results = object["response"]["docs"];
            let news = [];
            for(let i=0;i<results.length;i++){
                let response = results[i];
                let map = {};
                map.title = response["headline"]["main"];
                map.image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                if("multimedia" in response){
                    let multimedia = response["multimedia"];
                    for(let i=0;i<multimedia.length;i++){
                        let temp = multimedia[i];
                        if(temp.width >= 2000){
                            map.image = "https://static01.nyt.com/"+temp["url"];
                            break;
                        }
                    }
                }
                let date = response["pub_date"];
                let convertedDate = new Date(date);
                map.date = getDate(convertedDate);
                map.section = response["news_desk"];
                map.id = response["web_url"];
                map._id=response["_id"];
                map.webUrl = response["web_url"];
                map.description = response["abstract"];
                map.source = "nytimes";
                news.push(map);
            }
            return news;
        } catch(err){
            return err;
        }
    } 
}

function getDate(MyDate){
    return MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth()+1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
}

const guardian_section_mappings={
    "sports":"sport",
    "politic":"politics"
}

const ny_section_mappings={
    "sport":"sports",
    "politics":"politics"
}

module.exports = {
    parseGuardianNews,
    parseNYTimesNews,
    parseNYSearchNews,
    parseGuardianSpecificNews,
    parseNYDetailNews,
    guardian_section_mappings,
    ny_section_mappings
}