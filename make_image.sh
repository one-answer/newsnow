#!/bin/bash
DOCKER_IMAGE_NAME_VERSION="v1"
if [ -n "$1" ] ;then
  DOCKER_IMAGE_NAME_VERSION="$1"
fi
echo "DOCKER_IMAGE_NAME_VERSION : $DOCKER_IMAGE_NAME_VERSION"
DOCKER_IMAGE_NAME="aolifu/newsnow:${DOCKER_IMAGE_NAME_VERSION}"
docker build -t "${DOCKER_IMAGE_NAME}" .
docker push "${DOCKER_IMAGE_NAME}"