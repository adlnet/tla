import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import nodeTree from './../icons/node-tree.png';
import keycloak from './../images/keycloak-logo.png';
import kafka from './../images/kafka-logo.webp';
import moodle from './../images/moodle-logo.png';
import github from './../images/github-logo.jpg';
import cass from './../icons/cass-logo.jpg';

export default class Cards extends Component {
    render() {
        let image = ""

        if (this.props.image === "kafka") {
            image = kafka
        } else if (this.props.image === "keycloak") {
            image = keycloak
        } else if (this.props.image === "moodle") {
            image = moodle
        } else if (this.props.image === "github") {
            image = github
        } else if (this.props.image === "cass") {
            image = cass
        } else {
            image = nodeTree;
        }

        return (
            <div className="flex-initial">
                <Card className="rounded-xl w-64 text-center" bg='light' text='dark'>
                    <Card.Img variant="top" src={image}/>
                    <Card.Title>
                        {this.props.name}
                    </Card.Title>
                    <Card.Text>
                        {this.props.definition}
                    </Card.Text>
                    <Button href={this.props.link} target="_blank" className="bg-color-buttons">Learn More</Button>
                </Card>
            </div>
        )
    }
}