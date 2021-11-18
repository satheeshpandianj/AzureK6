import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';


export const prdtListProductsAPI = (Market, Brand, SkipRelations, Tags, Type) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}product-catalog/products?`;

    if (Market) {
        url += `&market=${Market}`;
    }

    if (Brand) {
        url += `&brand=${Brand}`;
    }

    // if (Tags) {
    //     url += `&tags=${Tags}`;
    // }

    // if (Type) {
    //     url += `& type=${Type} `;
    // }

    // if (ValidAt) {
    //     url += `& validAt=${ ValidAt.toISOString().substring(0, 19) } `;
    // }

    if (SkipRelations) {
        url += `&skipRelations=${SkipRelations} `;
    }

    url = url.replace('&', '');
    const headers = {
        headers: {
            'Accept': Constants.PCListProductsAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`COMMERCE PRODUCT CATALOG LIST PRODUCTS URL: ${url} HEADER: ${JSON.stringify(headers)} `);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        METHOD: 'GET'
    };

    return ReqObject;
};
