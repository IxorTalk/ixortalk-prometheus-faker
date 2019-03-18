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

var http = require('http');
var util = require('util');
var express = require("express");
var bodyParser = require('body-parser')

const loader = require('./metricsloader')


var globalMetricsLoader = loader.globalMetricsLoader;

var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json() );

app.post("/updateconfig", (request, response) => {
    globalMetricsLoader.loadMetrics(request.body)
    response.sendStatus(200);
})

app.post("/updateconfig/:metricId", (request, response) => {

    metricName = request.params.metricId;
    metricValue = request.body;

    globalMetricsLoader.updateMetric(metricName,metricValue);

    response.sendStatus(200);

})

app.post("/health", (request, response) => {

    response.sendStatus(200);

})

app.get("/prometheus", (request, response) => {

    globalMetricsLoader.processValueGenerators();
    response.set('Content-Type','text/plain');
    response.send(globalMetricsLoader.client().register.metrics());

})

let port = process.env.SERVER_PORT || 9191;
app.listen(port);

console.log('Prometheus-faker running on port ' + port);