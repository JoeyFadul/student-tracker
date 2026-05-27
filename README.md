# Student Tracker

A serverless web app for tracking elementary student rewards. Built on AWS Lambda, DynamoDB, S3, CloudFront, and Cognito.

## Architecture

```
Browser → CloudFront → S3 (static React frontend)
       → API Gateway → Lambda → DynamoDB (students + point history)
                              → S3 (student photos)
       → Cognito (auth)
```

Stack name: `well-done` | Region: `us-east-1`

---

## Running locally

### Prerequisites

- Node.js 20+
- AWS CLI configured (`aws configure`)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. It reads from `frontend/.env` — make sure that file exists with the correct values (see [Environment variables](#environment-variables)).

### Backend

The backend runs as a Lambda function and is not designed for local execution. All API calls in development hit the deployed Lambda via the API Gateway URL in `.env`.

---

## Deploying changes

### Frontend changes

Any change to `frontend/src/` — run the deploy script from the project root:

```bash
./deploy-frontend.sh
```

This builds the React app, syncs it to S3, and invalidates the CloudFront cache. Takes ~30 seconds. The script prints the live URL when done.

### Backend changes (Lambda)

Any change to `backend/index.js`:

```bash
sam build && sam deploy
```

SAM uses the config in `samconfig.toml` — no flags needed. Confirm the changeset when prompted.

### Infrastructure changes (DynamoDB, Cognito, CloudFront, etc.)

Any change to `template.yaml` also uses:

```bash
sam build && sam deploy
```

Review the changeset carefully before confirming — some resource replacements (e.g. DynamoDB table) are destructive.

---

## Environment variables

The frontend reads from `frontend/.env` (not committed — create it locally):

```
VITE_API_URL=<ApiURL from stack outputs>
VITE_USER_POOL_ID=<UserPoolId from stack outputs>
VITE_USER_POOL_CLIENT_ID=<UserPoolClientId from stack outputs>
```

To get these values from the live stack at any time:

```bash
aws cloudformation describe-stacks --stack-name well-done \
  --query "Stacks[0].Outputs" --output table
```

---

## Managing user accounts

Cognito self-signup is disabled. Create teacher accounts manually:

```bash
aws cognito-idp admin-create-user \
  --user-pool-id <UserPoolId from stack outputs> \
  --username teacher@school.edu \
  --user-attributes Name=email,Value=teacher@school.edu Name=email_verified,Value=true \
  --temporary-password TempPass123!
```

The teacher sets a permanent password on first login.
