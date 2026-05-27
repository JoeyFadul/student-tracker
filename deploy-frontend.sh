#!/bin/bash
set -e  # Stop on any error

STACK_NAME="well-done"

echo "Building..."
cd frontend
npm run build

echo "Fetching stack outputs..."
BUCKET=$(aws cloudformation describe-stacks --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs[?OutputKey=='WebBucketName'].OutputValue" --output text)
DIST_ID=$(aws cloudformation describe-stacks --stack-name $STACK_NAME \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text)

echo "Uploading to s3://$BUCKET/..."
aws s3 sync dist/ s3://$BUCKET/ --delete

echo "Invalidating CloudFront $DIST_ID..."
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*" --output text --query 'Invalidation.Id'

echo "Done! Your app: https://$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='AppURL'].OutputValue" --output text | sed 's|https://||')"