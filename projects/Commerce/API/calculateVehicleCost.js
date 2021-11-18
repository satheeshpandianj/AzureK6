import * as Constants from '../../../Utils/perfAPIConstants.js';
import Utils from '../../../Utils/perfAPIUtils.js';

let vinNumber;

export const CalculateVehicleCostAPI = (Market, Brand, SalesModel, DealerId, ModelYear, VariantCode, CustomerType, VatRate, Version, ContractLength, Mileage) => {
    const url = `${Utils.GetBaseUrl(__ENV.ENV.toUpperCase())}${Constants.FinancialOptionsEndpoint
        }calculateVehicleCost`;

    const acceptHeader = Utils.getHeaderByVersion(
        Constants.FOCalculateVehicleCostAcceptHeader,
        Version
    );
    const contentType = Utils.getHeaderByVersion(
        Constants.FOCalculateVehicleCostContentTypeHeader,
        Version
    );

    const body = {
        market: Market,
        brand: Brand,
        salesModel: SalesModel,
        customerType: CustomerType,
        modelYear: ModelYear,
        vin: vinNumber ? vinNumber : 'string',
        pno34PlusOptions: VariantCode,
        features: [
            {
                code: 'string',
                featureGroup: 'string',
            },
        ],
        offers: [
            {
                id: 'string',
            },
        ],
        contractOptions: {
            ContractLength: 24,
            Mileage: 15000,
        },
    };

    if (DealerId) {
        if (DealerId !== 'missing') {
            body.dealerId = DealerId;
        }
    }

    if (ContractLength) {
        body.contractOptions.contractLength = ContractLength;
    }

    if (Mileage) {
        body.contractOptions.mileage = Mileage;
    }

    if (!Mileage && !ContractLength) {
        delete body.contractOptions;
    }

    const headers = {
        headers: {
            'Accept': acceptHeader,
            'Content-Type': contentType,
            'VCC-Api-Key': Utils.GetAPIKey(__ENV.ENV.toUpperCase()),
        },
    };

    // console.log(`COMMERCE CALCULATE VEHICLE COST URL: ${url} HEADER: ${JSON.stringify(headers)} BODY: ${JSON.stringify(body)}`);

    var ReqObject = {
        URL: url,
        HEADERS: headers,
        BODY: body
    };

    return ReqObject;

};
