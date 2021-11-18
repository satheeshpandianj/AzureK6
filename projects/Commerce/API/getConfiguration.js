import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';


export const GetConfigurationAPI = (market, brand, customerType, version) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }configuration?market=${market}&brand=${brand}`;
    if (customerType !== '') {
        url = `${url}&customerType=${customerType}`;
    }

    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOGetConfigurationAcceptHeader,
        version
    );

    const headers = {
        headers: {
            'Accept': acceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    }

    // console.log(`COMMERCE GET CONFIGURATION URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};

