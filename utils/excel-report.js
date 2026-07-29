import ExcelJS from "exceljs";
import fs from "fs";

const REPORT_FOLDER = "./reports";

async function generateReport() {

    const workbook = new ExcelJS.Workbook();


    const files = fs
        .readdirSync(REPORT_FOLDER)
        .filter(file => file.endsWith("-result.json"));


    // Summary Sheet
    const summarySheet = workbook.addWorksheet("Summary");


    summarySheet.addRow([
        "Test Name", 
        "Total Request", 
        "Failed %",
        "Average", //rata-rata response untuk seluruh request
        "P95", //95% request selesai sebelum ... ms
        "P99",
        "Max", //menampilkan request terlama dalam ms
        "Min" //menampilkan request tercepat dalam ms
    ]);


    for (const file of files) {


        const resultPath = `${REPORT_FOLDER}/${file}`;


        const data = JSON.parse(
            fs.readFileSync(resultPath,"utf-8")
        );


        /*
          Buat nama sheet berdasarkan test name
        */

        let sheetName = data.testName.substring(0,31);


        const sheet = workbook.addWorksheet(sheetName);



        // DETAIL REPORT

        sheet.addRow([
            "LOAD TEST REPORT"
        ]);

        sheet.addRow([]);


        sheet.addRow([
            "Project",
            data.project
        ]);

        sheet.addRow([
            "Test Name",
            data.testName
        ]);

        sheet.addRow([
            "Environment",
            data.environment
        ]);

        sheet.addRow([
            "Executor",
            data.executor
        ]);

        sheet.addRow([
            "API URL",
            data.apiUrl
        ]);

        sheet.addRow([
            "Date",
            data.date
        ]);


        sheet.addRow([]);


        sheet.addRow([
            "Performance Summary"
        ]);


        sheet.addRow([
            "Metric",
            "Value"
        ]);


        sheet.addRow([
            "Total Request",
            data.performanceSummary.totalRequest
        ]);


        sheet.addRow([
            "Failed %",
            data.performanceSummary.failedPercentage
        ]);


        sheet.addRow([
            "Average",
            data.performanceSummary.average
        ]);


        sheet.addRow([
            "P95",
            data.performanceSummary.p95
        ]);


        sheet.addRow([
            "P99",
            data.performanceSummary.p99
        ]);


        sheet.addRow([
            "Max",
            data.performanceSummary.max
        ]);


        sheet.addRow([
            "Min",
            data.performanceSummary.min
        ]);



        sheet.addRow([]);

        sheet.addRow([
            "HTTP Status"
        ]);


        sheet.addRow([
            "Status",
            "Total"
        ]);



        Object.entries(data.httpStatus)
        .forEach(([status,total])=>{

            sheet.addRow([
                status,
                total
            ]);

        });



        // Masukkan ke Summary

        summarySheet.addRow([

            data.testName,

            data.performanceSummary.totalRequest,

            data.performanceSummary.failedPercentage,

            data.performanceSummary.average,

            data.performanceSummary.p95,

            data.performanceSummary.p99,

            data.performanceSummary.max,

            data.performanceSummary.min

        ]);

    }


    // Auto width all sheet

    workbook.eachSheet(sheet=>{

        sheet.columns.forEach(column=>{

            column.width = 25;

        });

    });



    await workbook.xlsx.writeFile(
        `${REPORT_FOLDER}/Load-Test-Report.xlsx`
    );


}


generateReport();