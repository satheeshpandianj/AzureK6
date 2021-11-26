/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const CreateOrUpdateContentTypeAPI = (ContentType, RequiredStatus, LocalizedStatus) => {
    const ContentID = `sampleApplication_${Utils.GetRandomString(7)}`;
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.CMCreateOrUpdateContentTypeEndpoint +
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
            'Accept': Constants.CMCreateOrUpdateContentTypeAcceptHeader,
            'Content-Type': Constants.CMCreateOrUpdateContentTypeContentTypetHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    const body = {
        name: ContentID,
        namespace: Constants.CMContentTypeNameSpace,
        fields: [
            {
                id: ContentType,
                type: ContentType,
                name: ContentType,
                richTextType: 'html',
                required: RequiredStatus,
                localized: LocalizedStatus,
            },
        ],
    };

    // console.log(`CREATE CONTENT TYPE URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
