# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\admin-payments.spec.ts >> Admin can view payments and filter by paid/unpaid
- Location: tests\admin-payments.spec.ts:4:1

# Error details

```
Error: apiRequestContext.post: connect ECONNREFUSED ::1:5000
Call log:
  - → POST http://localhost:5000/api/auth/login
    - user-agent: Playwright/1.59.1 (x64; windows 10.0) node/22.21
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: application/json
    - content-length: 71

```