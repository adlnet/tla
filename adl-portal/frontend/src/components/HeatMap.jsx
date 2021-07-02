import React, { Component } from 'react';
import { VegaLite } from 'react-vega';

export default class HeatMap extends Component {
    constructor() {
        super();
        this.state = {
          spec: {
            $schema: "https://vega.github.io/schema/vega-lite/v4.json",
            width: 500,
            height: 300,
            data: {
              name: "table",
              format: {
                "type": "topojson",
                "feature": "counties"
              }
            },
            transform: [{
              lookup: "id",
              from: {
                data: {
                  url: "data/unemployment.tsv"
                },
                key: "id",
                fields: ["rate"]
              }
            }],
            projection: {
              type: "albersUsa"
            },
            mark: "geoshape",
            encoding: {
              color: {
                field: "rate",
                type: "quantitative"
              }
            }
          },
          data: {
            table: [{
              type: "FeatureCollection",
              features: [
                { type: "Feature",
                  geometry:{
                    type: "MultiPolygon",
                    coordinates: [-117.862869, 33.678925]},
                    properties: {
                      name: "John Wayne Airport (SNA)"
                  },
                  rate: "0.065"
                },  
                { type: "Feature",
                  geometry:{
                    type: "MultiPolygon",
                    coordinates: [-81.143127, 32.015644]},
                    properties: {
                      name: "Hunter Army Airfield"
                  },
                  rate: "0.083"
                },  
                { type: "Feature",
                  geometry:{
                    type: "MultiPolygon",
                    coordinates: [-73.780968, 40.641766]},
                    properties: {
                      name: "John F. Kennedy Airport (JFK)"
                  },
                  rate: "0.051"
                },  
                { type: "Feature",
                  geometry:{
                    type: "MultiPolygon",
                    coordinates: [-87.904724, 41.978611]},
                    properties: {
                      name: "O'Hare International Airport (ORD)"
                  },
                  rate: "0.027"
                },  
              ]
              }]
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


/*

    spec: {
                width: 500,
                height: 300,
                data: {
                  url: "data/population_engineers_hurricanes.csv"
                },
                transform: [
                  {
                    lookup: "id",
                    from: {
                      data: {
                        url: "data/us-10m.json",
                        format: {
                          type: "topojson",
                          feature: "states"
                        }
                      },
                      key: "id"
                    },
                    as: "geo"
                  }
                ],
                projection: {"type": "albersUsa"},
                mark: "geoshape",
                encoding: {
                  shape: {
                    field: "geo",
                    type: "geojson"
                  },
                  color: {
                    field: {"repeat": "row"},
                    type: "quantitative"
                  }
                }
            }

*/