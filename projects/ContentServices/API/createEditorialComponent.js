/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const CreateOrUpdateEditorialComponentAPI = (randomEditorialComponentType) => {
    const EditorialComponentID = `${Utils.GetRandomString(7)}`;
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.CreateOrUpdateEditorialComponentEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/editorial-components/${EditorialComponentID}`;

    if (__ENV.DATASOURCE === undefined) {
        url = `${url}?dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}?dataSource=${__ENV.DATASOURCE}`;
    }

    const headers = {
        headers: {
            'Accept': Constants.CMCreateOrUpdateEditorialComponentAcceptheader,
            'Content-Type': Constants.CMCreateOrUpdateEditorialComponentContentTypeHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    const body = {
        renderingParams: [
            {
                id: EditorialComponentID,
                type: randomEditorialComponentType,
                name: randomEditorialComponentType,
                helpText: null,
                required: false,
                localized: false
            },
        ],
        name: 'ImageList',
        namespace: 'Delete.this',
        fields: [
            {
                id: EditorialComponentID,
                type: 'ShortText',
                name: 'Title',
                helpText: null,
                required: true,
                localized: true,
            },
        ],
    };

    // console.log(`CREATE OR UPDATE EDITORIAL COMPONENT URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
