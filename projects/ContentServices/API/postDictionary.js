/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const postDictionaryAPI = () => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.CMPostDictionaryEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/dictionaries`;

    //${Utils.GetDataSource(__ENV.ENV.toUpperCase())}
    if (__ENV.DATASOURCE === undefined) {
        url = `${url}?dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}?dataSource=${__ENV.DATASOURCE}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.CMPostDictionaryAcceptHeader,
            'Content-Type': Constants.CMPostDictionaryContentTypeHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    const body = {
        name: Utils.GetRandomString(7),
        namespace: Constants.namespace,
    };

    console.log(`URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};

