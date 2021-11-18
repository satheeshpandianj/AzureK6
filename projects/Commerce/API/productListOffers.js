import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let skipRelations;

export const prdtListOffersAPI = (Market, Brand, SalesModel, CustomerType) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}product-catalog/offers?market=${Market
        }&salesModel=${SalesModel}&brand=${Brand}&customerType=${CustomerType
        }`;
    if (skipRelations) {
        url += `&skipRelations=${skipRelations}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.PCListOffersAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`COMMERCE PRODUCT CATALOG LIST OFFERS URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
