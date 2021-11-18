
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
import * as getConfig from '../API/getConfiguration.js';
import * as calcVehicleCost from '../API/calculateVehicleCost.js';
import * as calcWithTemplate from '../API/calculateWithTemplate.js';
import * as cashCalc from '../API/cashCalculation.js';
import * as getCost from '../API/getCostValueTemplate.js';
import * as getPrice from '../API/getPriceTags.js';
import * as leaseCalc from '../API/leaseCalculation.js';
import * as listMarket from '../API/listMarkets.js';
import * as monthlyCalc from '../API/monthlyCalculation.js';
import * as subCalc from '../API/subCalculation.js';
import * as offers from '../API/offers.js';
import * as subFixed from '../API/subFixedCalculation.js';
import * as classifyPrice from '../API/classifyPriceTags.js';
import * as priceList from '../API/pricingListMarkets.js';
import * as priceCalc from '../API/priceCalculation.js';
import * as prdtGet from '../API/productGetMarket.js';
import * as prdtOffers from '../API/productGetOffers.js';
import * as prdtPrdt from '../API/productGetProducts.js';
import * as prdtLocal from '../API/productLocalization.js';
import * as prdtList from '../API/productListMarkets.js';
import * as prdtListOffer from '../API/productListOffers.js';
import * as prdtListprdts from '../API/productListProducts.js';
import * as stockCreate from '../API/stockCreateSimpleSKU.js';
import * as stockGet from '../API/stockGetSKU.js';

/////////////////////////// Global Variables ///////////////////////////////

let thinkTime = 10;

/////////////////////////// API Name Validation ///////////////////////////////

