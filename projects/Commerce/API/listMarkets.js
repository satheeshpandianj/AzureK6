import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let Version;

export const ListMarketsAPI = () => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }markets`;

    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOListMarketsAcceptHeader,
        Version
    );

    const headers = {
        headers: {
            'Accept': acceptHeader,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    }

    console.log(`COMMERCE LIST MARKET URL: ${url} HEADER: ${JSON.stringify(headers)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers
    };

    return ReqObject;
};
