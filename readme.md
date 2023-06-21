# European Power Platform Conference 2023 - Power Apps and Playwright

Sample project that tests a slightly customized version of the sample Asset Checkout Power App using Playwright, and end-to-end testing framework from Microsoft.

## Run the tests

1. First, set the required environment variables on the system that will be running the tests, e.g. your local machine or the continuous integration server.

    | Key                    | Value                         |
    | ---------------------- | ----------------------------- |
    | ASSET_CHECKOUT_APP_URL | _Your asset checkout app URL_ |
    | ASSET_ADMIN_EMAIL      | _Your test users email_       |
    | ASSET_ADMIN_PASSWORD   | _Your test users password_    |
    | ASSET_MANAGER_EMAIL    | _Your test users email_       |
    | ASSET_MANAGER_PASSWORD | _Your test users password_    |

2. Next, install dependencies including Playwright browsers.

    ```bash
    npm run setup
    ```

3. Finally, run tests.

    ```bash
    npm run test
    ```
