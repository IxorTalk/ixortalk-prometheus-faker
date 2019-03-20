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
class ConstantValueGenerator {
    constructor(name,props) {
        
        if (!name) {
            throw new Error('Missing mandatory name parameter');
        }

        if (!props.constantValue) {
            throw new Error("Missing mandatory constantValue parameter")            
        }

        this.name = name;
        this.props = props;
    }
    run() {
        this.value = this.props.constantValue
    }

}

module.exports = ConstantValueGenerator;