import React, { Component } from 'react';
import { Media } from "react-bootstrap";
import keycloak from './../icons/lock.svg';
import kafka from './../icons/bolt.svg';
import moodle from './../icons/school.svg';
import github from './../icons/code.svg';
import cass from './../icons/cass.png';
import book from './../icons/library.svg';

export default class LandingPageDescriptor extends Component {
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

        let closureLine = this.props.hideLine === "true" ? null : <hr/>;

        return (

            <div style={{width: "100%"}}>
                <Media >
                    <a href={this.props.link} target="_blank" rel="noreferrer">
                        <img
                            width={64}
                            height={64}
                            className="mr-3"
                            src={image}
                            alt={this.props.name}
                        />
                    </a>
                    <Media.Body>
                        <h5 className="text-muted" style={{display: "inline", marginRight: "0.2rem"}}>{this.props.name} -</h5>
                        <h6 className="text-muted" style={{display: "inline", marginLeft: "0.2rem"}}>{this.props.subtitle}</h6>
                        <p className="text-muted light"> {this.props.description} </p>
                    </Media.Body>
                </Media>
                {closureLine}
            </div>
        )
    }
}