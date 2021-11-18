import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const StockGetSkusAPI = (Id) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.StockKeepingUnitCatalogEndpoint
        }skus/`;

    if (Id !== 'missing') {
        url += Id;
    }

    const headers = {
        headers: {
            'Accept': Constants.SKUGetSkusAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    // console.log(`COMMERCE STOCK CATALOG GET SKUS URL: ${url} HEADER: ${JSON.stringify(headers)} `);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
