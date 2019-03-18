#!/bin/bash
#
#
#  2016 (c) IxorTalk CVBA
#  All Rights Reserved.
#
# NOTICE:  All information contained herein is, and remains
# the property of IxorTalk CVBA
#
# The intellectual and technical concepts contained
# herein are proprietary to IxorTalk CVBA
# and may be covered by U.S. and Foreign Patents,
# patents in process, and are protected by trade secret or copyright law.
#
# Dissemination of this information or reproduction of this material
# is strictly forbidden unless prior written permission is obtained
# from IxorTalk CVBA.
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.
#

serverUrl=http://ixortalk-gateway:8888

CLIENT_ID=ixortalkOAuthClient
CLIENT_SECRET=ixortalkOAuthClientSecret

ASSET_HOSTNAME=${1}
ASSET_PORT=${2}


RESP=`curl -X POST -u ${CLIENT_ID}:${CLIENT_SECRET} -H "Content-Type: application/x-www-form-urlencoded" -d 'grant_type=client_credentials' "${serverUrl}/uaa/oauth/token"`
BEARER_TOKEN=`echo ${RESP:17:36}`

ASSETS_LENGTH=`curl -H "Authorization: Bearer $BEARER_TOKEN" ${serverUrl}/assetmgmt/assets/search/property/assetId/$ASSET_HOSTNAME | jqn --color false 'size'`

echo "Found ASSETS_LENGTH [$ASSETS_LENGTH]"

if [ $ASSETS_LENGTH -eq 0 ]; then

    echo "Creating asset "

    BODY=`cat << EOF

    {
      "assetProperties": {
        "properties": {
            "assetId": "$ASSET_HOSTNAME",
            "hostname": "$ASSET_HOSTNAME",
            "port": $ASSET_PORT
        }
      }
    }
EOF`

    echo $BODY

    echo "Launching request...."

    curl -X POST \
      ${serverUrl}/assetmgmt/assets \
      -H "Authorization: Bearer $BEARER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$BODY"


   exit;
else
   echo "Not creating asset - already exists"
fi




