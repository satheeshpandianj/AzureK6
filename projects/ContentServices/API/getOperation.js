/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const GetOperationAPI = (id) => {
    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) + Constants.CMGetOperationEndpoint
        }/operations/${id}`;

    const headers = {
        headers: {
            'Accept': Constants.CMGetOperationAcceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`GET OPERATION URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
