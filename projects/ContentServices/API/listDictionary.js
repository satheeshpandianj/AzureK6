/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const ListDictionaryAPI = () => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.CMListDictionariesEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/dictionaries?Limit=100000`;

    if (__ENV.DATASOURCE === undefined) {
        url = `${url}&dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}&dataSource=${__ENV.DATASOURCE}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.CMListDictionariesAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`LIST DICTIONARIES URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};

