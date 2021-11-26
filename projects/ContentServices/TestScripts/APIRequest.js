
/*
Import all the necessary modules and libraries
*/
import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { group } from 'k6';
import { Trend } from 'k6/metrics';
import { Rate } from 'k6/metrics';
import { Counter } from "k6/metrics";
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import * as postDict from '../API/postDictionary.js';
import * as getDict from '../API/getDictionary.js';
import * as delDict from '../API/deleteDictionary.js';
import * as getLang from '../API/getLanguageVersion.js';
import * as updateLang from '../API/updateLanguageVersion.js';
import * as publishLang from '../API/publishLanguageVersion.js';
import * as getOps from '../API/getOperation.js';
import * as listDict from '../API/listDictionary.js';
import * as listLoc from '../API/listLocales.js';
import * as createCT from '../API/createContentType.js'
import * as getCT from '../API/getContentType.js';
import * as delCT from '../API/deleteContentType.js';
import * as createEC from '../API/createEditorialComponent.js';
import * as getEC from '../API/getEditorialComponent.js';
import * as delEC from '../API/deleteEditorialComponent.js';
import * as listEC from '../API/listEditorialComponent.js';
import * as nav from '../API/navigation.js';
import * as caas from '../API/caasContent.js';
import * as ncdGetDict from '../API/NCDGetDictionary.js';

/////////////////////////// Global Variables ///////////////////////////////

let thinkTime = 10;

/////////////////////////// API Name Validation ///////////////////////////////

export const validateAPIName = (apiName) => {
    switch (apiName) {
        case ('POSTDICTIONARY'):
            return true;
        case ('GETDICTIONARY'):
            return true;
        case ('DELETEDICTIONARY'):
            return true;
        case ('GETLANGUAGEVERSION'):
            return true;
        case ('UPDATELANGUAGEVERSION'):
            return true;
        case ('PUBLISHLANGUAGEVERSION'):
            return true;
        case ('GETOPERATION'):
            return true;
        case ('LISTDICTIONARY'):
            return true;
        case ('LISTLOCALES'):
            return true;
        case ('CREATECONTENTTYPE'):
            return true;
        case ('GETCONTENTTYPE'):
            return true;
        case ('DELETECONTENTTYPE'):
            return true;
        case ('CREATEEDITORIALCOMPONENT'):
            return true;
        case ('GETEDITORIALCOMPONENT'):
            return true;
        case ('DELETEEDITORIALCOMPONENT'):
            return true;
        case ('LISTEDITORIALCOMPONENT'):
            return true;
        case ('NAVIGATION'):
            return true;
        case ('CAASCONTENT'):
            return true;
        case ('NCDGETDICTIONARY'):
            return true;
        default:
            return false;
    }

}


///////////////////////////  Selecting API for Perf Test  //////////////////////////////////

/**
 * Description:
 *            This function is used to select the flow of API execution based on the APINAME 
 *  given by user. For example, the below command run CMDictionaries API
 *  k6 run .\src\perfAPITestScript.js QA ContentServices CMDictionaries ContentTest 1 1 
 * 'CMDictionaries' is an API name under ContentServices project
 * 
 **/

export const frameAPIRequest = (apiName) => {
    let sysId;
    let contentID;
    let editorialComponentID;
    switch (apiName) {
        case ('POSTDICTIONARY'):
            sysId = postDictionary();
            break;
        case ('GETDICTIONARY'):
            getDictionary();
            break;
        case ('DELETEDICTIONARY'):
            sysId = postDictionary();
            deleteDictionary(sysId);
            break;
        case ('GETLANGUAGEVERSION'):
            getLanguageVersion();
            break;
        case ('UPDATELANGUAGEVERSION'):
            updateLanguageVersion();
            break;
        case ('PUBLISHLANGUAGEVERSION'):
            publishLanguageVersion();
            break;
        case ('GETOPERATION'):
            getOperation();
            break;
        case ('LISTDICTIONARY'):
            listDictionary();
            break;
        case ('LISTLOCALES'):
            listLocales();
            break;
        case ('CREATECONTENTTYPE'):
            contentID = createContentType();
            break;
        case ('GETCONTENTTYPE'):
            getContentType();
            break;
        case ('DELETECONTENTTYPE'):
            contentID = createContentType();
            deleteContentType(contentID);
            break;
        case ('CREATEEDITORIALCOMPONENT'):
            editorialComponentID = createOrUpdateEditorialComponent();
            break;
        case ('GETEDITORIALCOMPONENT'):
            getEditorialComponent();
            break;
        case ('DELETEEDITORIALCOMPONENT'):
            editorialComponentID = createOrUpdateEditorialComponent();
            deleteEditorialComponent(editorialComponentID);
            break;
        case ('LISTEDITORIALCOMPONENT'):
            listEditorialComponent();
            break;
        case ('NAVIGATION'):
            navigation();
            break;
        case ('CAASCONTENT'):
            caasContent();
            break;
        case ('NCDGETDICTIONARY'):
            ncdGetDictionary();
            break;
    }

}

