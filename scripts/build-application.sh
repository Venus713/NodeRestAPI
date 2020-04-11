#!/bin/sh
SERVICE_NAME=$(jq -r '.name' ./package.json)
PACKAGE_VERSION=$(jq -r '.version' ./package.json)
VERSION_LABEL="$SERVICE_NAME-master-$PACKAGE_VERSION-$CI_COMMIT_SHORT_SHA"
APP_VERSION_DESC="Gitlab Build @ branch[master] build[$PACKAGE_VERSION] commit[$CI_COMMIT_SHORT_SHA]"

# Build Docker and push to ECR
DOCKER_TAG="$PACKAGE_VERSION-$CI_COMMIT_SHORT_SHA"
DOCKER_REPO="$ECR_REPO:$DOCKER_TAG"
sed -i "s,TAG,${DOCKER_TAG},g" ./infrastructure/Dockerrun.aws.json
docker build -t $DOCKER_REPO .
docker push $DOCKER_REPO

# Package and create EB application version
mkdir eb-app
cp -r ./infrastructure/.ebextensions eb-app/.ebextensions
cp ./infrastructure/Dockerrun.aws.json eb-app/Dockerrun.aws.json
cd eb-app
# zip -r "${VERSION_LABEL}.zip" .
zip svc-auth.zip -FSr * .[^.]*


AWS_APP_VERSION=$(aws elasticbeanstalk describe-application-versions --application-name "topKamera-backend" --version-label "${VERSION_LABEL}" --region eu-central-1 --query ApplicationVersions[].VersionLabel --output text)

if [[ $AWS_APP_VERSION == $VERSION_LABEL ]]; then
  echo "Application version $VERSION_LABEL already exists";
else
  S3Key="svc-auth/$VERSION_LABEL.zip"
  aws s3 cp ./svc-auth.zip s3://$S3_BUCKET/svc-auth/$VERSION_LABEL.zip --region ${REGION}
  aws elasticbeanstalk create-application-version --application-name "${EB_APP_NAME}" --description "${APP_VERSION_DESC}" --source-bundle S3Bucket=${S3_BUCKET},S3Key=$S3Key --version-label "${VERSION_LABEL}" --region ${REGION}
fi