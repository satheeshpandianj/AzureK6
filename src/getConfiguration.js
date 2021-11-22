/***************************************************************************
Script Name		: getConfiguration.js
Date Created	: 12/07/2021
Author			: Satheesh Pandian
Description		: Endpoint returning the configuration details for 
                  all the sales models. Includes details such as 
                  available variants, soft offers and monthly options
Request inputs	: 
                 1. Market 
                 2. Brand
Request header	:	
                 1. VCC-Api-Key
                 2. Accept
Method			: GET

***************************************************************************/

//importing the libraries for run the scripts
import { sleep } from 'k6';
import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from 'k6/data';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Create an object to get the error rate
let errorRate = new Rate('getCarConfigErrorRate');
let errorCount = new Counter('getCarConfigErrorCount');

// Setting the test configuration along withE threshold value to check the performance
export let options = {
    tags: {
        ENV: __ENV.ENV,
        PROJECTNAME: __ENV.PROJECT,
        APINAME: __ENV.APINAME,
    },
};


export default function () {
    // Get the URL 
    let url = 'https://gw.qa.consumer.api.volvocars.com/dcom/financialoptions/configuration?market=DE&brand=VCC';

    //Headers to be passed in the request
    let params = {
        headers: {
            'Accept': 'application/vnd.volvocars.api.dcom.financialoptions.configurationresponse.v2+json',
            'VCC-Api-Key': '1558dc36508249a3a0d545d3609a1fe9' // API key is for authentication
        }
    };


    //Hit the payload using GET method
    let response = http.get(url, params);

    //console.log(response.status);

    //Check the response code is 200 or not
    check(response, { 'Status Code is 200 ': (result) => result.status === 200 },);

    // Increase the error rate if the response code is not 200
    // errorRate.add(response.status !== 200);
    if (response.status !== 200) {
        errorCount.add(1)
    }

    // wait for 2 second
    sleep(2);
}
////////////////////////////////////// Summary Report in HTML format  /////////////////////////

export function handleSummary(data) {
  return {
    "/loadtest/$loadTestIdentifier/summary.html": htmlReport(data),
  };
}
/*************************************************************************************
                                end of script
*************************************************************************************/
