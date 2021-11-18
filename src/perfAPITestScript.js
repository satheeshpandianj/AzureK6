/*
Import all the necessary modules and libraries
*/
import http from 'k6/http';
import { sleep, abort, fail } from 'k6';
const Request = require('../projects/' + __ENV.PROJECT + '/TestScripts/APIRequest.js');

//////////////////////// VALIDATE API NAME PROVIDED //////////////////////
let resultAPIStatus = Request.validateAPIName(__ENV.APINAME.toUpperCase());
if (resultAPIStatus !== true) {
    throw new Error("Invalid API name provided...Hence test is stopped");
}

//////////////////////// FILTERING OPTIONS FOR GRAFANA VISUALIZATION //////////////////////
export let options = {
    tags: {
        ENV: __ENV.ENV.toUpperCase(),
        PROJECTNAME: __ENV.PROJECT.toUpperCase(),
        APINAME: __ENV.APINAME.toUpperCase(),
    },
}


export function setup() {
    const testStartTime = new Date().toLocaleString();
    console.log(`Test is started for ${__ENV.APINAME} at ${testStartTime}`);
}

export default function () {
    Request.frameAPIRequest(__ENV.APINAME.toUpperCase());
}

export function teardown() {
    const testEndTime = new Date().toLocaleString();
    console.log(`Test is completed for ${__ENV.APINAME} at ${testEndTime}`);
}