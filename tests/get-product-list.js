import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

const status200 = new Counter("status_200");
const status400 = new Counter("status_400");
const status500 = new Counter("status_500");


const TEST_INFO = {

    project: "Load testing Automation Exercise",

    testName: "Product API Load Test",

    environment: "QA",

    executor: "GitHub Actions",
    apiUrl: "https://automationexercise.com/api/productsList"

};


//let statusCodes = {};


export const options = {

//Scenario
    scenarios: {

        product_api_load: {

            executor: "ramping-vus",

            stages: [

                {
                    duration: "1m",
                    target: 50
                },

                {
                    duration: "5m",
                    target: 50
                },

                {
                    duration: "1m",
                    target: 0
                }

            ]

        }

    },

//Test passing requirements
    summaryTrendStats: ["avg", "min", "max", "p(90)", "p(95)", "p(99)"],

    thresholds: {

        http_req_failed:[
            "rate<0.01"
        ],


        http_req_duration:[
            "p(95)<1500"
        ]

    }

};



export default function(){


    const res = http.get(
        "https://automationexercise.com/api/productsList"
    );


    if(res.status === 200){
    status200.add(1);
}

if(res.status === 400){
    status400.add(1);
}

if(res.status === 500){
    status500.add(1);
}



    check(res, {

        "status is 200":
        (r)=> r.status === 200

    });


    sleep(1);

}




export function handleSummary(data){

    const fileName = TEST_INFO.testName
        .replace(/ /g, "-")
        .toLowerCase();


    const report = {


        reportTitle:
        "LOAD TEST REPORT",


        project:
        TEST_INFO.project,


        testName:
        TEST_INFO.testName,


        environment:
        TEST_INFO.environment,


        executor:
        TEST_INFO.executor,

        apiUrl:
        TEST_INFO.apiUrl,


        date:
        new Date().toLocaleString(
            "id-ID",
            {
                timeZone:"Asia/Makassar"
            }
        ),



        performanceSummary:{


            totalRequest:
            data.metrics.http_reqs.values.count,


            failedPercentage:
            (
              data.metrics.http_req_failed.values.rate * 100
            ).toFixed(2)+"%",


            average:
            data.metrics.http_req_duration.values.avg,


            p95:
            data.metrics.http_req_duration.values["p(95)"],


            p99:
            data.metrics.http_req_duration.values["p(99)"] ?? "-",


            max:
            data.metrics.http_req_duration.values.max,


            min:
            data.metrics.http_req_duration.values.min

        },



        threshold:{


            http_req_failed:
            "http_req_failed < 1%",


            http_req_duration:
            "http_req_duration p(95)<1000"

        },



        scenario:{


            virtualUsers:
            50,


            rampUp:
            "1 minute",


            duration:
            "5 minutes"

        },


        httpStatus:
        {

    200:
    data.metrics.status_200
    ? data.metrics.status_200.values.count
    : 0,

    400:
    data.metrics.status_400
    ? data.metrics.status_400.values.count
    : 0,

    500:
    data.metrics.status_500
    ? data.metrics.status_500.values.count
    : 0

}


    };



    return {

        [`reports/${fileName}-result.json`]:
        JSON.stringify(
            report,
            null,
            2
        )

    };

}