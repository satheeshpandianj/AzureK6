import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const PriceCalculationAPI = (temp) => {
    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.PricingCatalogEndpoint
        }price-calculations`;

    const headers = {
        headers: {
            'Accept': Constants.PricingCatalogPriceCalculationsAcceptHeader,
            'Content-Type': Constants.PricingCatalogPriceCalculationsContentTypeHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    const body = temp;
    console.log(`COMMERCE PRICING CATALOG PRICE CALCULATION URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};