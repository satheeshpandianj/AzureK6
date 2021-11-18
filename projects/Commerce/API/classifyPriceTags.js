import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let requestBody = undefined;

export const ClassifyPriceTagsAPI = (Market, Brand, DealerId, ModelYear, VariantCode, CustomerType) => {
    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.PriceTagEndpoints
        }${Constants.PriceTagClassifyEndpoint}`;

    const body =
        global.requestBody === 'InvalidRequestBody'
            ? global.requestBody
            : {
                inputs: [
                    {
                        market: Market,
                        brand: Brand,
                        dealerId: DealerId,
                        modelYear: ModelYear,
                        pno34PlusOptions: VariantCode,
                        customerType: CustomerType,
                    },
                ],
            };

    const headers = {
        headers: {
            'Accept': Constants.PriceTagClassifyEndpointAcceptHeader,
            'Content-Type': Constants.PriceTagClassifyEndpointContentType,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        }
    };

    console.log(`COMMERCE CLASSIFY PRICE TAG URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
