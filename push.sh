#!/usr/bin/env bash

version=$1

DOCKER_IMAGE_NAME=yattbot/junction:${version} #TODO paste version here
LOGIN=yattbot


echo ">>> Building image: ${DOCKER_IMAGE_NAME}"
docker build -t ${DOCKER_IMAGE_NAME} .

echo ">>> Logging in to Docker Hub"
cat pwd.txt | docker login --username ${LOGIN} --password-stdin


echo ">>> Pushing image"
docker push ${DOCKER_IMAGE_NAME}


echo ">>> All done!"
