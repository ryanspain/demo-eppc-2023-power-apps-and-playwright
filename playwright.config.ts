import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    outputDir: './playwright/test-results',
    timeout: 30000,
    expect: {
        timeout: 10000,
    },
    reporter: process.env.CI ?
        [
            ['html', { outputFolder: './playwright/test-report' }],
            ['junit', { outputFile: './playwright/test-results/e2e-junit-results.xml' }]
        ]
        :
        [
            ['html', { outputFolder: './playwright/test-report' }]
        ],
    use: {
        trace: 'retain-on-failure',
        screenshot: 'on',
        video: 'on',
    },
    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.[js|ts]/g
        },
        {
            name: 'Google Chrome',
            use: {
                ...devices['Desktop Chrome']
            },
            dependencies: ['setup'],
        }
    ],
});