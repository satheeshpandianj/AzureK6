import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let OfferPrices;
export const LeaseCalculationAPI = (Market, Brand, DealerId, ModelYear, VariantCode, CustomerType, Version) => {
    let url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }lease`;

    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOLeaseCalculationAcceptHeader,
        Version
    );

    const contentType = Utils.getHeaderByVersion(
        Constants.FOLeaseCalculationContentTypeHeader,
        Version
    );

    const headers = {
        headers: {
            'Accept': acceptHeader,
            'Content-Type': contentType,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    }

    const body = {
        market: Market,
        brand: Brand,
        modelYear: ModelYear,
        pno34PlusOptions: VariantCode,
        price: 50020.7,
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
        CustomerType,
    };

    if (DealerId !== 'missing' && DealerId) {
        body.dealerId = DealerId;
    }

    console.log(`COMMERCE LEASE CALCULATION URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
