import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let OfferPrices;
let mileage;
let contractLength;

export const MonthlyCalculationAPI = (Market, Brand, DealerId, ModelYear, VariantCode, CustomerType, SalesModel, Version, ContractLength, Mileage) => {
    let body;
    const GetRequestBody = () => {
        if (Version === 'v3')
            return {
                market: Market,
                brand: Brand,
                modelYear: ModelYear,
                pno34PlusOptions: VariantCode,
                totalPrice: 78770.0,
                salesModels: [
                    {
                        salesModel: 'sub',
                        inputs: [
                            {
                                name: 'mileage',
                                value: '15000',
                            },
                            {
                                name: 'contractLength',
                                value: '24',
                            },
                        ],
                    },
                ],
                features: [
                    {
                        code: '72400',
                        price: 0,
                        isAccessory: false,
                        featureGroup: 'Metallic lak',
                    },
                    {
                        code: 'RA0000',
                        price: 0,
                        isAccessory: false,
                        featureGroup: 'Leder',
                    },
                    {
                        code: '000114',
                        price: 0,
                        isAccessory: false,
                        featureGroup: 'Veiligheid - Persoonlijke Veiligheid',
                    },
                    {
                        code: '000140',
                        price: 0,
                        isAccessory: false,
                        featureGroup: 'Veiligheid - Persoonlijke Veiligheid',
                    },
                    {
                        code: '000918',
                        price: 0,
                        isAccessory: false,
                        featureGroup: 'Interieur - Audio & Communicatie',
                    },
                    {
                        code: '000179',
                        price: 0,
                        isAccessory: false,
                        featureGroup: 'Interieur - Klimaat',
                    },
                    {
                        code: '001028',
                        price: 0,
                        isAccessory: false,
                        featureGroup: 'Exterieur - Verlichting, Chassis & Design',
                    },
                ],
                packages: [
                    {
                        code: 'P0001',
                        price: 0,
                        packageType: 'optionsPackage',
                    },
                    {
                        code: 'P0004',
                        price: 0,
                        packageType: 'optionsPackage',
                    },
                    {
                        code: 'P0005',
                        price: 0,
                        packageType: 'optionsPackage',
                    },
                    {
                        code: 'P0007',
                        price: 0,
                        packageType: 'optionsPackage',
                    },
                    {
                        code: 'P0008',
                        price: 0,
                        packageType: 'optionsPackage',
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
                wltpTaxes: {
                    taxBase: 'NEDC',
                    taxSource: 'urax',
                    tax: [
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
                    isOfficial: true,
                    basicPrice: 62320.66,
                },
                customerType: CustomerType,
            };
        return {
            market: Market,
            brand: Brand,
            modelYear: ModelYear,
            pno34PlusOptions: VariantCode,
            totalPrice: 92048.48,
            salesModels: [
                {
                    salesModel: 'Sub',
                    inputs: [
                        {
                            name: 'string',
                            value: 'string',
                        },
                        {
                            name: 'string',
                            value: 'string',
                        },
                    ],
                },
            ],
            features: [
                {
                    code: 'string',
                    description: 'string',
                    price: 0.0,
                    isAccessory: true,
                    featureGroup: 'string',
                },
            ],
            packages: [
                {
                    code: 'string',
                    description: 'string',
                    price: 0.0,
                    packageType: 'optionsPackage',
                    exchangeables: [
                        {
                            code: 'string',
                            description: 'string',
                            price: 0.0,
                            isAccessory: true,
                            featureGroup: 'string',
                        },
                    ],
                },
            ],
            offers: [
                {
                    id: '30 Days Trial',
                    price: OfferPrices,
                    priceType: 'monthly',
                },
            ],
            wltpTaxes: {
                taxBase: 'nedc',
                taxSource: 'urax',
                tax: [
                    {
                        name: 'after taxes',
                        price: 30155.43,
                        vatPosition: 'after',
                    },
                    {
                        name: 'before taxes',
                        price: 1130.58,
                        vatPosition: 'before',
                    },
                    {
                        name: 'vat tax',
                        price: 10741.77,
                        vatPosition: 'vat',
                    },
                ],
                isOfficial: true,
                basicPrice: 50020.7,
            },
            customerType: CustomerType,
        };
    };

    body = body ? body : GetRequestBody();

    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOMonthlyCalculationAcceptHeader,
        Version
    );

    const contentType = Utils.getHeaderByVersion(
        Constants.FOMonthlyCalculationContentTypeHeader,
        Version
    );

    if (SalesModel !== undefined) {
        body.salesModels[0].salesModel = SalesModel;
    }

    if (DealerId !== undefined) {
        body.dealerId = DealerId;
    }

    if (mileage !== undefined) {
        body.salesModels[0].inputs[0].name = 'mileage';
        body.salesModels[0].inputs[0].value = mileage;
    }

    if (contractLength !== undefined) {
        body.salesModels[0].inputs[1].name = 'contractLength';
        body.salesModels[0].inputs[1].value = contractLength;
    }

    const headers = {
        headers: {
            'Accept': acceptHeader,
            'Content-Type': contentType,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    }

    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }monthly`;


    console.log(`COMMERCE MONTHLY CALCULATION URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;
};
