import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let contractLength;
let mileage;

export const SubFixedCalculationAPI = (Market, Brand, DealerId, ModelYear, VariantCode, CustomerType, Version) => {
    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOSubFixedCalculationAcceptHeader,
        Version
    );

    const contentType = Utils.getHeaderByVersion(
        Constants.FOSubFixedCalculationContentTypeHeader,
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
        }sub_fixed`;

    const body = {
        market: Market,
        brand: Brand,
        modelYear: ModelYear,
        pno34PlusOptions: VariantCode,
        price: 45436.97,
        features: [
            {
                code: '71400',
                price: 0,
                featureGroup: 'colour',
            },
            {
                code: 'RG0R00',
                price: 0,
                featureGroup: 'upholstery',
            },
            {
                code: '001042',
                price: 0,
                featureGroup: 'option',
            },
            {
                code: '000871',
                price: 0,
                featureGroup: 'option',
            },
            {
                code: '000873',
                price: 0,
                featureGroup: 'option',
            },
            {
                code: 'MCP6B',
                price: 0,
                featureGroup: 'option',
            },
            {
                code: 'MCP5S',
                price: 0,
                featureGroup: 'option',
            },
        ],
        offers: [
            {
                id: '30 Days Trial',
                price: 0,
                priceType: 'monthly',
                isOptional: null,
            },
            {
                id: 'Concierge',
                price: 0,
                priceType: 'monthly',
                isOptional: null,
            },
        ],
        taxes: {
            beforeVat: 0,
            vat: 8633.03,
            afterVat: 0,
        },
        monthlyTaxes: null,
        monthlyOptions: {
            contractLength: 36,
            mileage: 6000,
        },
        customerType: CustomerType,
    };

    if (global.version === 'v2') {
        body.taxes = [body.taxes];
    }

    if (DealerId) {
        body.dealerId = DealerId;
    }

    if (contractLength) {
        body.monthlyOptions.contractLength = contractLength;
    }

    if (mileage) {
        body.monthlyOptions.mileage = mileage;
    }

    console.log(`COMMERCE SUB FIXED CALCULATION URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
