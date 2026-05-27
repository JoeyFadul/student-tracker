# Student Reward Tracker — Deployment Guide

A mobile-friendly, serverless web app for tracking elementary student rewards. Designed to run for **~$0-3/month** on AWS for a small school (2-10 teachers).

## What you're getting

| File | Purpose |
|---|---|
| `StudentTracker.jsx` | The React frontend (single component, drop into any Vite/CRA app) |
| `lambda-handler.js` | The backend API — runs in a single AWS Lambda function |
| `template.yaml` | AWS SAM infrastructure-as-code — provisions everything with one command |

## The architecture

```
Browser → CloudFront → S3 (static React)
       → API Gateway → Lambda → DynamoDB (student data, point history)
                              → S3 (photos)
       → Cognito (auth)
```

Every service is serverless and pay-per-use. No EC2 instances, no RDS, nothing running idle.

## Cost breakdown for ~10 teachers, 200 students, 1000 point grants/month

| Service | Free tier | Expected monthly cost |
|---|---|---|
| Lambda | 1M requests + 400k GB-sec | $0 |
| API Gateway HTTP API | 1M requests (first 12mo) | $0 → ~$0.01 |
| DynamoDB on-demand | 25 GB storage | <$0.10 |
| S3 (photos + web) | 5 GB | <$0.10 |
| CloudFront | 1 TB transfer (first 12mo) | $0 → ~$0.50 |
| Cognito | 50k MAUs | $0 |
| **Total** | | **~$0-1/month** |

## One-time setup

You'll need: an AWS account, the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), the [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html), and Node.js 20+.

### 1. Project layout

```
student-tracker/
├── template.yaml           ← from this bundle
├── backend/
│   ├── index.js            ← rename lambda-handler.js to this
│   └── package.json        ← create with deps below
└── frontend/               ← any Vite React app
    └── src/
        └── StudentTracker.jsx
```

### 2. Backend `package.json`

```json
{
  "name": "student-tracker-api",
  "version": "1.0.0",
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.600.0",
    "@aws-sdk/lib-dynamodb": "^3.600.0",
    "@aws-sdk/client-s3": "^3.600.0",
    "@aws-sdk/s3-request-presigner": "^3.600.0"
  }
}
```

Run `npm install` inside `backend/`.

### 3. Deploy the infrastructure

```bash
sam build
sam deploy --guided
```

Pick a stack name (e.g. `student-tracker`), accept the defaults, confirm. After ~3 minutes you'll see outputs including `AppURL`, `ApiURL`, `UserPoolId`, `UserPoolClientId`, and `WebBucketName`.

### 4. Create teacher accounts (Cognito has self-signup disabled for safety)

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <UserPoolId from output> \
  --username teacher@school.edu \
  --user-attributes Name=email,Value=teacher@school.edu Name=email_verified,Value=true \
  --temporary-password TempPass123!
```

The teacher will be forced to set a new password on first login.

### 5. Build and upload the frontend

In `frontend/`, configure your `.env`:

```
VITE_API_URL=<ApiURL from output>
VITE_USER_POOL_ID=<UserPoolId from output>
VITE_USER_POOL_CLIENT_ID=<UserPoolClientId from output>
```

Wire `StudentTracker.jsx` to call the API (the prototype uses local state — swap to `fetch(API_URL + '/students', { headers: { Authorization: 'Bearer ' + idToken } })`). Use the [amazon-cognito-identity-js](https://www.npmjs.com/package/amazon-cognito-identity-js) library for login.

Then:

```bash
npm run build
aws s3 sync dist/ s3://<WebBucketName from output>/
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

Open the `AppURL` in your browser. Done.

## Suggested next steps

- **Custom domain**: Add a Route 53 record + ACM cert, attach to CloudFront. ~$0.50/month for the hosted zone.
- **Photo upload UI**: The Lambda already exposes `GET /students/{id}/photo-upload` — it returns a presigned URL. Have the browser PUT the image directly to that URL (the bytes never touch Lambda, keeping costs low).
- **CSV export**: Easy to add — another Lambda route that scans the table and returns CSV.
- **Multi-class support**: Add a `classId` to the partition key (`STUDENT#<classId>#<id>`) when you're ready.

## Why this is the right choice for your use case

- **Truly cost-effective at low scale**: Nothing runs unless someone uses the app. A weekend or summer break costs $0.
- **No servers to maintain**: No patching, no security updates, no capacity planning.
- **Scales for free**: If the school grew to 100 teachers tomorrow, this architecture wouldn't need changes — and would still cost under $10/month.
- **Mobile-first by default**: The React frontend is responsive, CloudFront delivers it fast from edge locations close to the user.

## What I left out (and why)

- **VPC, NAT Gateway, load balancers**: Unnecessary for serverless. NAT Gateway alone is $32/month — would dwarf everything else.
- **RDS or Aurora**: Even the smallest instance is ~$15/month. DynamoDB at this scale is free.
- **ECS/Fargate**: A persistent container runs 24/7. Lambda runs only on request.
- **Self-managed auth**: Building login is a security minefield. Cognito is free at your scale and handles the hard parts.
