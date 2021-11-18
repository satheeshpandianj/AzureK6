import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const prdtGetProductsAPI = (Id) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}product-catalog/products/`;

    if (Id !== 'missing') {
        url += `${Id || Id}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.PCGetProductAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`COMMERCE PRODUCT CATALOG GET PRODUCTS URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
