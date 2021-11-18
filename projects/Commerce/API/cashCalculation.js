import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const CashCalculationAPI = (Market, Brand, DealerId, ModelYear, VariantCode, CustomerType, Version) => {
    let body;
    const GetRequestBody = () => {
        if (Version === 'v2') {
            return {
                market: Market,
                brand: Brand,
                modelYear: ModelYear,
                pno34PlusOptions: VariantCode,
                price: 62320.66,
                features: [
                    {
                        code: '72400',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: 'RA0000',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: '000114',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: '000140',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: '000918',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: '000179',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: '001028',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: 'P0001',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: 'P0004',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: 'P0005',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: 'P0007',
                        price: 0,
                        featureGroup: 'option',
                    },
                    {
                        code: 'P0008',
                        price: 0,
                        featureGroup: 'option',
                    },
                ],
                offers: [
                    {
                        id: 'TrialPeriod',
                    },
                    {
                        id: 'Insurance',
                    },
                ],
                taxes: [
                    {
                        name: 'BPM-bedrag',
                        price: 2142.0,
                        vatPosition: 'after',
                    },
                    {
                        name: 'BTW-bedrag',
                        price: 13290.94,
                        vatPosition: 'vat',
                    },
                    {
                        name: 'Kentekenkosten',
                        price: 46.89,
                        vatPosition: 'after',
                    },
                    {
                        name: 'Kosten rijklaar maken',
                        price: 849.68,
                        vatPosition: 'before',
                    },
                    {
                        name: 'Recyclingbijdrage',
                        price: 119.84,
                        vatPosition: 'before',
                    },
                ],
                customerType: CustomerType,
            };
        }
        return {
            market: Market,
            brand: Brand,
            dealerId: DealerId,
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
            taxes: {
                beforeVat: 0,
                vat: 8633.03,
                afterVat: 0,
            },
            customerType: CustomerType,
        };
    };

    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }cash`;

    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOCashCalculationAcceptHeader,
        Version
    );
    const contentType = Utils.getHeaderByVersion(
        Constants.FOCashCalculationContentTypeHeader,
        Version
    );

    const headers = {
        headers: {
            'Accept': acceptHeader,
            'Content-Type': contentType,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    };

    body = body ? body : GetRequestBody();

    if (DealerId) {
        body.DealerId = DealerId;
    }

    // console.log(`COMMERCE CASH CALCULATION URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;

};
