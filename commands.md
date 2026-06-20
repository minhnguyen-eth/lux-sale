# ⚙️ Common Playwright Commands

### ▶️ Run Tests

```bash
# run with: 
npx playwright test

# clear allure results folder before running tests: 
npm run test

# generate report: 
npx allure generate ./allure-results --clean -o ./allure-report

# open report in browser:
npx allure open ./allure-report

# deploy report to github pages:
npm run deploy
```

# generate locators:
npx playwright codegen https://www.example.com
```