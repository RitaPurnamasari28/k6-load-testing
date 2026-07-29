export function textSummary(data, options){

    return `
===============================
K6 LOAD TEST RESULT
===============================

HTTP REQUESTS
-------------
Total:
${data.metrics.http_reqs.values.count}


Failed:
${data.metrics.http_req_failed.values.rate * 100}%


Response Time
-------------
Average:
${data.metrics.http_req_duration.values.avg} ms


P95:
${data.metrics.http_req_duration.values['p(95)'] ?? '-'} ms

P99:
${data.metrics.http_req_duration.values['p(99)'] ?? '-'} ms


===============================

`;

}