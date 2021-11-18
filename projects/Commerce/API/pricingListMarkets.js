import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let requestBody = undefined;

export const PricingListMarketsAPI = (Market, Brand, DealerId, ModelYear, VariantCode, CustomerType) => {
    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.PricingCatalogEndpoint
        }markets`;

    const headers = {
        headers: {
            'Accept': Constants.PricingCatalogListMarketsAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`COMMERCE PRICING CATALOG LIST MARKET URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};

