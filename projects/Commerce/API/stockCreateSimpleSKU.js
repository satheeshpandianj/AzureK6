import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';


export const StockCreateOrGetSimpleSkuAPI = (Id) => {
    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.StockKeepingUnitCatalogEndpoint
        }rpc/simple-sku`;

    const headers = {
        headers: {
            'Accept': Constants.SKUSimpleSkuAcceptHeader,
            'Content-Type': Constants.SKUSimpleSkuContentTypeHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    const body = {
        "skuCategory": "Insurance",
        "sku": Id
    };


    console.log(`COMMERCE STOCK CATALOG CREATE OR GET SIMPLE SKU URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
