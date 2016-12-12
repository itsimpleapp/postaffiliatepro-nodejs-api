"use strict";

const url = require("url"),
      request = require("request");

module.exports = function(serverurl, loginurl, user, pass){
    return {
        /**
         * Cookie list to send 
         */
        cookies: null,
        
        /**
         * SessionID
         */
        session: null,
                
        /**
         * Function to generate the API request
         *
         * @param string URL 
         * @param function cb
         */
        getinapi: function(data, cb) {   
            var _this = this;
            
            _this.authentication((error, body) => {
                if(!error){
                    let paramsStr = Object.keys(data).map(function(k) {
                        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
                    }).join('&');

                    request.post({
                        headers: {'content-type' : 'application/x-www-form-urlencoded', "Cookie": "A=" + _this.session + "; " + _this.cookies},
                        url: serverurl,
                        body: paramsStr
                    }, (error, response, body) => { 
                        if(body)
                            body = JSON.parse(body);

                        cb(error, body); 
                    });
                }
                else{
                    cb(error, body); 
                }
            });         
        },
        
        /**
         * Function to get SessionID
         * 
         * @param function cb
         */
        getsession: function(cb){
            var _this = this;
            
            var _this = this;
            
            if(_this.session){
                cb(false, null); 
            }
            else{
                request(loginurl, (error, response, body) => {
                    if(response.headers["set-cookie"]){
                        var session = response.headers["set-cookie"][0].split(";")[0].replace("A=", "");
                        _this.session = session;
                        cb(false, null); 
                    }
                    else{
                        cb(true, "Invalid login url"); 
                    }
                });
            }            
        },
        
        /**
         * Function to autenticate session 
         * 
         * @param function cb
         */
        authentication: function(cb){
            var _this = this;
            
            if(_this.cookies){
                cb(false, null); 
            }
            else{
                var data = {"D": JSON.stringify({
                    "C": "Gpf_Rpc_Server",
                    "M": "run",
                    "requests": [{
                        "C": "Gpf_Auth_Service",
                        "M": "authenticate",
                        "fields": [["name","value"], ["username",user], ["password",pass], ["rememberMe","Y"],["language","pt-BR"]]
                    }],
                    "S": _this.session
                })};

                let paramsStr = Object.keys(data).map(function(k) {
                    return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
                }).join('&');

                request.post({
                    headers: {'content-type' : 'application/x-www-form-urlencoded'},
                    url: serverurl,
                    body: paramsStr
                }, (error, response, body) => {           
                    if(response.headers["set-cookie"]){
                        var cookies = "";

                        for(var key in response.headers["set-cookie"])
                            cookies += ((cookies != "") ? "; " : "") + response.headers["set-cookie"][key];

                        _this.cookies = cookies;
                        cb(false, null); 
                    }
                    else{
                        cb(true, "Invalid login"); 
                    }
                });
            }
        },
        
        /**
         * Function to encode URL
         * 
         * @see http://locutus.io/php/url/urlencode/
         * @param str
         * @return str
         */
        urlencode: function(str){
            str = (str + '');
            return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+')
        },
        
        /**
         * Get advertiser programs
         *
         * @param function cb
         */
        programs: function(cb) {
            var _this = this;
            
            this.getsession(() => {
                var data = {"D": JSON.stringify({
                                    "C": "Gpf_Rpc_Server",
                                    "M": "run",
                                    "requests": [{
                                        "C": "Pap_Affiliates_Promo_CampaignsGrid",
                                        "M": "getRows",
                                        "columns": [["id"],["id"],["name"],["description"],["logourl"],["banners"],["longdescriptionexists"],["commissionsdetails"],["rstatus"],["commissionsexist"]]
                                    }],
                                    "S": _this.session
                                })};

                this.getinapi(data, cb);
            });
        },
                
        /**
         * Returns basic statistics of clicks, views, leads and sales
         * 
         * @param string datestart Query start date in AAAA-MM-DD format
         * @param string dateend Query end date in AAAA-MM-DD format
         * @param string status Sale status (A = Approved, D = Denied, P = Pending)
         * @param function cb
         */
        report: function(datestart, dateend, status, cb){
            var _this = this;
            
            this.getsession(() => {
                var data = {"D": JSON.stringify({
                                    "C": "Gpf_Rpc_Server",
                                    "M": "run",
                                    "requests": [{
                                        "C": "Pap_Affiliates_Reports_TrendsReport",
                                        "M": "loadData",
                                        "isInitRequest": "N",
                                        "filterType": "trends_report",                                        
                                        "filters":[["datetime","D>=",datestart],["datetime","D<=",dateend],["rpc","=","Y"],["groupBy","=","day"],["dataType1","=","saleCount"],["dataType3","=","saleCommission"],["rstatus","IN",status]]
                                    }],
                                    "S": _this.session
                                })};

                this.getinapi(data, cb);
            });
        },
        
        /**
         * Create tracking links
         * 
         * @param string url
         * @param integer progid
         * @return void
         */
        deeplink: function(url, campaignid, cb){
            var _this = this;           
            
            this.getsession(() => {
                var data = {"D": JSON.stringify({
                                    "C": "Gpf_Rpc_Server",
                                    "M": "run",
                                    "requests": [{
                                        "C": "Pap_Affiliates_Promo_DynamicLink",
                                        "M": "getDeeplinkCode",                             
                                        "fields":[["name","value"],["desturl",url],["campaignId",campaignid]]
                                    }],
                                    "S": _this.session
                                })};
                       
                this.getinapi(data, function(err, result){
                    if(!err){
                        var deeplink = result[0]["fields"][3][1];
                        cb(null, deeplink);
                    }
                    else{
                        cb(err, "");
                    }
                });
            });
        }
    }
}
