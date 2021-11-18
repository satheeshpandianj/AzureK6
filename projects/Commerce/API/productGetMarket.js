import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const prdtGetMarketAPI = (Market) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}product-catalog/markets/`;

    if (Market !== 'missing') {
        url += Market;
    }

    const headers = {
        headers: {
            'Accept': Constants.PCGetMarketAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`COMMERCE PRODUCT CATALOG GET MARKET URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
