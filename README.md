# Post Affiliate Pro API

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/andrehrf/postaffiliatepro-nodejs-api/master/LICENSE)
[![npm version](https://badge.fury.io/js/postaffiliatepro-api.svg)](https://badge.fury.io/js/postaffiliatepro-api)

API integration with Post Affiliate Pro 

## Install

```bash
$ npm install postaffiliatepro-api
```

## API Documentation

* API Doc - https://support.qualityunit.com/725708-API-Requirements
 
## Usage

```js
"use strict";

let PostAffiliatePro = require("postaffiliatepro-api"),
    postaffiliatepro = new PostAffiliatePro("http://<Affiliate>.postaffiliatepro.com/scripts/server.php", "http://<Affiliate>.postaffiliatepro.com/affiliates/login.php", "user", "pass");
    
postaffiliatepro.programs(function(err, result){
    console.log(result[0].rows);
});

postaffiliatepro.report("2016-12-01", "2016-12-12", "A", function(err, result){
    console.log(result);
});

postaffiliatepro.deeplink("url", "campaignid", function(err, url){
    console.log(url);//http://<Affiliate>.postaffiliatepro.com/scripts/hcxulqhak?a_aid=itssimple&desturl=http%3A%2F%2Fwww.abouthome.com.br%2F&a_cid=8ac295e8
});
```

## License

  MIT
  
  Copyright (C) 2016 André Ferreira

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.