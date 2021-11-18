import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const GetPriceTagsAPI = (Market, Brand, SalesModel, DealerId, CustomerType) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }pricetags?market=${Market}&brand=${Brand}&salesModel=${SalesModel}`;

    if (DealerId !== 'missing' && DealerId) {
        url += `&dealerId=${DealerId}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.FOGetPriceTagAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    }

    console.log(`COMMERCE GET PRICE TAG URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
