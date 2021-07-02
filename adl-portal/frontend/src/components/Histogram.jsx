import React, { Component } from 'react';
import { VegaLite } from 'react-vega';

export default class Histogram extends Component {
    constructor() {
        super();
        this.state = {
            spec: {
                $schema: "https://vega.github.io/schema/vega-lite/v4.json",
                data: {name: 'table'},
                transform: [{
                    "filter": {"and": [
                    {"field": "xAPI Users", "valid": true},
                    {"field": "# of xAPI Statements Sent", "valid": true}
                    ]}
                }],
                mark: "rect",
                width: 300,
                height: 200,    
                encoding: {
                    x: {
                    bin: {"maxbins":60},
                    field: "xAPI Users",
                    type: "quantitative"
                    },
                    y: {
                    bin: {"maxbins": 40},
                    field: "# of xAPI Statements Sent",
                    type: "quantitative"
                    },
                    color: {
                    aggregate: "count",
                    type: "quantitative"
                    }
                },
                config: {
                    view: {
                    stroke: "transparent"
                    }
                }
            },
            data: {
                table: [
                    {"xAPI Users": 12, "# of xAPI Statements Sent": 10},
                    {"xAPI Users": 6, "# of xAPI Statements Sent": 5},
                    {"xAPI Users": 8, "# of xAPI Statements Sent": 8},
                    {"xAPI Users": 20, "# of xAPI Statements Sent": 18},
                    {"xAPI Users": 17, "# of xAPI Statements Sent": 14},
                    {"xAPI Users": 2, "# of xAPI Statements Sent": 4}
                ]
            }
        }
    }

    render() {
        return (
            <div>
                <VegaLite spec={this.state.spec} data={this.state.data}/>
            </div>
        )
    }
}