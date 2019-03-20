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

FROM node:9-slim

# Create app directory
RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY src /usr/src/app/src

RUN npm install

# Bundle app source
COPY . /usr/src/app

ADD docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
HEALTHCHECK CMD curl -s http://localhost:9191/health -o /dev/null

