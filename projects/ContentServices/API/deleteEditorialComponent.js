/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const DeleteEditorialComponentAPI = (editorialComponentID) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.DeleteEditorialComponentEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/editorial-components/${editorialComponentID}`;

    if (__ENV.DATASOURCE === undefined) {
        url = `${url}?dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}?dataSource=${__ENV.DATASOURCE}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.CMDeleteEditorialComponentAcceptheader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`DELETE EDITORIAL COMPONENT URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
