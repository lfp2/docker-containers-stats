import React, { Component } from 'react';
import config from './config';
import Firebase from 'firebase';
import RTChart from 'react-rt-chart';


class MessageBase extends Component {
    constructor(props) {
        super(props);
        Firebase.initializeApp(config);
        Firebase.database();
        this.state = {
            containers: [],
            data: {}
        }
    }

    componentDidMount() {
        this.getUserData();
    }

    getUserData() {
        let ref = Firebase.database().ref('docker-infos/containers/');
        ref.on('value', snapshot => {
            const data = snapshot.val();
            for (var container in data) {
                for (var timestampKey in data[container]) {
                    var newData = {
                        date: new Date(timestampKey),
                        packetsReceived: data[container][timestampKey]['networks']['eth0']['rx_bytes'],
                        packetsDropped: data[container][timestampKey]['networks']['eth0']['tx_bytes']
                    }
                    this.setState({data: newData});
                }
            }
        });
    }


    render() {
        return (
            <div>
                <RTChart
            fields={['packetsReceived','packetsDropped']}
            data={this.state.data} />
            </div>
        )
    }
}

export default MessageBase