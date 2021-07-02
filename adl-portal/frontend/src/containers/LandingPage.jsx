import React, { Component } from 'react';
import { CardColumns } from "react-bootstrap";
import LandingPageDescriptor from '../components/LandingPageDescriptor';
import LandingPageQuickLink from '../components/LandingPageQuickLink';

/*
    Basic landing page for when a user enters the site for the first time.
*/

export default class LandingPage extends Component {

    render() {
        return (
            <div>
                <div className="container">

                    <br></br>
                    <h4 className="display-4" >ADL's TLA Reference Implementation</h4>
                    <p className="text-muted">
                        Welcome to the ADL's TLA reference implementation.  This page includes links to the primary components within the
                        implementation, as well as a link to the codebase itself.  All software used within this implementation is open-source
                        and government owned.
                    </p>
                    <br />
                    <h4>What is this?</h4>
                    <p className="text-muted">
                        This page is a sort of directory for the services currently running as part of ADL's Total Learning Architecture (TLA)
                        Reference Implementation.  Given that the specifications within the TLA are not implementation instructions themselves,
                        the ADL Initiative maintains an open-source, compliant TLA implementation as a community resource and
                        as a reference for engineers and organizations attempting to deploy their own system.
                    </p>

                    <div className="alert alert-secondary">
                        🛠 This site and the full system itself are both under active development and rebuild themselves based on GitHub activity.
                        Connectivity and responsiveness may degrade during these times.
                    </div>

                    <br />
                    <h4>Quick Links</h4>
                    <p className="text-muted">
                        Most of these links will require an account with the TLA's Single Sign-On system.  Anyone with a <code>.gov</code> or <code>.mil</code> email
                        address can register for an account.  Otherwise, access requests can be granted to relevant parties and stakeholders.
                    </p>

                    <div className="row">
                        <CardColumns>

                            <LandingPageQuickLink name="Kafka" image="kafka" className="col-sm-4"
                                link="https://tla-dev-kafka.usalearning.net/monitor" />

                            <LandingPageQuickLink name="Moodle" image="moodle"
                                link="https://tla-dev-moodle.usalearning.net/" />

                            <LandingPageQuickLink name="Keycloak" image="keycloak"
                                link="https://keycloak.org" />

                            <LandingPageQuickLink name="Catalog" image="xi"
                                link="https://tla-dev-acts.usalearning.net/xi" />

                            <LandingPageQuickLink name="CaSS" image="cass"
                                link="https://adlnet.gov/projects/cass/" />

                            <LandingPageQuickLink name="Source" image="github"
                                link="https://github.com/adlnet" />

                        </CardColumns>
                    </div>

                    <br />
                    <br />
                    <h4>Service Descriptions</h4>
                    <p className="text-muted">
                        While the overall system may seem a bit complex, the high-level responsibilities each component are fairly straightforward.
                    </p>
                    <br />

                    <div className="row container">

                        <LandingPageDescriptor
                            name="Apache Kafka"
                            subtitle="Real-Time Events and Messaging"
                            image="kafka"
                            link="https://tla-dev-kafka.usalearning.net/monitor"
                            description="An open-source distributed event streaming platform. Kafka enables the real-time transmission 
                                and propagation of learner xAPI traffic within this system.  Additionally, Kafka's architecture enables both high throughput
                                and horizontal scaling." />


                        <LandingPageDescriptor
                            name="Moodle"
                            subtitle="Moodle - An Open-Source Learning Management System"
                            image="moodle"
                            link="https://tla-dev-moodle.usalearning.net/"
                            description="Moodle is a learning platform designed to provide educators, administrators and learners with a single robust,
                                secure and integrated system to create personalised learning environments.  ADL has been using Moodle for several years
                                due to its relative ease of use and popularity within the distributed learning community." />


                        <LandingPageDescriptor
                            name="Keycloak"
                            subtitle="Identity and Single Sign-On (SSO)"
                            image="keycloak"
                            link="http://keycloak.org"
                            description="Single Sign-On system using OpenID Connect. This provides the unique learner ID used by xAPI traffic 
                                within the reference implementation." />


                        <LandingPageDescriptor
                            name="Catalog"
                            subtitle="Collection of Course Metadata"
                            image="xi"
                            link="https://tla-dev-acts.usalearning.net/xi"
                            description="Stores learner and learning content-related metadata." />


                        <LandingPageDescriptor
                            name="CaSS"
                            subtitle="Competency and Skills System"
                            image="cass"
                            link="https://adlnet.gov/projects/cass/"
                            description="A competency management system that allows competencies, competency frameworks, and competency-based 
                                learner models to be managed independently of any learning management system (LMS), course, training program, or credential." />


                        <LandingPageDescriptor
                            name="Source"
                            subtitle="GitHub repository for the TLA"
                            image="github"
                            link="https://github.com/adlnet"
                            hideLine="true"
                            description="All code developed for the TLA reference implementation is available on ADL's GitHub page.  For the TLA repository,
                                all code is grouped by server, with each server having a set of Docker instructions for deploying it." />
                    </div>
                </div>
                <br/>
            </div>
        )
    }
}