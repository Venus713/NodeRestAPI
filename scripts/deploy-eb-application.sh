#!/bin/sh
SERVICE_NAME=$(jq -r '.name' ./package.json)
PACKAGE_VERSION=$(jq -r '.version' ./package.json)
VERSION_LABEL="$SERVICE_NAME-master-$PACKAGE_VERSION-$CI_COMMIT_SHORT_SHA"

aws elasticbeanstalk update-environment --environment-name "${ENV_NAME}" --version-label "${VERSION_LABEL}" --region "${REGION}"
