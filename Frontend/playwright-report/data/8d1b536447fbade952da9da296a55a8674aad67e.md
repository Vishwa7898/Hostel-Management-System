# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\register.spec.js >> should register a new student successfully
- Location: tests\auth\register.spec.js:4:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/student-register", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e8]:
  - generic [ref=e9]:
    - heading "StaySphere" [level=1] [ref=e10]
    - paragraph [ref=e11]: Student Registration
  - generic [ref=e13] [cursor=pointer]:
    - generic [ref=e15]:
      - img [ref=e16]
      - paragraph [ref=e19]: Add Photo
    - img [ref=e21]
  - generic [ref=e24]:
    - generic [ref=e25]:
      - textbox "Full Name" [ref=e26]
      - textbox "Address" [ref=e27]
      - textbox "City" [ref=e28]
      - textbox "Student Phone Number" [ref=e29]
      - textbox "Email Address" [ref=e30]
      - generic [ref=e31]:
        - textbox "Create Password" [ref=e32]
        - button [ref=e33] [cursor=pointer]:
          - img [ref=e34]
    - generic [ref=e37]:
      - generic [ref=e38]:
        - paragraph [ref=e39]:
          - text: ID Card Front
          - generic [ref=e40]: "*"
        - generic [ref=e41]:
          - generic [ref=e42]:
            - img [ref=e43]
            - paragraph [ref=e46]: Upload Front Side
            - paragraph [ref=e47]: Click or drag image
          - button "Choose File" [ref=e48] [cursor=pointer]
      - generic [ref=e49]:
        - paragraph [ref=e50]:
          - text: ID Card Back
          - generic [ref=e51]: "*"
        - generic [ref=e52]:
          - generic [ref=e53]:
            - img [ref=e54]
            - paragraph [ref=e57]: Upload Back Side
            - paragraph [ref=e58]: Click or drag image
          - button "Choose File" [ref=e59] [cursor=pointer]
  - generic [ref=e60]:
    - textbox "Guardian Name" [ref=e61]
    - textbox "Guardian Phone Number" [ref=e62]
  - generic [ref=e63]:
    - heading "📋 Terms & Conditions" [level=3] [ref=e64]
    - list [ref=e65]:
      - listitem [ref=e66]:
        - generic [ref=e67]: •
        - generic [ref=e68]: Daily check-in & check-out is mandatory using the system
      - listitem [ref=e69]:
        - generic [ref=e70]: •
        - generic [ref=e71]: Alcohol and illegal drugs are strictly prohibited
      - listitem [ref=e72]:
        - generic [ref=e73]: •
        - generic [ref=e74]: No fighting, harassment or disturbances allowed
      - listitem [ref=e75]:
        - generic [ref=e76]: •
        - generic [ref=e77]: Respect all residents and hostel staff at all times
      - listitem [ref=e78]:
        - generic [ref=e79]: •
        - generic [ref=e80]: Guardian details must be accurate for emergencies
      - listitem [ref=e81]:
        - generic [ref=e82]: •
        - generic [ref=e83]: Follow all safety & security guidelines
      - listitem [ref=e84]:
        - generic [ref=e85]: •
        - generic [ref=e86]: Maintain discipline and good conduct
      - listitem [ref=e87]:
        - generic [ref=e88]: •
        - generic [ref=e89]: Any illegal or unethical activity is strictly forbidden
    - generic [ref=e90] [cursor=pointer]:
      - checkbox "I have read and agree to the Terms and Conditions" [ref=e91]
      - generic [ref=e92]: I have read and agree to the Terms and Conditions
  - button "Register Student 🚀" [ref=e93] [cursor=pointer]:
    - text: Register Student
    - generic [ref=e94]: 🚀
  - link "Already have an account? Return to Login" [ref=e96] [cursor=pointer]:
    - /url: /student-login
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import path from 'path';
  3  | 
  4  | test('should register a new student successfully', async ({ page }) => {
  5  |   // 1. Navigate to the registration page
  6  |   // Using 127.0.0.1 can sometimes resolve timeout issues better than 'localhost'
> 7  |   await page.goto('http://localhost:5173/student-register');
     |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  8  | 
  9  |   // 2. Fill Text Details
  10 |   // Using { exact: true } on 'Address' prevents the strict mode error 
  11 |   // caused by 'Email Address' also containing the word 'Address'.
  12 |   await page.getByPlaceholder('Full Name').fill('Test Student');
  13 |   await page.getByPlaceholder('Address', { exact: true }).fill('123 Hostel Lane');
  14 |   await page.getByPlaceholder('City').fill('Colombo');
  15 |   await page.getByPlaceholder('Student Phone Number').fill('0771234567');
  16 |   
  17 |   // Create a unique email for every test run
  18 |   const uniqueEmail = `testuser${Date.now()}@gmail.com`;
  19 |   await page.getByPlaceholder('Email Address').fill(uniqueEmail);
  20 |   
  21 |   await page.getByPlaceholder('Create Password').fill('Password123!');
  22 |   await page.getByPlaceholder('Guardian Name').fill('Guardian Name');
  23 |   await page.getByPlaceholder('Guardian Phone Number').fill('0719876543');
  24 | 
  25 |   // 3. Handle File Uploads
  26 |   // Ensure 'public/vite.svg' exists in your project root, or update this path
  27 |   const dummyImagePath = path.resolve('public/vite.svg'); 
  28 |   
  29 |   // In your React code, you have 3 file inputs (Profile, ID Front, ID Back)
  30 |   const fileInputs = page.locator('input[type="file"]');
  31 |   
  32 |   // Upload Profile Photo (index 0)
  33 |   await fileInputs.nth(0).setInputFiles(dummyImagePath);
  34 |   
  35 |   // Upload ID Card Front (index 1)
  36 |   await fileInputs.nth(1).setInputFiles(dummyImagePath);
  37 |   
  38 |   // Upload ID Card Back (index 2)
  39 |   await fileInputs.nth(2).setInputFiles(dummyImagePath);
  40 | 
  41 |   // 4. Accept Terms & Conditions
  42 |   // Using getByLabel is best practice for accessibility and reliability
  43 |   await page.getByLabel('I have read and agree to the Terms and Conditions').check();
  44 | 
  45 |   // 5. Submit Registration
  46 |   // Using a regex with 'i' makes the locator case-insensitive
  47 |   await page.getByRole('button', { name: /Register Student/i }).click();
  48 | 
  49 |   // 6. Verify Redirection
  50 |   // Playwright will wait for the URL to change to the dashboard
  51 |   await expect(page).toHaveURL(/.*student-dashboard/);
  52 | });
```