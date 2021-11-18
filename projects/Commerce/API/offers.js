/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';


let language;

export const OffersAPI = (Market, Brand, SalesModel, Language) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.OffersEndpoint}${Market}?brand=${Brand}&salesModel=${SalesModel}`;

    if (language === undefined) {
        url += `&language=${Language}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.OffersGetOffersAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    }

    console.log(`COMMERCE OFFERS URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};