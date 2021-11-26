/*
Import all the necessary modules and libraries
*/
import http from 'k6/http';
import { sleep, abort, fail } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
const Request = require('../projects/' + __ENV.PROJECT + '/TestScripts/APIRequest.js');


//////////////////////// VALIDATE API NAME PROVIDED //////////////////////
let resultAPIStatus = Request.validateAPIName(__ENV.APINAME.toUpperCase());
if (resultAPIStatus !== true) {
    throw new Error("Invalid API name provided...Hence test is stopped");
}


/////////// SLACK Integration starts //////////////////
export const payload = {
    channel: "perf-test-poc",
    attachments: [
        {
            color: "#632eb8",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "*K6 Summary Report*"
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: ""
                    },
                    accessory: {
                        type: "image",
                        image_url: "https://k6.io/images/landscape-icon.png",
                        alt_text: "k6 thumbnail"
                    }
                }
            ]
        }
    ],
};

/////////////// TEST SUCCESSFUL ////////////////////////////////////////
export function sendSlackMessage(data) {
    let avgResponseTime = data.metrics.http_req_duration.values['avg'];
    let p95ResponseTime = data.metrics.http_req_duration.values['p(95)'];
    let vus = data.metrics.vus.values['value'];
    let httpFailure = data.metrics.http_req_failed.values['passes'];
    let maxThroughput = data.metrics.http_reqs.values['count'];

    let sectionBlocks = payload.attachments.find((attachments) => {
        return attachments.blocks[1].type === "section";
    });

    sectionBlocks.blocks[1].text.text = "*Env: " + __ENV.ENV.toUpperCase() + "*" +
        "\n*Project: " + __ENV.PROJECT.toUpperCase() + "*" +
        "\n*API: " + __ENV.APINAME.toUpperCase() + "*" +
        "\n\n*Max Throughput: *\n" + maxThroughput.toFixed(2) + " reqs/sec" +
        "\n*HTTP Failures: *\n" + httpFailure + " reqs" +
        "\n*Avg Response Time: *\n" + avgResponseTime.toFixed(2) + "ms" +
        "\n*95th Percentile Response Time: *\n" + p95ResponseTime.toFixed(2) + "ms" +
        "\n*Virtual Users: *\n" + vus + " VUS";

    const slackRes = http.post('https://slack.com/api/chat.postMessage', JSON.stringify(payload), {
        headers: {
            "Authorization": "Bearer xoxb-395635722896-2746988009782-dh8tkxaRD5jRfos2A6yewZ28",
            "Content-Type": "application/json"
        }
    });

    // console.log(`Slack Response : ${JSON.stringify(slackRes.body)}`);
}


/////////// SLACK Integration ends ////////////

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

////////////////////////////////////// Summary Report in HTML format  /////////////////////////

export function handleSummary(data) {
    sendSlackMessage(data);
    return {
        // "/loadtest/summary.html": htmlReport(data),
        'stdout': textSummary(data, { indent: ' ', enableColors: true })
    };
}

/*************************************************************************************
                                end of script
*************************************************************************************/
