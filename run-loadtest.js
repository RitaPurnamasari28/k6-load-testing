import { spawnSync } from "child_process";

const tests = [
    "tests/get-product-list.js",
    "tests/post-product.js",
    "tests/post-new-user.js",
    "tests/user-login.js",
];

let exitCode = 0;

for (const test of tests) {

    console.log(`\n====================================`);
    console.log(`Running ${test}`);
    console.log(`====================================\n`);

    const result = spawnSync(
        "k6",
        ["run", test],
        {
            stdio: "inherit",
            shell: true,
        }
    );

    if (result.status !== 0) {
        exitCode = result.status;
    }
}

// Tetap buat Excel walaupun ada test yang gagal
spawnSync(
    "node",
    ["utils/excel-report.js"],
    {
        stdio: "inherit",
        shell: true,
    }
);

process.exit(exitCode);