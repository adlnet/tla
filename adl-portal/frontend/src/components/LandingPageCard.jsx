import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import nodeTree from './../icons/node-tree.png';
import keycloak from './../icons/lock.svg';
import kafka from './../icons/bolt.svg';
import moodle from './../icons/school.svg';
import github from './../icons/code.svg';
import cass from './../icons/cass.png';
import book from './../icons/library.svg';

export default class LandingPageCard extends Component {
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
            <Card className="rounded-xl text-center" style={{padding: "20px"}} text='dark'>
                <Card.Link target="_blank" href={this.props.link}>
                    <Card.Img variant="top" src={image}/>
                </Card.Link>
                <Card.Title>
                    {this.props.name}
                </Card.Title>
                <Card.Text style={{textAlign: "left"}}>
                    {this.props.description}
                </Card.Text>
                <Button href={this.props.link} target="_blank" className="btn btn-lg btn-block btn-secondary">{this.props.linkText || "Learn More"}</Button>
            </Card>
        )
    }
}