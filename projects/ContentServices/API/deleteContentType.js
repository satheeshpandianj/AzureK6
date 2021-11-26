/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const DeleteContentTypeAPI = (ContentID) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.CMDeleteContentTypeEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/content-types/${ContentID}`;

    if (__ENV.DATASOURCE === undefined) {
        url = `${url}?dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}?dataSource=${__ENV.DATASOURCE}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.CMDeleteContentTypeAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    console.log(`DELETE CONTENT TYPE URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    return ReqObject;
};