export const validateAPIName = (apiName) => {
    switch (apiName) {
        case ('GETCONFIGURATION'):
            return true;
        case ('CALCULATEVEHICLECOST'):
            return true;
        case ('CALCULATEWITHTEMPLATE'):
            return true;
        case ('CASHCALCULATION'):
            return true;
        case ('GETCOSTVALUETEMPLATE'):
            return true;
        case ('GETPRICETAGS'):
            return true;
        case ('LEASECALCULATION'):
            return true;
        case ('LISTMARKETS'):
            return true;
        case ('MONTHLYCALCULATION'):
            return true;
        case ('SUBCALCULATION'):
            return true;
        case ('SUBFIXEDCALCULATION'):
            return true;
        case ('OFFERS'):
            return true;
        case ('CLASSIFYPRICETAGS'):
            return true;
        case ('PRICINGLISTMARKETS'):
            return true;
        case ('PRICECALCULATION'):
            return true;
        case ('PRODUCTGETMARKET'):
            return true;
        case ('PRODUCTGETOFFERS'):
            return true;
        case ('PRODUCTGETPRODUCTS'):
            return true;
        case ('PRODUCTLISTLOCALIZATION'):
            return true;
        case ('PRODUCTLISTMARKETS'):
            return true;
        case ('PRODUCTLISTOFFERS'):
            return true;
        case ('PRODUCTLISTPRODUCTS'):
            return true;
        case ('STOCKCREATESIMPLESKU'):
            return true;
        case ('STOCKGETSKUS'):
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
    switch (apiName) {
        case ('GETCONFIGURATION'):
            getConfiguration();
            break;
        case ('CALCULATEVEHICLECOST'):
            calculateVehicleCost();
            break;
        case ('CALCULATEWITHTEMPLATE'):
            calculateWithTemplate();
            break;
        case ('CASHCALCULATION'):
            cashCalculation();
            break;
        case ('GETCOSTVALUETEMPLATE'):
            getCostValueTemplate();
            break;
        case ('GETPRICETAGS'):
            getPriceTags();
            break;
        case ('LEASECALCULATION'):
            leaseCalculation();
            break;
        case ('LISTMARKETS'):
            listMarkets();
            break;
        case ('MONTHLYCALCULATION'):
            monthlyCalculation();
            break;
        case ('SUBCALCULATION'):
            subCalculation();
            break;
        case ('SUBFIXEDCALCULATION'):
            subFixedCalculation();
            break;
        case ('OFFERS'):
            offersEndpoint();
            break;
        case ('CLASSIFYPRICETAGS'):
            classifyPriceTags();
            break;
        case ('PRICINGLISTMARKETS'):
            pricingListMarkets();
            break;
        case ('PRICECALCULATION'):
            priceCalculation();
            break;
        case ('PRODUCTGETMARKET'):
            prdtGetMarket();
            break;
        case ('PRODUCTGETOFFERS'):
            prdtGetOffers();
            break;
        case ('PRODUCTGETPRODUCTS'):
            prdtGetProducts();
            break;
        case ('PRODUCTLISTLOCALIZATION'):
            prdtListLocalization();
            break;
        case ('PRODUCTLISTMARKETS'):
            prdtListMarkets();
            break;
        case ('PRODUCTLISTOFFERS'):
            prdtListOffers();
            break;
        case ('PRODUCTLISTPRODUCTS'):
            prdtListProducts();
            break;
        case ('STOCKCREATESIMPLESKU'):
            stockCreateOrGetSimpleSku();
            break;
        case ('STOCKGETSKUS'):
            stockGetSkus();
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
//                            GET CONFIGURATION                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////  CSV Test Data ////////////////////////////////////////
const getConfigurationData = new SharedArray("getConfigurationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/getConfiguration.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let GetConfigurationTrend = new Trend('GetConfigurationTrend');
let GetConfigurationError = new Counter('GetConfigurationError');

///////////////////////////////  Get Configuration Starts  /////////////////////////////////////////////
/**
 * Making the hit for Get Configuration endpoint (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Get Configuration end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const getConfiguration = () => {
    let randomData = getConfigurationData[Math.floor(Math.random() * getConfigurationData.length)];
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        CustomerType: randomData.CustomerType,
        Version: randomData.Version
    }

    // console.log(`Test Data used : ${JSON.stringify(params.Market)} ${JSON.stringify(params.Brand)} ${JSON.stringify(params.CustomerType)} ${JSON.stringify(params.Version, params.Version)}`);
    let resGet = getConfig.GetConfigurationAPI(params.Market, params.Brand, params.CustomerType, params.Version);
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(getConfiguration.name, responseGet, 200, true, true);

    GetConfigurationError.add(!success);

    GetConfigurationTrend.add(responseGet.timings.duration);

    sleep(Math.random() * thinkTime);
}

///////////////////////////////  Get Configuration ends  ////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            CALCULATE VEHICLE COST                                              //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const CalculateVehicleCostData = new SharedArray("calculateVehicleCostTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/calculateVehicleCost.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let CalculateVehicleCostTrend = new Trend('CalculateVehicleCostTrend');
let CalculateVehicleCostError = new Counter('CalculateVehicleCostError');

///////////////////////////////  Calculate Vehicle Cost Starts  /////////////////////////////////////////////
/**
 * Making the hit for Calculate Vehicle Cost endpoint (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Calculate Vehicle Cost end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const calculateVehicleCost = () => {
    let randomData = CalculateVehicleCostData[Math.floor(Math.random() * CalculateVehicleCostData.length)];
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        SalesModel: randomData.SalesModel,
        DealerId: randomData.DealerId,
        ModelYear: randomData.ModelYear,
        VariantCode: randomData.VariantCode,
        CustomerType: randomData.CustomerType,
        VatRate: randomData.VatRate,
        Version: randomData.Version,
        ContractLength: randomData.ContractLength,
        Mileage: randomData.Mileage
    }

    // console.log(`Test Data used : ${JSON.stringify(params.Market)} ${JSON.stringify(params.VariantCode)} ${JSON.stringify(params.Mileage)}`);

    let resPost = calcVehicleCost.CalculateVehicleCostAPI(params.Market, params.Brand, params.SalesModel, params.DealerId, params.ModelYear, params.VariantCode, params.CustomerType, params.VatRate, params.Version, params.ContractLength, params.Mileage);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(body), headers);
    let success = checkStatus(calculateVehicleCost.name, responsePost, 200, true, true);
    // console.log(success);
    CalculateVehicleCostError.add(!success);
    CalculateVehicleCostTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Calculate Vehicle Cost ends  ////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            CALCULATE WITH TEMPLATE                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////// CSV Test Data ///////////////////////////////////////
const CalculateWithTemplateData = new SharedArray("calculateWithTemplateTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/calculateWithTemplate.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let CalculateWithTemplateTrend = new Trend('CalculateWithTemplateTrend');
let CalculateWithTemplateError = new Counter('CalculateWithTemplateError');

///////////////////////////////  Calculate With Template Starts  /////////////////////////////////////////////
/**
 * Making the hit for Calculate With Templateendpoint (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Calculate With Template end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const calculateWithTemplate = () => {
    let randomData = CalculateWithTemplateData[Math.floor(Math.random() * CalculateWithTemplateData.length)];
    console.log('Random Data: ', JSON.stringify(randomData));
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        SalesModel: randomData.SalesModel,
        DealerId: randomData.DealerId,
        ModelYear: randomData.ModelYear,
        VariantCode: randomData.VariantCode,
        CustomerType: randomData.CustomerType,
        Version: randomData.Version,
    }

    // console.log(`Test Data used : ${JSON.stringify(params.Market)} ${JSON.stringify(params.SalesModel)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.ModelYear)} ${JSON.stringify(params.VariantCode)}`);

    let resPost = calcWithTemplate.CalculateWithTemplateAPI(params.Market, params.Brand, params.SalesModel, params.DealerId, params.ModelYear, params.VariantCode, params.CustomerType, params.Version);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(body), headers);
    let success = checkStatus(calculateWithTemplate.name, responsePost, 200, true, true);
    // console.log(success);
    CalculateWithTemplateError.add(!success);
    CalculateWithTemplateTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Calculate With Template ends  ////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            CASH CALCULATION                                                    //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// Cash Calculation CSV Test Data ///////////////////////////////////////
const CashCalculationData = new SharedArray("cashCalculationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/cashCalculation.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let CashCalculationTrend = new Trend('CashCalculationTrend');
let CashCalculationError = new Counter('CashCalculationError');

///////////////////////////////  Cash Calculation Starts  /////////////////////////////////////////////
/**
 * Making the hit for Cash Calculation (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Cash Calculation end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const cashCalculation = () => {
    let randomData = CashCalculationData[Math.floor(Math.random() * CashCalculationData.length)];
    console.log('Random Data: ', JSON.stringify(randomData));
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        DealerId: randomData.DealerId,
        ModelYear: randomData.ModelYear,
        VariantCode: randomData.VariantCode,
        CustomerType: randomData.CustomerType,
        Version: randomData.Version,
    }

    // console.log(`Test Data used : ${JSON.stringify(params.Market)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.ModelYear)} ${JSON.stringify(params.VariantCode)}`);

    let resPost = cashCalc.CashCalculationAPI(params.Market, params.Brand, params.DealerId, params.ModelYear, params.VariantCode, params.CustomerType, params.Version);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(body), headers);
    let success = checkStatus(cashCalculation.name, responsePost, 200, true, true);
    // console.log(success);
    CashCalculationError.add(!success);
    CashCalculationTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Cash Calculation ends  ////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            GET COST VALUE TEMPLATE                                             //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////  CSV Test Data ///////////////////////////////////////
const GetCostValueTemplateData = new SharedArray("getCostValueTemplateTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/getCostValueTemplate.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let GetCostValueTemplateTrend = new Trend('GetCostValueTemplateTrend');
let GetCostValueTemplateError = new Counter('GetCostValueTemplateError');

///////////////////////////////  Get Cost Value Template Starts  /////////////////////////////////////////////
/**
 * Making the hit for Get Cost Value Template (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Get Cost Value Template end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const getCostValueTemplate = () => {
    let randomData = GetCostValueTemplateData[Math.floor(Math.random() * GetCostValueTemplateData.length)];
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        SalesModel: randomData.SalesModel,
        DealerId: randomData.DealerId,
        CustomerType: randomData.CustomerType,
    }

    console.log(`Test Data used: ${JSON.stringify(params.Market)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.SalesModel)} ${JSON.stringify(params.CustomerType)}`);

    let resGet = getCost.GetCostValueTemplateAPI(params.Market, params.Brand, params.SalesModel, params.DealerId, params.CustomerType);
    let url = resGet.URL;
    let headers = resGet.HEADERS;
    let body = resGet.BODY;

    let responseGet = http.get(url, headers);
    let success = checkStatus(getCostValueTemplate.name, responseGet, 200, true, true);
    // console.log(success);
    GetCostValueTemplateError.add(!success);
    GetCostValueTemplateTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Get Cost Value Template ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            GET PRICE TAGS                                                      //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const GetPriceTagData = new SharedArray("getPriceTagTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/getPriceTag.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let GetPriceTagTrend = new Trend('GetPriceTagTrend');
let GetPriceTagError = new Counter('GetPriceTagError');

///////////////////////////////  Get Price Tags Starts  /////////////////////////////////////////////
/**
 * Making the hit for Get Price Tags (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Get Price Tags end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const getPriceTags = () => {
    let randomData = GetPriceTagData[Math.floor(Math.random() * GetPriceTagData.length)];

    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        SalesModel: randomData.SalesModel,
        DealerId: randomData.DealerId,
        CustomerType: randomData.CustomerType,
    }

    console.log(`Data is ${JSON.stringify(params.Market)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.SalesModel)} ${JSON.stringify(params.CustomerType)}`);

    let resGet = getPrice.GetPriceTagsAPI(params.Market, params.Brand, params.SalesModel, params.DealerId, params.CustomerType);
    let url = resGet.URL;
    let headers = resGet.HEADERS;
    let body = resGet.BODY;

    let responseGet = http.get(url, headers);
    let success = checkStatus(getPriceTags.name, responseGet, 200, true, true);
    // console.log(success);
    GetPriceTagError.add(!success);
    GetPriceTagTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Get Price Tags ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            LEASE CALCULATION                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const LeaseCalculationData = new SharedArray("leaseCalculationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/leaseCalculation.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let LeaseCalculationTrend = new Trend('LeaseCalculationTrend');
let LeaseCalculationError = new Counter('LeaseCalculationError');


///////////////////////////////  Lease Calculation Starts  /////////////////////////////////////////////
/**
 * Making the hit for Lease Calculation (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Lease Calculation end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const leaseCalculation = () => {
    let randomData = LeaseCalculationData[Math.floor(Math.random() * LeaseCalculationData.length)];

    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        DealerId: randomData.DealerId,
        ModelYear: randomData.ModelYear,
        VariantCode: randomData.VariantCode,
        CustomerType: randomData.CustomerType,
        Version: randomData.Version
    }

    console.log(`Test Data used : ${JSON.stringify(params.Market)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.ModelYear)} ${JSON.stringify(params.CustomerType)}`);

    let resPost = leaseCalc.LeaseCalculationAPI(params.Market, params.Brand, params.DealerId, params.ModelYear, params.VariantCode, params.CustomerType, params.Version);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(body), headers);
    let success = checkStatus(leaseCalculation.name, responsePost, 200, true, true);
    // console.log(success);
    LeaseCalculationError.add(!success);
    LeaseCalculationTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Lease Calculation ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            LIST MARKETS                                                        //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let ListMarketsTrend = new Trend('ListMarketsTrend');
let ListMarketsError = new Counter('ListMarketsError');

///////////////////////////////  List Markets Starts  /////////////////////////////////////////////
/**
 * Making the hit for List Markets (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to List Markets end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const listMarkets = () => {
    let resGet = listMarket.ListMarketsAPI();
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(listMarkets.name, responseGet, 200, true, true);
    // console.log(success);
    ListMarketsError.add(!success);
    ListMarketsTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  List Markets ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            MONTHLY CALCULATION                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const MonthlyCalculationData = new SharedArray("monthlyCalculationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/monthlyCalculation.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let MonthlyCalculationTrend = new Trend('MonthlyCalculationTrend');
let MonthlyCalculationError = new Counter('MonthlyCalculationError');

///////////////////////////////  Monthly Calculation Starts  /////////////////////////////////////////////
/**
 * Making the hit for Monthly Calculation (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Monthly Calculation end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const monthlyCalculation = () => {
    let randomData = MonthlyCalculationData[Math.floor(Math.random() * MonthlyCalculationData.length)];
    // console.log('Random Data: ', JSON.stringify(randomData));

    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        DealerId: randomData.DealerId,
        ModelYear: randomData.ModelYear,
        VariantCode: randomData.VariantCode,
        CustomerType: randomData.CustomerType,
        SalesModel: randomData.SalesModel,
        Version: randomData.Version,
        ContractLength: randomData.ContractLength,
        Mileage: randomData.Mileage,
    }

    console.log(`Test Data used : ${JSON.stringify(params.Market)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.ModelYear)} ${JSON.stringify(params.CustomerType)} ${JSON.stringify(params.SalesModel)} ${JSON.stringify(params.Mileage)} `);

    let resPost = monthlyCalc.MonthlyCalculationAPI(params.Market, params.Brand, params.DealerId, params.ModelYear, params.VariantCode, params.CustomerType, params.SalesModel, params.Version, params.ContractLength, params.Mileage);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(body), headers);
    let success = checkStatus(monthlyCalculation.name, responsePost, 200, true, true);
    // console.log(success);
    MonthlyCalculationError.add(!success);
    MonthlyCalculationTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Monthly Calculation ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            SUB CALCULATION                                                     //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const SubCalculationData = new SharedArray("subCalculationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/subCalculation.csv'), { header: true }).data;
})


////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let SubCalculationTrend = new Trend('SubCalculationTrend');
let SubCalculationError = new Counter('SubCalculationError');

///////////////////////////////  Sub Loan Calculation Starts  /////////////////////////////////////////////
/**
 * Making the hit for Sub Loan Calculation (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Sub Loan Calculation end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const subCalculation = () => {
    let randomData = SubCalculationData[Math.floor(Math.random() * SubCalculationData.length)];

    //Market,Brand,DealerId,ModelYear,VariantCode,CustomerType,Version
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        DealerId: randomData.DealerId,
        ModelYear: randomData.ModelYear,
        VariantCode: randomData.VariantCode,
        CustomerType: randomData.CustomerType,
        Version: randomData.Version,
    };

    console.log(`Test data used : ${JSON.stringify(params.Market)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.ModelYear)} ${JSON.stringify(params.CustomerType)}`);

    let resPost = subCalc.SubCalculationAPI(params.Market, params.Brand, params.DealerId, params.ModelYear, params.VariantCode, params.CustomerType, params.Version);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(body), headers);
    let success = checkStatus(subCalculation.name, responsePost, 200, true, true);
    // console.log(success);
    SubCalculationError.add(!success);
    SubCalculationTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Sub Calculation ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            OFFERS                                                              //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const offersData = new SharedArray("offersTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/offers.csv'), { header: true }).data;
})


////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let offersTrend = new Trend('offersTrend');
let offersError = new Counter('offersError');

///////////////////////////////  Offers Starts  /////////////////////////////////////////////
/**
 * Making the hit for Offers (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Offers end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const offersEndpoint = () => {
    let randomData = offersData[Math.floor(Math.random() * offersData.length)];

    //Market,Brand,SalesModel,Language
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        SalesModel: randomData.SalesModel,
        Language: randomData.Language,
    };

    console.log(`Test data used : ${JSON.stringify(params.Market)} ${JSON.stringify(params.Brand)} ${JSON.stringify(params.SalesModel)} ${JSON.stringify(params.Language)}`);

    let resGet = offers.OffersAPI(params.Market, params.Brand, params.SalesModel, params.Language);
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);

    let success = checkStatus(offersEndpoint.name, responseGet, 200, true, true);

    offersError.add(!success);
    offersTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Offers ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            SUB FIXED CALCULATION                                               //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const SubFixedCalculationData = new SharedArray("subFixedCalculationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/subFixedCalculation.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let SubFixedCalculationTrend = new Trend('SubFixedCalculationTrend');
let SubFixedCalculationError = new Counter('SubFixedCalculationError');


///////////////////////////////  Sub Fixed Calculation Starts  /////////////////////////////////////////////
/**
 * Making the hit for Sub Fixed Calculation (Commerce Financial Options)
 *
 * Description:
 *            This function is used to send the request to Sub Fixed Calculation end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const subFixedCalculation = () => {
    let randomData = SubFixedCalculationData[Math.floor(Math.random() * SubFixedCalculationData.length)];

    //Market,Brand,DealerId,ModelYear,VariantCode,CustomerType,Version
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        DealerId: randomData.DealerId,
        ModelYear: randomData.ModelYear,
        VariantCode: randomData.VariantCode,
        CustomerType: randomData.CustomerType,
        Version: randomData.Version,
    };

    console.log(`Test data used: ${JSON.stringify(params.Market)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.ModelYear)} ${JSON.stringify(params.CustomerType)}`);

    let resPost = subFixed.SubFixedCalculationAPI(params.Market, params.Brand, params.DealerId, params.ModelYear, params.VariantCode, params.CustomerType, params.Version);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(body), headers);
    let success = checkStatus(subFixedCalculation.name, responsePost, 200, true, true);
    // console.log(success);
    SubFixedCalculationError.add(!success);
    SubFixedCalculationTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Sub Fixed Calculation ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            CLASSIFY PRICE TAGS                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// Tag CSV Test Data ///////////////////////////////////////
const classifyPriceTagsData = new SharedArray("classifyPriceTagsTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/classifyPriceTags.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let classifyPriceTagsTrend = new Trend('classifyPriceTagsTrend');
let classifyPriceTagsError = new Counter('classifyPriceTagsError');

///////////////////////////////  Classify Price Tags Starts  /////////////////////////////////////////////
/**
 * Making the hit for Classify Price Tags 
 *
 * Description:
 *            This function is used to send the request to Classify Price Tags end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const classifyPriceTags = () => {
    let randomData = classifyPriceTagsData[Math.floor(Math.random() * classifyPriceTagsData.length)];

    //Market,Brand,SalesModel,ModelYear,VariantCode,DealerId,CustomerType,PriceTagId
    const params = {
        Market: randomData.Market,
        Brand: randomData.Brand,
        SalesModel: randomData.SalesModel,
        ModelYear: randomData.ModelYear,
        VariantCode: randomData.VariantCode,
        DealerId: randomData.DealerId,
        CustomerType: randomData.CustomerType,
        PriceTagId: randomData.PriceTagId
    };

    console.log(`Test data used: ${JSON.stringify(params.Market)} ${JSON.stringify(params.Brand)} ${JSON.stringify(params.DealerId)} ${JSON.stringify(params.PriceTagId)}`);

    let resPut = classifyPrice.ClassifyPriceTagsAPI(params.Market, params.Brand, params.DealerId, params.ModelYear, params.VariantCode, params.CustomerType);
    let url = resPut.URL;
    let headers = resPut.HEADERS;
    let body = resPut.BODY;

    let responsePut = http.put(url, JSON.stringify(body), headers);
    let success = checkStatus(classifyPriceTags.name, responsePut, 200, true, true);
    // console.log(success);
    classifyPriceTagsError.add(!success);
    classifyPriceTagsTrend.add(responsePut.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Classify Price Tags ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRICING LIST MARKETS                                                //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let priceListMarketsTrend = new Trend('priceListMarketsTrend');
let priceListMarketsError = new Counter('priceListMarketsError');


///////////////////////////////  Pricing List Market Starts  /////////////////////////////////////////////
/**
 * Making the hit for List Markets 
 *
 * Description:
 *            This function is used to send the request to List Markets end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const pricingListMarkets = () => {
    let resGet = priceList.PricingListMarketsAPI();
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(pricingListMarkets.name, responseGet, 200, true, true);
    // console.log(success);
    priceListMarketsError.add(!success);
    priceListMarketsTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Pricing List Market ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRICE CALCULATION                                                   //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const priceCalculationData = new SharedArray("priceCalculationTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/priceCalculation.csv'), { header: true }).data;
})

let temp;
let requestFileName = priceCalculationData[Math.floor(Math.random() * priceCalculationData.length)]['requestFileName'];
console.log('requestFileName: ', JSON.stringify(requestFileName));

if (__ENV.ENV.toUpperCase() === 'QA' && requestFileName === "NO_XC40_CASH") {
    temp = JSON.parse(open('../TestData/NO_XC40_CASH_QA.json'));
    // console.log(`Temp is : ${JSON.stringify(temp)}`);
}
else if (__ENV.ENV.toUpperCase() === 'TEST' && requestFileName === "NO_XC40_CASH") {
    temp = JSON.parse(open('../TestData/NO_XC40_CASH_TEST.json'));
    // console.log(`Temp is : ${JSON.stringify(temp)}`);
}
else if (__ENV.ENV.toUpperCase() === 'QA' && requestFileName === "NO_XC40_SUB_FIXED") {
    temp = JSON.parse(open('../TestData/NO_XC40_SUB_FIXED_QA.json'));
    // console.log(`Temp is : ${JSON.stringify(temp)}`);
}
else if (__ENV.ENV.toUpperCase() === 'TEST' && requestFileName === "NO_XC40_SUB_FIXED") {
    temp = JSON.parse(open('../TestData/NO_XC40_SUB_FIXED_TEST.json'));
    // console.log(`Temp is : ${JSON.stringify(temp)}`);
}
else {
    console.log('Invalid Body request file for Pricing Catalog - Pricing Calculation');
}

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////


let priceCalculationTrend = new Trend('priceCalculationTrend');
let priceCalculationError = new Counter('priceCalculationError');

///////////////////////////////  Price Calculation Starts  /////////////////////////////////////////////
/**
 * Making the hit for Price Calculation 
 *
 * Description:
 *            This function is used to send the request to Price Calculation end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const priceCalculation = () => {

    let resPost = priceCalc.PriceCalculationAPI(temp);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(temp), headers);
    let success = checkStatus(priceCalculation.name, responsePost, 200, true, true);
    // console.log(success);
    priceCalculationError.add(!success);
    priceCalculationTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Price Calculation ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRODUCT GET MARKET                                                  //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let prdtGetMarketTrend = new Trend('prdtGetMarketTrend');
let prdtGetMarketError = new Counter('prdtGetMarketError');

///////////////////////////////  Product Get Market Starts  /////////////////////////////////////////////
/**
 * Making the hit for Get Market 
 *
 * Description:
 *            This function is used to send the request to Get Market end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const prdtGetMarket = () => {
    let resGet = prdtGet.prdtGetMarketAPI('DE');
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(prdtGetMarket.name, responseGet, 200, true, true);
    // console.log(success);
    prdtGetMarketError.add(!success);
    prdtGetMarketTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Product Get Market ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRODUCT GET MARKET                                                  //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const prdtGetOffersData = new SharedArray("prdtGetOffersTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/prdtGetOffers.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let prdtGetOffersTrend = new Trend('prdtGetOffersTrend');
let prdtGetOffersError = new Counter('prdtGetOffersError');


///////////////////////////////  Get Market Starts  /////////////////////////////////////////////
/**
 * Making the hit for Product Get Offers
 *
 * Description:
 *            This function is used to send the request to Product Get Offers end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const prdtGetOffers = () => {
    let params;
    let randomData = prdtGetOffersData[Math.floor(Math.random() * prdtGetOffersData.length)];

    if (__ENV.ENV.toUpperCase() === 'QA') {
        params = {
            Id: randomData.qaId
        }
        console.log('IF : ', JSON.stringify(params));
    }
    else {
        params = {
            Id: randomData.testId
        }
        console.log('ELSE : ', JSON.stringify(params));
    }
    let resGet = prdtOffers.prdtGetOffersAPI(params.Id);
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(prdtGetOffers.name, responseGet, 200, true, true);
    // console.log(success);
    prdtGetOffersError.add(!success);
    prdtGetOffersTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Product Get Offers ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRODUCT GET PRODUCT                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const prdtGetProductsData = new SharedArray("prdtGetProductsTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/prdtGetProducts.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let prdtGetProductsTrend = new Trend('prdtGetProductsTrend');
let prdtGetProductsError = new Counter('prdtGetProductsError');

///////////////////////////////  Product Get Products Starts  /////////////////////////////////////////////
/**
 * Making the hit for Product Get Products
 *
 * Description:
 *            This function is used to send the request to Product Get Products end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const prdtGetProducts = () => {
    let params;
    let randomData = prdtGetProductsData[Math.floor(Math.random() * prdtGetProductsData.length)];
    console.log('randomData: ', JSON.stringify(randomData));
    if (__ENV.ENV.toUpperCase() === 'QA') {
        params = {
            Id: randomData.qaId
        }
        console.log('IF : ', JSON.stringify(params));
    }
    else {
        params = {
            Id: randomData.testId
        }
        console.log('ELSE : ', JSON.stringify(params));
    }
    let resGet = prdtPrdt.prdtGetProductsAPI(params.Id);
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(prdtGetProducts.name, responseGet, 200, true, true);
    // console.log(success);
    prdtGetProductsError.add(!success);
    prdtGetProductsTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Product Get Products ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRODUCT LIST LOCALIZATION                                           //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////  CSV Test Data ///////////////////////////////////////
const prdtListLocalizationsData = new SharedArray("prdtListLocalizationsTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/prdtListLocalizations.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let prdtListLocalizationsTrend = new Trend('prdtListLocalizationsTrend');
let prdtListLocalizationsError = new Counter('prdtListLocalizationsError');


///////////////////////////////  Product List Localizations Starts  /////////////////////////////////////////////
/**
 * Making the hit for Product List Localizations
 *
 * Description:
 *            This function is used to send the request to Product List Localizations end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const prdtListLocalization = () => {
    let params;
    let randomData = prdtListLocalizationsData[Math.floor(Math.random() * prdtListLocalizationsData.length)];

    if (__ENV.ENV.toUpperCase() === 'QA') {
        params = {
            Id: randomData.qaId,
            locale: randomData.locale
        }
    }
    else {
        params = {
            Id: randomData.testId,
            locale: randomData.locale
        }
    }
    let resGet = prdtLocal.prdtListLocalizationAPI(params.Id, params.locale);
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(prdtListLocalization.name, responseGet, 200, true, true);
    // console.log(success);
    prdtListLocalizationsError.add(!success);
    prdtListLocalizationsTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Product List Localizations ends  ////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRODUCT LIST MARKETS                                                //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let prdtListMarketsTrend = new Trend('prdtListMarketsTrend');
let prdtListMarketsError = new Counter('prdtListMarketsError');

///////////////////////////////  Product List Markets Starts  /////////////////////////////////////////////
/**
 * Making the hit for Product List Markets
 *
 * Description:
 *            This function is used to send the request to Product List Markets end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const prdtListMarkets = () => {
    let resGet = prdtList.prdtListMarketsAPI();
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(prdtListMarkets.name, responseGet, 200, true, true);
    // console.log(success);
    prdtListMarketsError.add(!success);
    prdtListMarketsTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Product List Markets ends  ////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRODUCT LIST OFFERS                                                 //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// CSV Test Data ///////////////////////////////////////
const prdtListOffersData = new SharedArray("prdtListOffersTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/prdtListOffers.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let prdtListOffersTrend = new Trend('prdtListOffersTrend');
let prdtListOffersError = new Counter('prdtListOffersError');

///////////////////////////////  Product List Offers Starts  /////////////////////////////////////////////
/**
 * Making the hit for Product List Offers
 *
 * Description:
 *            This function is used to send the request to Product List Offers end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const prdtListOffers = () => {
    let randomData = prdtListOffersData[Math.floor(Math.random() * prdtListOffersData.length)];

    const params = {
        market: randomData.market,
        brand: randomData.brand,
        salesmodel: randomData.salesmodel,
        customertype: randomData.customertype
    }

    let resGet = prdtListOffer.prdtListOffersAPI(params.market, params.brand, params.salesmodel, params.customertype);
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(prdtListOffers.name, responseGet, 200, true, true);
    // console.log(success);
    prdtListOffersError.add(!success);
    prdtListOffersTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Product List Offers ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            PRODUCT LIST PRODUCTS                                               //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// Product List Products CSV Test Data ///////////////////////////////////////
const prdtListProductsData = new SharedArray("prdtListProductsTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/prdtListProducts.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let prdtListProductsTrend = new Trend('prdtListProductsTrend');
let prdtListProductsError = new Counter('prdtListProductsError');

///////////////////////////////  Product List Products Starts  /////////////////////////////////////////////
/**
 * Making the hit for Product List Products
 *
 * Description:
 *            This function is used to send the request to Product List Products end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const prdtListProducts = () => {
    let randomData = prdtListProductsData[Math.floor(Math.random() * prdtListProductsData.length)];

    //market,brand,skiprelation,tags,type,timestamp
    const params = {
        market: randomData.market,
        brand: randomData.brand,
        skiprelation: randomData.skiprelation,
        tags: randomData.tags,
        type: randomData.type,
        timestamp: randomData.timestamp
    }

    let resGet = prdtListprdts.prdtListProductsAPI(params.market, params.brand, params.skiprelation, params.tags, params.type);
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(prdtListProducts.name, responseGet, 200, true, true);
    // console.log(success);
    prdtListProductsError.add(!success);
    prdtListProductsTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Product List Products ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                           STOCK CREATE SIMPLE SKU                                              //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// Stock Get SKUS CSV Test Data ///////////////////////////////////////
const stockCreateSimpleSkusData = new SharedArray("stockCreateSimpleSkusTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/stockCreateSkus.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let stockCreateOrGetSimpleSkuTrend = new Trend('stockCreateOrGetSimpleSkuTrend');
let stockCreateOrGetSimpleSkuError = new Counter('stockCreateOrGetSimpleSkuError');

///////////////////////////////  Create or Get Simple SKU Starts  /////////////////////////////////////////////
/**
 * Making the hit for Create or Get Simple SKU
 *
 * Description:
 *            This function is used to send the request to Create or Get Simple SKU end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const stockCreateOrGetSimpleSku = () => {
    let params;
    let randomData = stockCreateSimpleSkusData[Math.floor(Math.random() * stockCreateSimpleSkusData.length)];

    //market,brand,skiprelation,tags,type,timestamp
    if (__ENV.ENV.toUpperCase() === 'QA') {
        params = {
            Id: randomData.qaId,
        }
    }
    if (__ENV.ENV.toUpperCase() === 'TEST') {
        params = {
            Id: randomData.testId,
        }
    }
    let resPost = stockCreate.StockCreateOrGetSimpleSkuAPI(params.Id);
    let url = resPost.URL;
    let headers = resPost.HEADERS;
    let body = resPost.BODY;

    let responsePost = http.post(url, JSON.stringify(temp), headers);
    let success = checkStatus(stockCreateOrGetSimpleSku.name, responsePost, 200, true, true);
    // console.log(success);
    stockCreateOrGetSimpleSkuError.add(!success);
    stockCreateOrGetSimpleSkuTrend.add(responsePost.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Create or Get Simple SKU ends  ////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
//                            STOCK GET SKUs                                                      //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////// Stock Get SKUS CSV Test Data ///////////////////////////////////////
const stockGetSkusData = new SharedArray("stockGetSkusTestData", function () {
    // Load CSV file and parse it using Papa Parse
    return papaparse.parse(open('../TestData/stockGetSkus.csv'), { header: true }).data;
})

////////////////////////////  Error and Response Time Calculation Variable  ////////////////////////

let stockGetSkusTrend = new Trend('stockGetSkus');
let stockGetSkusError = new Counter('stockGetSkusError');

///////////////////////////////  Stock Get SKUS Starts  /////////////////////////////////////////////
/**
 * Making the hit for Stock Get SKUS
 *
 * Description:
 *            This function is used to send the request to Stock Get SKUS end point. Then validate
 *  the response code is 200 or not. Also it is registering the response time for each successful
 *  hit
 * 
 **/

const stockGetSkus = () => {
    let params;
    let randomData = stockGetSkusData[Math.floor(Math.random() * stockGetSkusData.length)];

    //market,brand,skiprelation,tags,type,timestamp
    if (__ENV.ENV.toUpperCase() === 'QA') {
        params = {
            Id: randomData.qaId,
        }
    }
    if (__ENV.ENV.toUpperCase() === 'TEST') {
        params = {
            Id: randomData.testId,
        }
    }
    let resGet = stockGet.StockGetSkusAPI(params.Id);
    let url = resGet.URL;
    let headers = resGet.HEADERS;

    let responseGet = http.get(url, headers);
    let success = checkStatus(stockGetSkus.name, responseGet, 200, true, true);
    // console.log(success);
    stockGetSkusError.add(!success);
    stockGetSkusTrend.add(responseGet.timings.duration);
    sleep(Math.random() * thinkTime);

}

///////////////////////////////  Stock Get SKUS ends  ////////////////////////////////
