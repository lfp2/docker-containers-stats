import React, { Component } from 'react';
import config from './config';
import Firebase from 'firebase';
import * as d3 from 'd3';

class MessageBase extends Component {
    constructor(props) {
        super(props);
        Firebase.initializeApp(config);
        this.state = {
            messages: [],
            packetsReceived: [],
            packetsDropped: [],
            timestamp: []
        }
    }

    componentDidMount() {
        this.getUserData();
    }

    getUserData() {
        let ref = Firebase.database().ref('docker-infos/containers/');
        ref.on('value', snapshot => {
            const data = snapshot.val();
            var packetsReceived = [];
            var packetsDropped = []
            var timestamp = [];
            for (var container in data) {
                for (var timestampKey in data[container]) {
                    timestamp.push(timestampKey);
                    packetsReceived.push(data[container][timestamp]['networks']['eth0']['rx_bytes']);
                    packetsDropped.push(data[container][timestamp]['networks']['eth0']['tx_bytes']);
                }
            }
            this.setState({
                messages: data,
                packetsReceived: packetsReceived,
                timestamp: timestamp
            });
            this.drawLineChart();
        })
    }

    drawLineChart(){
        const margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
            const svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("border", "1px solid black")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
            
                var hourNameFormat = d3.timeFormat("%X");
                var x = d3.scaleTime()
                .domain(d3.extent(this.state, function(d) { return hourNameFormat(new Date(d.timestamp)); }))
                .range([ 0, width ]);
                svgCanvas.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

                var y = d3.scaleLinear()
                .domain(d3.extent(this.state, function(d) { return d.packetsReceived; }))
                .range([ height, 0 ]);
              svgCanvas.append("g")
                .call(d3.axisLeft(y));

                svgCanvas.append("path")
      .datum(this.state)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(hourNameFormat(new Date(d.timestamp))) })
        .y(function(d) { return y(d.packetsReceived) })
        )

    }

    render() {
        return (
            <div>
                <div ref="canvas"></div>
                <div>
                    {this.state.timestamp}
                </div>
                <div>
                    {this.state.packetsReceived}
                </div>
            </div>
        )
    }
}

export default MessageBase