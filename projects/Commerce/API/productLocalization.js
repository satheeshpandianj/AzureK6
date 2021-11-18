import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';


export const prdtListLocalizationAPI = (Id, Locale) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}product-catalog/products/${Id}/locale/${Locale}/localizations`;

    const headers = {
        headers: {
            'Accept': Constants.PCListLocalizationsAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`COMMERCE PRODUCT CATALOG LIST LOCALIZATIONS URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
