/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const PublishLanguageVersionAPI = (dictionaryID, locale) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.CMPublishLanguageVersionEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/dictionaries/${dictionaryID}/language-versions/${locale}/published`;

    if (__ENV.DATASOURCE === undefined) {
        url = `${url}?dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}?dataSource=${__ENV.DATASOURCE}`;
    }


    const headers = {
        headers: {
            'Accept': Constants.CMPublishLanguageVersionAcceptHeader,
            'Content-Type': Constants.CMPublishLanguageVersionContentTypeHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    const body = {
        publishingTargets: ['preview'],
    };

    console.log(`PUBLISH LANGUAGE URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
