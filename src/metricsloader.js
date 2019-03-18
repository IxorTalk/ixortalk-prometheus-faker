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

'use strict';

const client = require('prom-client');
const createValueGenerator = require('./valueGeneratorFactory').createValueGenerator;

const loadConfig = require('./configLoader').loadConfig;

class MetricsLoader {
    
    constructor() {
        loadConfig(process.env.CONFIG_URI).then(config => this.loadMetrics(config));
	}

	loadMetrics(metricConfig) {
        console.log("Loading ",metricConfig)
        this._metricHolders = {};

        client.register.clear();

        var that = this;

        Object.keys(metricConfig.metrics).forEach(function(key,index) {
            that.updateMetric(key,metricConfig.metrics[key]);
        });
    }

    updateMetric(key,metric) {

        console.log("Updating metric " + key + ":",metric)

        var generator

        generator = createValueGenerator(metric.type,metric.props)
        generator.props.enabled = metric.enabled

        var prometheusMetric = client.register.getSingleMetric(key)

        if (!prometheusMetric) {

            prometheusMetric = new client.Gauge({
                name: key,
                help: key + '_Help'
            });
        }

        this._metricHolders[key] = {
            "generator": generator,
            "prometheusMetric": prometheusMetric
        };
    }

	client() {
        return client;
    }

	processValueGenerators() {
        var that = this;

		Object.keys(this._metricHolders).forEach(function(generatorName) {

            let metricHolder = that._metricHolders[generatorName];
            let generator = metricHolder.generator;
            let prometheusMetric = metricHolder.prometheusMetric;

            if (generator.props.enabled) {

                generator.run()

                console.log("Setting " + prometheusMetric.name + " = " + generator.value)
                prometheusMetric.set(generator.value)

            }

        });   
	}

}

module.exports = MetricsLoader;
module.exports.globalMetricsLoader = new MetricsLoader();
