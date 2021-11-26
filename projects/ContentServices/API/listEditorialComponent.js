/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const ListEditorialComponentAPI = () => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.ListEditorialComponentEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/editorial-components?Limit=100000`;

    if (__ENV.DATASOURCE === undefined) {
        url = `${url}&dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}&dataSource=${__ENV.DATASOURCE}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.CMListEditorialComponentAcceptheader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`LIST EDITORIAL COMPONENT URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
