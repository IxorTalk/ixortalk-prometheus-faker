/*
 *
 *  2016 (c) IxorTalk CVBA
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of IxorTalk CVBA
 *
 * The intellectual and technical concepts contained
 * herein are proprietary to IxorTalk CVBA
 * and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 *
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from IxorTalk CVBA.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.
 */
var inputJson = require('../input.json');
var http = require('http');
var fs = require('fs');
var fetch = require("node-fetch");

var promisify =require('util').promisify;

const readFile = promisify(fs.readFile);
const webPattern = /^((http|https):\/\/)/

exports.loadConfig = async(uri) => {

    try {
        console.log("resolving config from uri ",uri)

        if (webPattern.test(uri)) {

            console.log("trying web ", uri)
            const response = await fetch(uri).catch();
            const json = await response.json();
            return json

        } else if (uri.startsWith("file://")) {

            console.log("trying file ",uri.substring(7))
            const file = await readFile(uri.substring(7));
            const json = JSON.parse(file);
            return json

        }

    // Then try default
    } catch (error) {
        console.log("error occured, trying default ", error)
        return inputJson;
    }
};
