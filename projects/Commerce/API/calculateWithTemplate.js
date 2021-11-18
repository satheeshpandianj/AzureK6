import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

export const CalculateWithTemplateAPI = (Market, Brand, SalesModel, DealerId, ModelYear, VariantCode, CustomerType, Version) => {
    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }calculateWithTemplate`;

    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOCalculateWithTemplateAcceptHeader,
        Version
    );
    const contentType = Utils.getHeaderByVersion(
        Constants.FOCalculateWithTemplateContentTypeHeader,
        Version
    );

    const body = {
        market: Market,
        brand: Brand,
        dealerId: DealerId,
        modelYear: ModelYear,
        pno34PlusOptions: VariantCode,
        totalPrice: 54070,
        salesModels: [{
            salesModel: SalesModel,
            monthlyOptions: [{
                contractLength: 24,
                mileage: 15000
            }
            ]
        },
        ],
        wltpTaxes: {
            taxBase: "wltp",
            taxSource: "urax",
            tax: [{
                name: "DE_VAT",
                price: 8633.03,
                vatPosition: "vat"
            }
            ],
            isOfficial: false,
            basicPrice: 45436.97
        },
        customerType: CustomerType,
        calculationDetails: [{
            type: SalesModel,
            costValue: {
                isResidualValue: false,
                priceBase: "gross"
            },
            variant: {
                discount: 0,
                priceExceedMileage: 2.5,
                fees: [{
                    months: 24,
                    mileage: 15000,
                    monthlyFee: 729
                }, {
                    months: 24,
                    mileage: 20000,
                    monthlyFee: 769
                }
                ]
            },
            featureGroups: [{
                name: "option",
                discount: 0,
                fees: [],
                exceptions: [{
                    code: "001028",
                    discount: 0,
                    fees: [{
                        months: 24,
                        monthlyFee: 20
                    }
                    ]
                }
                ]
            }
            ]
        },
            ,
        ]
    };

    const headers = {
        headers: {
            'Accept': acceptHeader,
            'Content-Type': contentType,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    };

    // console.log(`COMMERCE CALCULATE WITH TEMPLATE URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;

};
