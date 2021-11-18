/* eslint-disable prettier/prettier */
/* eslint-disable lines-between-class-members */
import * as Constants from './perfAPIConstants.js';

// require('dotenv').config();

/**
 * TO-DO Add docs for the remaining functions
 */

/**
 * @public
 */
class Utils {

    /**
     * Get base url for given env.
     *
     * @param {string} env Environment
     * @returns {string | undefined}
     */
    GetBaseUrl(env) {
        if (__ENV.PROJECT.toUpperCase()) {
            if (__ENV.PROJECT == 'CCE') {
                switch (env) {
                    case 'TEST':
                        return Constants.CCEBaseURLDev;
                    case 'QA':
                        return Constants.CCEBaseURLStage;
                    case 'PROD':
                        return Constants.CCEBaseURLProd;

                    default:
                        Error('Wrong Environment!');
                }
            } else {
                switch (env) {
                    case 'TEST':
                        return Constants.BaseUrlTest;
                    case 'QA':
                        return Constants.BaseUrlQA;
                    case 'PROD':
                        return Constants.BaseUrlProd;

                    default:
                        Error('Wrong Environment!');
                }
            }
        }
    }

    /**
    * Get app id for given env.
    *
    * @param {string} env Environment
    * @returns {string | undefined}
    */
    GetAppID(env) {
        switch (env) {
            case 'TEST':
                return Constants.applicationIDTest;
            case 'QA':
                return Constants.applicationIDQA;
            case 'PROD':
                return Constants.applicationIDProd;
            default:
                Error('Wrong Environment!');
        }
    }

    GetDataSource(Env) {
        switch (Env) {
            case ('QA'):
                return Constants.CM_QA_DATASOURCE;
                break;
            case ('TEST'):
                return Constants.CM_TEST_DATASOURCE;
                break;
            case ('PROD'):
                return Constants.CM_PROD_DATASOURCE;
                break;
            default:
                console.log(`Wrong data source`);
        }
    }

    /**
     * Get API key for given environment.
     *
     * @param {string} env Environment
     * @returns {string | undefined}
     */
    GetAPIKey(env) {
        switch (env) {
            case 'TEST':
                return Constants.VCC_API_TEST;
            case 'QA':
                return Constants.VCC_API_QA;
            case 'PROD':
                return Constants.VCC_API_PROD;
            default:
                Error('Wrong Environment!');
        }
    }

    /**
    * Get string generated using [A-Z a-z 0-9] of given length.
    *  {number}
    *
    * @param  length Length of random string
    * @returns {string}
    */
    GetRandomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    /**
    * Get CD dictionary data source for given env.
    *
    * @param {string} Env Environment
    * @returns {string | undefined}
    */
    GetCDDictionaryDataSource(Env) {
        switch (Env) {
            case 'TEST':
                return Constants.NCD_TEST_DATASOURCE;
            case 'QA':
                return Constants.NCD_QA_DATASOURCE;
            case 'PROD':
                return Constants.NCD_PROD_DATASOURCE;

            default:
                Error('Wrong Environment!');
        }
    }
    GetCMVolvoDataSource(Env) {
        switch (Env) {
            case ('QA'):
                return Constants.CMP_QA_DATASOURCE;
                break;
            case ('TEST'):
                return Constants.CMP_TEST_DATASOURCE;
                break;
            case ('PROD'):
                return Constants.CMP_PROD_DATASOURCE;
                break;
            default:
                console.log(`Wrong data source`);
        }
    }

    /**
     * Function returns header value string based on provided header value and version.
     *
     * @param {string} string the header value that will be modified based on provided version.
     * @param {string} version the wanted version. Use v0 for header value without version.
     * @example 
    *getHeaderByVersion('application/vnd.volvocars.api.static.site.generator.preview.projectresponse.v1+json', 'v1');
     * @returns {string}
    */
    getHeaderByVersion(string, version) {
        // case: version is undefined
        if (version === undefined) {
            return string;
        }
        // case: string does not contains version number
        if (!string.match(/[.](v[0-9])[+]json/)) {
            version = version === 'v0' ? '+json' : `.${version}+json`;
            return string.replace('+json', version);
        }

        // case: string contains version number
        const result = string.includes(version) ? string : string.replace(/[.](?!.*[.]).*[+]json/, `.${version}+json`);
        return version === 'v0' ? string.replace(/[.](?!.*[.]).*[+]json/, `+json`) : result;
    }

}

export default new Utils();