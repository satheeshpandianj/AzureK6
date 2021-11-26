import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const NCDGetDictionaryAPI = () => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.NewCDGetDictionaryEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/dictionaries/${Constants.NewCDCanonicalDictionaryName}`;

    if (__ENV.DATASOURCE === undefined) {
        url = `${url}?dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}?dataSource=${__ENV.DATASOURCE}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.NewCDGetDictionaryAcceptheader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`NEW CONTENT DELIVERY GET DICTIONARY URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};