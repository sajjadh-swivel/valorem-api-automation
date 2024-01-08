# qe-automation-framework

Refer Documentation - https://valoremnetworks.atlassian.net/wiki/spaces/Valorem/pages/52297836/E2E+API+Testing+Framework.

Test execution method:

1. Clone the project

2. Make Sure the node version is at least v16.x or higher

3. Install the packages using 
       
       npm install

4. Alter the specfiles.js to run the required test suite. For example the below code will execute the test case in the generalTestScenarios.js file.

       "../test/API/scripts/partnerAPI/generalTestScenarios.js"

5. Before executing the test cases, make sure to update the required parameters. 
       Bearer_Token
       Bearer_Token_Manual
       ORGANIZATION_ID
       TANDA_USERNAME
       TANDA_PASSWORD
       APPLICATION_ID
       APPLICATION_SECRET
       REDIRRECT_URI

       Please refer each of the files to see which parameters needs to be updated before executing the respective test suit.

6. Once the Parameters are updated, Run all the test cases (API/Web) using 
       
       npm run web 

7. Once the execution is completed, open the "reports/html-reporter/master-report.htm" file top view the test reults

8. Additionally to run the test suit without updating the spec file, you can you the below command. 

       npm run web --spec "TestSuit_file_path_"

9. Possible issues
       A. Chrome driver version issue - 
              Update the driver version in package.son to the latest version
              Then run npm install
       
       B. "Employee already exists" update the create employee email & mobile number in 1428 - 1430 lines.