///////////////////////////  Ending API Selection for Perf Test  ////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            CHECKING RESPONSE VALIDATION                                        //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Check the response code for each API after it is executed
 *
 * @param {string} '<API NAME> HTTP status 200'
 * 
 * Description:
 *            This function is used to check the response code of an API executed 
 * with expected status and return the message in the console. For example, when 
 * postDictionary API is executed, it will return the below message in the console
 *                  ✓ postDictionary HTTP status <response code>
 * 
 **/

function checkStatus(apiName, response, expectedStatus, failOnError, printOnError) {
    const obj = {};
    // console.log(`${expectedStatus} and response code ${response.status}`);
    obj[`${apiName} HTTP status ${expectedStatus}`] = (r) => r.status === expectedStatus;

    const checkResult = check(response, obj);
    // console.log(checkResult);
    if (!checkResult) {
        if (printOnError) {
            console.log("Response: " + response.body);
        }
        if (failOnError) {
            console.log(`Received unexpected status code ${response.status} for URL: ${response.url}, expected ${expectedStatus}`)
        }
    }
    return checkResult;
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            POST DICTIONARY                                                     //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let PostDictionaryTrend = new Trend('PostDictionaryTrend');
let PostDictionaryError = new Counter('PostDictionaryError');

///////////////////////////////  Post Dictionary Starts  /////////////////////////////////////////////
/**
 * Making the hit for Post Dictionary endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Post dictionary end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const postDictionary = () => {
    let res = postDict.postDictionaryAPI();
    let url = res.URL;
    let headers = res.HEADERS;
    let body = `${JSON.stringify(res.BODY)}`;
    let responsePost = http.post(url, body, headers);
    let success = checkStatus(postDictionary.name, responsePost, 200, true, true);
    PostDictionaryTrend.add(responsePost.timings.duration)
    let data = JSON.parse(responsePost['body']);
    let sysId = data.data.sys.id;
    console.log(`${sysId}`);
    PostDictionaryError.add(!success);
    sleep(Math.random() * thinkTime);
    return sysId;
}

///////////////////////////////  Post Dictionary ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            GET DICTIONARY                                                      //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////  CSV Test Data ////////////////////////////////////////
let getDictionaryData;
if (__ENV.ENV.toUpperCase() === 'QA' && __ENV.DATASOURCE === 'dotcom-sitecore-qa') {
    //console.log('QA Dict file');
    getDictionaryData = new SharedArray("getDictionaryTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getDictionary_qa.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'TEST' && __ENV.DATASOURCE === 'dotcom-sitecore-test') {
    //console.log('TEST Dict file');
    getDictionaryData = new SharedArray("getDictionaryTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getDictionary_test.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'PROD' && __ENV.DATASOURCE === 'dotcom-sitecore-prod') {
    //console.log('PROD Dict file');
    getDictionaryData = new SharedArray("getDictionaryTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getDictionary_prod.csv'), { header: true }).data;
    })
}
else if (__ENV.DATASOURCE === 'content-services-sitecore9-custom' || __ENV.DATASOURCE === undefined) {
    // console.log('CUSTOM Dict file');
    getDictionaryData = new SharedArray("getDictionaryTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getDictionary_custom.csv'), { header: true }).data;
    })
}
else {
    // console.log(`Please check your environment and data source. Both should match`);
}

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let GetDictionaryTrend = new Trend('GetDictionaryTrend');
let GetDictionaryError = new Counter('GetDictionaryError');

///////////////////////////////  Get Dictionary Starts  /////////////////////////////////////////////

/**
 * Making the hit for Get Dictionary endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Get dictionary end point. The dictionary ID
 *  is retrieved from the test data from getDictionary.csv file. Then validate the response code is 200 or not. 
 *  Also it is registering the response time for each successful hit
 * 
 **/

const getDictionary = () => {
    let randomData = getDictionaryData[Math.floor(Math.random() * getDictionaryData.length)];
    const params = {
        dictionaryID: randomData.dictionaryID,
    }
    console.log(`randomGetDictionaryID is ${JSON.stringify(params.dictionaryID)}`);
    let resGet = getDict.GetDictionaryAPI(params.dictionaryID);
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;
    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(getDictionary.name, responseGet, 200, true, true);
    GetDictionaryTrend.add(responseGet.timings.duration);
    GetDictionaryError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  Get Dictionary ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            DELETE DICTIONARY                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let DeleteDictionaryTrend = new Trend('DeleteDictionaryTrend');
let DeleteDictionaryError = new Counter('DeleteDictionaryError');

///////////////////////////////  Delete Dictionary Starts  /////////////////////////////////////////////

/**
 * Making the hit for Delete Dictionary endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Get dictionary end point. The dictionary ID
 *  is retrieved from the test data from getDictionary.csv file. Then validate the response code is 200 or not.
 *  Also it is registering the response time for each successful hit
 *
 **/

const deleteDictionary = (id) => {
    let resDelete = delDict.DeleteDictionaryAPI(id);
    let urlDelete = resDelete.URL;
    let headersDelete = resDelete.HEADERS;

    let responseDelete = http.del(urlDelete, null, headersDelete);
    let success = checkStatus(deleteDictionary.name, responseDelete, 200, true, true);
    DeleteDictionaryTrend.add(responseDelete.timings.duration);
    DeleteDictionaryError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  Get Dictionary ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           GET LANGUAGE VERSION                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  CSV Test Data ///////////////////////////////////////
let getLanguageVersionData;

if (__ENV.ENV.toUpperCase() === 'QA' && __ENV.DATASOURCE === 'dotcom-sitecore-qa') {
    //console.log('QA Dict file');
    getLanguageVersionData = new SharedArray("getLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getLanguageVersion_qa.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'TEST' && __ENV.DATASOURCE === 'dotcom-sitecore-test') {
    //console.log('TEST Dict file');
    getLanguageVersionData = new SharedArray("getLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getLanguageVersion_test.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'PROD' && __ENV.DATASOURCE === 'dotcom-sitecore-prod') {
    //console.log('PROD Dict file');
    getLanguageVersionData = new SharedArray("getLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getLanguageVersion_prod.csv'), { header: true }).data;
    })
}
else if (__ENV.DATASOURCE === 'content-services-sitecore9-custom' || __ENV.DATASOURCE === undefined) {
    // console.log('CUSTOM Dict file');
    getLanguageVersionData = new SharedArray("getLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getLanguageVersion_custom.csv'), { header: true }).data;
    })
}
else {
    console.log(`Please check your environment and data source. Both should match`);
}

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let GetLanguageVersionTrend = new Trend("GetLanguageVersionTrend");
let GetLanguageVersionError = new Counter("GetLanguageVersionError");

///////////////////////////////  Get language Version Starts  /////////////////////////////////////////////

/**
 * Making the hit for Get Language Version endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Get Language Version end point. The dictionary ID
 *  is retrieved from getLanguageVersion.csv file in Test Data folder . 
 *  Then validate the response code is 200 or not. Also it is registering the response time for each successful hit
 * 
 **/

const getLanguageVersion = () => {
    let randomData = getLanguageVersionData[Math.floor(Math.random() * getLanguageVersionData.length)];
    const params = {
        dictionaryID: randomData.dictionaryID,
        locale: randomData.locale,
    }
    // console.log(`randomGetLanguageVersionDictID is ${JSON.stringify(params.dictionaryID)} & ${JSON.stringify(params.locale)}`);
    let resGet = getLang.GetLanguageVersionAPI(params.dictionaryID, params.locale);
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(getLanguageVersion.name, responseGet, 200, true, true);
    GetLanguageVersionTrend.add(responseGet.timings.duration);
    GetLanguageVersionError.add(!success);
    let data = JSON.parse(responseGet['body']);
    let versionToken = data.data.versionToken;
    console.log(`versionToken is ${versionToken}`);
    sleep(Math.random() * thinkTime);
    return versionToken;
}

///////////////////////////////  Get Language Version ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           UPDATE LANGUAGE VERSION                                              //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  CSV Test Data ///////////////////////////////////////
let updateLanguageVersionData;

if (__ENV.ENV.toUpperCase() === 'QA' && __ENV.DATASOURCE === 'dotcom-sitecore-qa') {
    //console.log('QA Dict file');
    updateLanguageVersionData = new SharedArray("updateLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/updateLanguageVersion_qa.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'TEST' && __ENV.DATASOURCE === 'dotcom-sitecore-test') {
    //console.log('TEST Dict file');
    updateLanguageVersionData = new SharedArray("updateLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/updateLanguageVersion_test.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'PROD' && __ENV.DATASOURCE === 'dotcom-sitecore-prod') {
    //console.log('PROD Dict file');
    updateLanguageVersionData = new SharedArray("updateLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/updateLanguageVersion_prod.csv'), { header: true }).data;
    })
}
else if (__ENV.DATASOURCE === 'content-services-sitecore9-custom' || __ENV.DATASOURCE === undefined) {
    // console.log('CUSTOM Dict file');
    updateLanguageVersionData = new SharedArray("updateLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/updateLanguageVersion_custom.csv'), { header: true }).data;
    })
}
else {
    console.log(`Please check your environment and data source. Both should match`);
}

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let UpdateLanguageVersionTrend = new Trend("UpdateLanguageVersionTrend");
let UpdateLanguageVersionError = new Counter("UpdateLanguageVersionError");

///////////////////////////////  Update language Version Starts  /////////////////////////////////////////////

/**
 * Making the hit for Update Language Version endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Update Language Version end point. The dictionary ID
 *  is retrieved from updateLanguageVersion.csv file in Test Data folder . 
 *  Then validate the response code is 200 or not. Also it is registering the response time for each successful hit
 * 
 **/

const updateLanguageVersion = () => {
    let randomData = updateLanguageVersionData[Math.floor(Math.random() * updateLanguageVersionData.length)];
    const params = {
        versionToken: randomData.versionToken,
        dictionaryID: randomData.dictionaryID,
        locale: randomData.locale
    }
    // console.log(`UpdateLanguageVersionLocale is ${JSON.stringify(params.locale)}, UpdateLanguageVersionDictionaryID is ${JSON.stringify(params.dictionaryID)}, UpdateLanguageVersionVersionToken is ${JSON.stringify(params.versionToken)}`);

    let res = updateLang.UpdateLanguageVersionAPI(params.dictionaryID, params.locale, params.versionToken);
    let url = res.URL;
    let headers = res.HEADERS;
    let body = `${JSON.stringify(res.BODY)}`;

    let responsePut = http.put(url, body, headers);
    let success = checkStatus(updateLanguageVersion.name, responsePut, 202, true, true);
    UpdateLanguageVersionTrend.add(responsePut.timings.duration);
    UpdateLanguageVersionError.add(!success);
    // let data = JSON.parse(JSON.stringify(responsePut['body']));
    // let contentID = data.data.id;
    // console.log(`data is ${data}`);
    sleep(Math.random() * thinkTime);
    // return contentID;
}

///////////////////////////////  Update Language Version ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           PUBLISH LANGUAGE VERSION                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
let publishLanguageVersionData;

if (__ENV.ENV.toUpperCase() === 'QA' && __ENV.DATASOURCE === 'dotcom-sitecore-qa') {
    //console.log('QA Dict file');
    publishLanguageVersionData = new SharedArray("publishLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/publishLanguageVersion_qa.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'TEST' && __ENV.DATASOURCE === 'dotcom-sitecore-test') {
    //console.log('TEST Dict file');
    publishLanguageVersionData = new SharedArray("publishLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/publishLanguageVersion_test.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'PROD' && __ENV.DATASOURCE === 'dotcom-sitecore-prod') {
    //console.log('PROD Dict file');
    publishLanguageVersionData = new SharedArray("publishLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/publishLanguageVersion_prod.csv'), { header: true }).data;
    })
}
else if (__ENV.DATASOURCE === 'content-services-sitecore9-custom' || __ENV.DATASOURCE === undefined) {
    // console.log('CUSTOM Dict file');
    publishLanguageVersionData = new SharedArray("publishLanguageVersionTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/publishLanguageVersion_custom.csv'), { header: true }).data;
    })
}
else {
    console.log(`Please check your environment and data source. Both should match`);
}


////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let PublishLanguageVersionTrend = new Trend("PublishLanguageVersionTrend");
let PublishLanguageVersionError = new Counter("PublishLanguageVersionError");

///////////////////////////////  Update language Version Starts  /////////////////////////////////////////////


/**
 * Making the hit for Publish Language Version endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Publish Language Version end point. The dictionary ID
 *  is retrieved from publishLanguageVersion.csv file in Test Data folder . 
 *  Then validate the response code is 200 or not. Also it is registering the response time for each successful hit
 * 
 **/

const publishLanguageVersion = () => {

    let randomData = publishLanguageVersionData[Math.floor(Math.random() * publishLanguageVersionData.length)];
    const params = {
        dictionaryID: randomData.dictionaryID,
        locale: randomData.locale
    }
    let res = publishLang.PublishLanguageVersionAPI(params.dictionaryID, params.locale);
    let url = res.URL;
    let headers = res.HEADERS;
    let body = `${JSON.stringify(res.BODY)}`;

    let responsePut = http.put(url, body, headers);
    let success = checkStatus(publishLanguageVersion.name, responsePut, 202, true, true);
    PublishLanguageVersionTrend.add(responsePut.timings.duration);
    PublishLanguageVersionError.add(!success);
    let data = JSON.parse(responsePut['body']);
    let operationID = data.async.id;
    console.log(`data is ${JSON.stringify(data)}`);
    console.log(`operationID is ${operationID}`);
    sleep(Math.random() * thinkTime);
    return operationID;
}

///////////////////////////////  Publish Language Version ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           GET OPERATION                                                        //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const getOperationData = new SharedArray("getOperationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/getOperation.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let GetOperationTrend = new Trend("GetOperationTrend");
let GetOperationError = new Counter("GetOperationError");

///////////////////////////////  Get Operation Starts  /////////////////////////////////////////////

/**
 * Making the hit for Get Operation endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Get Operation end point. The operation ID
 *  is retrieved from getOperation.csv file in Test Data folder .  Then validate the response code 
 *  is 200 or not. Also it is registering the response time for each successful hit
 * 
 **/

const getOperation = () => {

    let randomData = getOperationData[Math.floor(Math.random() * getOperationData.length)];
    const params = {
        operationID: randomData.operationID,
    }
    let resGet = getOps.GetOperationAPI(params.operationID);
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    GetOperationTrend.add(responseGet.timings.duration);
    let success = checkStatus(getOperation.name, responseGet, 200, true, true);
    GetOperationError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  Get Operation ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           LIST DICTIONARY                                                      //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let ListDictionaryTrend = new Trend('ListDictionaryTrend');
let ListDictionaryError = new Trend('ListDictionaryError');

///////////////////////////////  List Dictionary Starts  /////////////////////////////////////////////


/**
 * Making the hit for List Dictionary endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to List Dictionary end point. 
 * Then validate the response code is 200 or not. Also it is registering the 
 * response time for each successful hit
 * 
 **/

const listDictionary = () => {
    let resGet = listDict.ListDictionaryAPI();
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    // console.log(JSON.stringify(responseGet.body));
    let success = checkStatus(listDictionary.name, responseGet, 200, true, true);
    ListDictionaryTrend.add(responseGet.timings.duration);
    ListDictionaryError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  List Dictionary ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           LIST LOCALES                                                         //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let ListLocalesTrend = new Trend('ListLocalesTrend');
let ListLocalesError = new Trend('ListLocalesError');

///////////////////////////////  List Locales Starts  /////////////////////////////////////////////

/**
 * Making the hit for List Locales endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to List Locales end point. 
 *  Then validate the response code is 200 or not. Also it is registering the 
 *  response time for each successful hit
 * 
 **/

const listLocales = () => {
    let resGet = listLoc.ListLocalesAPI();
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(listLocales.name, responseGet, 200, true, true);
    ListLocalesTrend.add(responseGet.timings.duration);
    ListLocalesError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  List Locales ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           CREATE CONTENT TYPE                                                  //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const createContentTypeData = new SharedArray("createContentTypeTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/createContentType.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let CreateOrUpdateContentTypeTrend = new Trend('CreateOrUpdateContentTypeTrend');
let CreateOrUpdateContentTypeError = new Counter('CreateOrUpdateContentTypeError');

/////////////////////////////// Create Content Type Starts  /////////////////////////////////////////////

/**
 * Making the hit for Create Content Type endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Create Content Type end point. 
 * The test data is available in createContentType.csv file in test data folder.
 * Then validate the response code is 200 or not. Also it is registering the 
 * response time for each successful hit
 * 
 **/

const createContentType = () => {

    let randomData = createContentTypeData[Math.floor(Math.random() * createContentTypeData.length)];
    const params = {
        ContentType: randomData.ContentType,
        RequiredStatus: randomData.RequiredStatus,
        LocalizedStatus: randomData.LocalizedStatus
    }
    // console.log(`randomContentType : ${JSON.stringify(params.ContentType)} randomRequiredStatus : ${JSON.stringify(params.RequiredStatus)} randomLocalizedStatus : ${JSON.stringify(params.LocalizedStatus)}`);
    let res = createCT.CreateOrUpdateContentTypeAPI(params.ContentType, params.RequiredStatus, params.LocalizedStatus);
    let url = res.URL;
    let headers = res.HEADERS;
    let body = `${JSON.stringify(res.BODY)}`;

    let responsePut = http.put(url, body, headers);
    let success = checkStatus(createContentType.name, responsePut, 200, true, true);
    CreateOrUpdateContentTypeTrend.add(responsePut.timings.duration);
    CreateOrUpdateContentTypeError.add(!success);
    let data = JSON.parse(responsePut['body']);
    let contentID = data.data.id;
    console.log(`${contentID}`);
    sleep(Math.random() * thinkTime);

    return contentID;
}


/////////////////////////////// Create Content Type ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           GET CONTENT TYPE                                                     //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
let getContentTypeData;

if (__ENV.ENV.toUpperCase() === 'QA' && __ENV.DATASOURCE === 'dotcom-sitecore-qa') {
    //console.log('QA Dict file');
    getContentTypeData = new SharedArray("getContentTypeTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getContentType_qa.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'TEST' && __ENV.DATASOURCE === 'dotcom-sitecore-test') {
    //console.log('TEST Dict file');
    getContentTypeData = new SharedArray("getContentTypeTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getContentType_test.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'PROD' && __ENV.DATASOURCE === 'dotcom-sitecore-prod') {
    //console.log('PROD Dict file');
    getContentTypeData = new SharedArray("getContentTypeTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getContentType_prod.csv'), { header: true }).data;
    })
}
else if (__ENV.DATASOURCE === 'content-services-sitecore9-custom' || __ENV.DATASOURCE === undefined) {
    // console.log('CUSTOM Dict file');
    getContentTypeData = new SharedArray("getContentTypeTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getContentType_custom.csv'), { header: true }).data;
    })
}
else {
    console.log(`Please check your environment and data source. Both should match`);
}

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let GetContentTypeTrend = new Trend('GetContentTypeTrend');
let GetContentTypeError = new Counter('GetContentTypeError');

/////////////////////////////// Get Content Type Starts  /////////////////////////////////////////////

/**
 * Making the hit for Get Content Type endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Get Content Type end point. 
 * The test data is available in getContentType.csv file in test data folder.
 * Then validate the response code is 200 or not. Also it is registering the 
 * response time for each successful hit
 * 
 **/

const getContentType = () => {

    let randomData = getContentTypeData[Math.floor(Math.random() * getContentTypeData.length)];
    const params = {
        contentID: randomData.contentID
    }
    console.log(`randomContentID : ${JSON.stringify(params.contentID)}`);
    let resGet = getCT.GetContentTypeAPI(params.contentID);
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(getContentType.name, responseGet, 200, true, true);
    GetContentTypeTrend.add(responseGet.timings.duration);
    GetContentTypeError.add(!success);
    sleep(Math.random() * thinkTime);
}

/////////////////////////////// Get Content Type ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           DELETE CONTENT TYPE                                                  //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let DeleteContentTypeError = new Counter('DeleteContentTypeError');
let DeleteContentTypeTrend = new Trend('DeleteContentTypeTrend');

/////////////////////////////// Delete Content Type Starts  /////////////////////////////////////////////

/**
 * Making the hit for Delete Content Type endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Delete Content Type end point. 
 * Content ID is created by hitting CreateContentType endpoint and passed as argument 
 * in Delete Content type. Then validate the response code is 200 or not. 
 * Also it is registering the response time for each successful hit
 * 
 **/

const deleteContentType = (id) => {
    let resDelete = delCT.DeleteContentTypeAPI(id);
    let urlDelete = resDelete.URL;
    let headersDelete = resDelete.HEADERS;

    let responseDelete = http.del(urlDelete, null, headersDelete);
    let success = checkStatus(deleteContentType.name, responseDelete, 200, true, true);
    DeleteContentTypeTrend.add(responseDelete.timings.duration);
    DeleteContentTypeError.add(!success);
    sleep(Math.random() * thinkTime);
}

/////////////////////////////// Delete Content Type ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           CREATE EDITORIAL COMPONENT                                           //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const createEditorialComponentData = new SharedArray("createEditorialComponentTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/createEditorialComponent.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let CreateOrUpdateEditorialComponentTrend = new Trend("CreateOrUpdateEditorialComponentTrend");
let CreateOrUpdateEditorialComponentError = new Counter("CreateOrUpdateEditorialComponentError");

///////////////////////////////  Create Editorial Component Starts  ////////////////////////////////

/**
 * Making the hit for Create Editorial Component endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to create editorial component end point. 
 *  The test data is retrived from createEditorialComponent.csv file in Test data folder.
 *  Then validate the response code is 200 or not. Also it is registering the 
 *  response time for each successful hit
 * 
 **/

const createOrUpdateEditorialComponent = () => {
    let randomData = createEditorialComponentData[Math.floor(Math.random() * createEditorialComponentData.length)];
    const params = {
        editorialComponentType: randomData.editorialComponentType
    }
    // console.log(`randomEditorialComponentType : ${JSON.stringify(params.editorialComponentType)}`);
    let res = createEC.CreateOrUpdateEditorialComponentAPI(params.editorialComponentType);
    let url = res.URL;
    let headers = res.HEADERS;
    let body = `${JSON.stringify(res.BODY)}`;

    let responsePut = http.put(url, body, headers);
    let success = checkStatus(createOrUpdateEditorialComponent.name, responsePut, 200, true, true);
    CreateOrUpdateEditorialComponentTrend.add(responsePut.timings.duration);
    CreateOrUpdateEditorialComponentError.add(!success);
    let data = JSON.parse(responsePut['body']);
    let editorialComponentID = data.data.id;
    console.log(`${editorialComponentID}`);
    sleep(Math.random() * thinkTime);

    return editorialComponentID;
}

/////////////////////////////// Create Editorial Component ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           GET EDITORIAL COMPONENT                                              //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
let getEditorialComponentData;
if (__ENV.ENV.toUpperCase() === 'QA' && __ENV.DATASOURCE === 'dotcom-sitecore-qa') {
    //console.log('QA Dict file');
    getEditorialComponentData = new SharedArray("getEditorialComponentTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getEditorialComponent_qa.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'TEST' && __ENV.DATASOURCE === 'dotcom-sitecore-test') {
    //console.log('TEST Dict file');
    getEditorialComponentData = new SharedArray("getEditorialComponentTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getEditorialComponent_test.csv'), { header: true }).data;
    })
}
else if (__ENV.ENV.toUpperCase() === 'PROD' && __ENV.DATASOURCE === 'dotcom-sitecore-prod') {
    //console.log('PROD Dict file');
    getEditorialComponentData = new SharedArray("getEditorialComponentTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getEditorialComponent_prod.csv'), { header: true }).data;
    })
}
else if (__ENV.DATASOURCE === 'content-services-sitecore9-custom' || __ENV.DATASOURCE === undefined) {
    // console.log('CUSTOM Dict file');
    getEditorialComponentData = new SharedArray("getEditorialComponentTestData", function () {
        // Load CSV file and parse it using Papa Parse
        return papaparse.parse(open('../TestData/getEditorialComponent_custom.csv'), { header: true }).data;
    })
}
else {
    console.log(`Please check your environment and data source. Both should match`);
}

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let GetEditorialComponentTrend = new Trend("GetEditorialComponentTrend");
let GetEditorialComponentError = new Counter("GetEditorialComponentError");

/////////////////////////////// Get Editorial Component Starts  /////////////////////////////////////////////

/**
 * Making the hit for Get Editorial Component endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Get editorial component end point. 
 *  The test data is retrived from getEditorialComponent.csv file in Test data folder.
 *  Then validate the response code is 200 or not. Also it is registering the 
 *  response time for each successful hit
 * 
 **/

const getEditorialComponent = () => {
    let randomData = getEditorialComponentData[Math.floor(Math.random() * getEditorialComponentData.length)];
    const params = {
        editorialComponentID: randomData.editorialComponentID
    }
    console.log(`randomEditorialComponentID : ${JSON.stringify(params.editorialComponentID)}`);
    let resGet = getEC.GetEditorialComponentAPI(params.editorialComponentID);
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(getEditorialComponent.name, responseGet, 200, true, true);
    GetEditorialComponentTrend.add(responseGet.timings.duration);
    GetEditorialComponentError.add(!success);
    sleep(Math.random() * thinkTime);
}

/////////////////////////////// Get Editorial Component ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           DELETE EDITORIAL COMPONENT                                           //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let DeleteEditorialComponentTrend = new Trend("DeleteEditorialComponentTrend");
let DeleteEditorialComponentError = new Counter("DeleteEditorialComponentError");

/////////////////////////////// Delete Editorial Component Starts  /////////////////////////////////////////////

/**
 * Making the hit for Delete Editorial Component endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Delete editorial component end point. 
 *  The test data is retrived from createEditorialComponent endpoint.
 *  Then validate the response code is 200 or not. Also it is registering the 
 *  response time for each successful hit
 * 
 **/

const deleteEditorialComponent = (id) => {
    let resDelete = delEC.DeleteEditorialComponentAPI(id);
    let urlDelete = resDelete.URL;
    let headersDelete = resDelete.HEADERS;

    let responseDelete = http.del(urlDelete, null, headersDelete);
    let success = checkStatus(deleteEditorialComponent.name, responseDelete, 200, true, true);
    DeleteEditorialComponentTrend.add(responseDelete.timings.duration);
    DeleteEditorialComponentError.add(!success);
    sleep(Math.random() * thinkTime);
}

/////////////////////////////// Delete Editorial Component ends  /////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           LIST EDITORIAL COMPONENT                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let ListEditorialComponentTrend = new Trend("ListEditorialComponentTrend");
let ListEditorialComponentError = new Counter("ListEditorialComponentError");

///////////////////////////////  List Editorial Component Starts  ///////////////////////////////////
/**
 * Making the hit for List Editorial Component endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to List editorial component end point. 
 *  Then validate the response code is 200 or not. Also it is registering the 
 *  response time for each successful hit
 * 
 **/

const listEditorialComponent = () => {
    let resGet = listEC.ListEditorialComponentAPI();
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(listEditorialComponent.name, responseGet, 200, true, true);
    ListEditorialComponentTrend.add(responseGet.timings.duration);
    ListEditorialComponentError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  List Editorial Component End  ///////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           NAVIGATION                                                           //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const navigationData = new SharedArray("navigationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/navigation.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let NavigationTrend = new Trend("NavigationTrend");
let NavigationError = new Counter("NavigationError");

///////////////////////////////  Navigation Starts  ////////////////////////////////////////

/**
 * Making the hit for Navigation endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to Navigation end point. 
 *  Then validate the response code is 200 or not. Also it is registering the 
 *  response time for each successful hit
 * 
 **/

const navigation = () => {
    let randomData = navigationData[Math.floor(Math.random() * navigationData.length)];
    const params = {
        market: randomData.market
    }
    console.log(`randomMarket : ${JSON.stringify(params.market)}`);
    let resGet = nav.NavigationAPI(params.market);
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(navigation.name, responseGet, 200, true, true);
    NavigationTrend.add(responseGet.timings.duration);
    NavigationError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  Navigation ends  ////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           CAAS CONTENT                                                         //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let CaasContentTrend = new Trend("CaasContentTrend");
let CaasContentError = new Counter("CaasContentError");

///////////////////////////////  CAAS Content Starts  ////////////////////////////////////////

/**
 * Making the hit for CAAS Content endpoint (Content Management Services)
 *
 * Description:
 *            This function is used to send the request to CAAS Content end point. 
 *  Then validate the response code is 200 or not. Also it is registering the 
 *  response time for each successful hit
 * 
 **/

const caasContent = () => {
    let resGet = caas.CAASEndpointAPI();
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(caasContent.name, responseGet, 200, true, true);
    CaasContentTrend.add(responseGet.timings.duration);
    CaasContentError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  CAAS Content ends  ////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           NCD GET DICTIONARY                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////
let NcdGetDictionaryTrend = new Trend("NcdGetDictionaryTrend");
let NcdGetDictionaryError = new Counter("NcdGetDictionaryError");

///////////////////////////////  NCD Get Dictionary Starts  ////////////////////////////////////////

const ncdGetDictionary = () => {
    let resGet = ncdGetDict.NCDGetDictionaryAPI();
    let urlGet = resGet.URL;
    let headersGet = resGet.HEADERS;

    let responseGet = http.get(urlGet, headersGet);
    let success = checkStatus(ncdGetDictionary.name, responseGet, 200, true, true);
    NcdGetDictionaryTrend.add(responseGet.timings.duration);
    NcdGetDictionaryError.add(!success);
    sleep(Math.random() * thinkTime);
}

///////////////////////////////  NCD Get Dictionary ends  ////////////////////////////////////////