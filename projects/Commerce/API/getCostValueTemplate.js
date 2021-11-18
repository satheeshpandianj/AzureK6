import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';


export const GetCostValueTemplateAPI = (Market, Brand, SalesModel, DealerId, CustomerType) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }CostValueTemplates?market=${Market}&brand=${Brand}&salesModel=${SalesModel}&customerType=${CustomerType}`;

    if (DealerId !== 'missing' && DealerId) {
        url += `&parmaPartnerCode=${DealerId}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.FOGetCostValueTemplatesAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    }

    console.log(`COMMERCE GET COST VALUE TEMPLATE URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
