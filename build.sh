#!/usr/bin/env bash

ROOT=$(pwd)
resources=${ROOT}/backend/src/main/resources

BE=${ROOT}/backend
FE=${ROOT}/frontend
PUBLIC=${resources}/public
TEMPLATES=${resources}/templates
BUNDLE=${FE}/dist  # from webpack config
echo "Templates dir: ${TEMPLATES}"
echo "Public dir   : ${PUBLIC}"
echo "Backend dir  : ${BE}"
echo "Bundle dir   : ${BUNDLE}"


echo ">>> removing old bundle"
echo ">>> make sure static data is not deleted"
rm -rf ${PUBLIC}
mkdir ${PUBLIC}
rm -rf ${TEMPLATES}
mkdir ${TEMPLATES}



echo ">>> building frontend"
cd ${FE}

yarn run build



echo ">>> copying bundle"
cp -R ${BUNDLE}/. ${PUBLIC}
cp ${BUNDLE}/index.html ${TEMPLATES}/index.html



echo ">>> building backend"
cd ${BE}
./gradlew clean build
mv ${BE}/build/libs/vcomparison-1.0.jar ${ROOT}/app.jar

