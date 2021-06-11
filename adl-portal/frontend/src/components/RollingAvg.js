import React, {Component} from 'react';
import { VegaLite } from 'react-vega';

export default class RollingAvg extends Component {
    constructor(){
        super()
        this.state = {
            spec: {
                    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
                    "auto-size": {"resize": true},
                    description: "Plot showing a 30 day rolling average with raw values in the background.",
                    width: 400,
                    height: 300,
                    data: {name: 'table'},
                    encoding: {
                      x: {field: "date", timeUnit: "month", type: "temporal", title: "Date"},
                      y: {field: "servers", title: "TLA Server Shutdowns "}
                    },
                    mark: {"type": "point", "opacity": 0.3},
                    // encoding: {
                    //   x: {timeUnit: "month", field: "Date"},
                    //   y: {type: "quantitative", field: "servers", title: "Server Shutdowns"}
                    // }
                    // layer: [
                    //   {
                    //     mark: {"type": "point", "opacity": 0.3},
                    //     encoding: {
                    //       x: {timeUnit: "month", field: "Date"},
                    //       y: {type: "quantitative", field: "servers", title: "Server Shutdowns"}
                    //     }
                    //   },
                      // {
                      //   mark: {type: "line", color: "red", size: 3},
                      //   encoding: {
                      //     x: {field: "date", timeUnit: "month"},
                      //     y: {field: "server shutdowns", aggregate: "mean"}
                      //   }
                      // }
                    // ]
            },
            data: {
                table: [
                  {"date": "January", "servers": 2},
                  {"date": "February", "servers": 5},
                  {"date": "March", "servers": 3},
                  {"date": "April", "servers": 6},
                  {"date": "May", "servers": 8},
                  {"date": "June", "servers": 4},
                  {"date": "July", "servers": 1},
                  {"date": "August", "servers": 0},
                  {"date": "September", "servers": 2},
                ]
            }
        }
    }

    render() {
        return (
            <div>
                <VegaLite
                    spec={this.state.spec}
                    data={this.state.data}    
                />
            </div>
        )
    }
}