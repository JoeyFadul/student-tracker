# CI/CD setup

The repo ships two GitHub Actions workflows. They use OIDC to assume an AWS
IAM role; no static AWS credentials live in GitHub.

- **`pr.yml`** — runs on every PR and on push to `main`. Lints + builds the
  frontend and `sam validate`s + builds the backend. No AWS access.
- **`deploy.yml`** — manual trigger (Actions tab → Run workflow). Pick `prod`
  or `dev`. Deploys the SAM stack, builds the frontend with the stack's
  outputs, syncs to S3, invalidates CloudFront.

## One-time AWS setup

```bash
aws cloudformation deploy \
  --template-file infra/github-oidc.yaml \
  --stack-name well-done-cicd \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides GitHubRepo=JoeyFadul/student-tracker
```

If you already have an OIDC provider for `token.actions.githubusercontent.com`
in this AWS account, add `CreateOidcProvider=false` to the
`--parameter-overrides` flag — only one provider is allowed per account.

Grab the role ARN from the stack outputs:

```bash
aws cloudformation describe-stacks --stack-name well-done-cicd \
  --query "Stacks[0].Outputs[?OutputKey=='RoleArn'].OutputValue" --output text
```

## One-time GitHub setup

1. In the repo settings, create two **Environments**: `prod` and `dev`. Add
   protection rules to `prod` (required reviewers, wait timer, etc).
2. For each environment, add a secret named **`AWS_DEPLOY_ROLE_ARN`** with the
   value of the role ARN you grabbed above. (Same role for both environments;
   you can split them later if you want narrower per-env roles.)
3. The role uses **`PowerUserAccess`** by default — broad but no IAM admin.
   Tighten by replacing the managed policy with a custom one once the
   resources are stable.

## What the deploy does

1. `sam build` + `sam deploy --config-env <env>` from `samconfig.toml`
2. Reads the deployed stack's outputs (web bucket, distribution id, API URL,
   user pool ids)
3. `npm ci` + `npm run build` in `frontend/` with those outputs as
   `VITE_*` env vars (no `.env` file in CI)
4. `aws s3 sync` + CloudFront invalidation

## Pulling local deploys off the laptop

Once this is working, retire `deploy-frontend.sh` and stop running
`sam deploy` locally. Push changes through PRs → CI → the deploy workflow.
