/**
 * Post Affiliate Pro API interface for Node.js
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @see https://support.qualityunit.com/725708-API-Requirements
 */

"use strict";

let PostAffiliatePro = require("./index.js"),
    postaffiliatepro = new PostAffiliatePro("http://<Affiliate>.postaffiliatepro.com/scripts/server.php", "http://<Affiliate>.postaffiliatepro.com/affiliates/login.php", "user", "pass");
    
postaffiliatepro.programs(function(err, result){
    console.log(result[0].rows);
});

postaffiliatepro.report("2016-12-01", "2016-12-12", "A", function(err, result){
    console.log(result);
});

postaffiliatepro.deeplink("url", "campaignid", function(err, url){
    console.log(url);//http://orion30.postaffiliatepro.com/scripts/hcxulqhak?a_aid=itssimple&desturl=http%3A%2F%2Fwww.abouthome.com.br%2F&a_cid=8ac295e8
});

