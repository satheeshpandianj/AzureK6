/* eslint-disable prettier/prettier */
import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const UpdateLanguageVersionAPI = (
    dictionaryID,
    locale,
    versionToken
) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase()) +
        Constants.CMUpdateLanguageVersionEndpoint +
        Utils.GetAppID(__ENV.ENV.toUpperCase())
        }/dictionaries/${dictionaryID}/language-versions/${locale}`;

    if (__ENV.DATASOURCE === undefined) {
        url = `${url}?dataSource=content-services-sitecore9-custom`;
    }
    else {
        url = `${url}?dataSource=${__ENV.DATASOURCE}`;
    }


    const headers = {
        headers: {
            'Accept': Constants.CMUpdateLanguageVersionAcceptHeader,
            'Content-Type': Constants.CMUpdateLanguageVersionContentTypeHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    const body = {
        currentVersionToken: versionToken,
        items: {
            item1: Constants.item1Value,
            item2: Constants.item2Value,
            item3: Constants.item3Value,
        },
    };

    console.log(`UPDATE LANGUAGE URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
