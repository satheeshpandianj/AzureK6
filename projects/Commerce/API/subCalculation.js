import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let OfferPrices;
let contractLength;
let mileage;

export const SubCalculationAPI = (Market, Brand, DealerId, ModelYear, VariantCode, CustomerType, Version) => {
    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOSubCalculationAcceptHeader,
        Version
    );

    const contentType = Utils.getHeaderByVersion(
        Constants.FOSubCalculationContentTypeHeader,
        Version
    );

    const headers = {
        headers: {
            'Accept': acceptHeader,
            'Content-Type': contentType,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    }

    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }sub`;

    const body = {
        market: Market,
        brand: Brand,
        modelYear: ModelYear,
        pno34PlusOptions: VariantCode,
        price: 45436.97,
        features: [
            {
                code: 'A00818',
                price: 0,
                featureGroup: 'Option',
            },
        ],
        offers: [
            {
                id: '30 Days Trial',
                price: OfferPrices,
                priceType: 'monthly',
            },
        ],
        monthlyOptions: {},
        customerType: CustomerType,
    };

    if (DealerId) {
        body.dealerId = DealerId;
    }

    if (contractLength !== undefined) {
        body.monthlyOptions.contractLength = contractLength;
    }

    if (mileage !== undefined) {
        body.monthlyOptions.mileage = mileage;
    }

    console.log(`COMMERCE SUB CALCULATION URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
