import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import keycloak from './../icons/lock.svg';
import kafka from './../icons/bolt.svg';
import moodle from './../icons/school.svg';
import github from './../icons/code.svg';
import cass from './../icons/cass.svg';
import book from './../icons/library.svg';

export default class LandingPageQuickLink extends Component {
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
            image = book;
        }

        return (
            <Card className="rounded-xl text-center" text='dark'>
                <a href={this.props.link} style={{width: "100%", height: "100%"}}>
                    <Card.Img variant="top" src={image}/>
                    <Card.Title>
                        {this.props.name}
                    </Card.Title>
                </a>
            </Card>
        )
    }
}