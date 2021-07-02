import React, { Component } from 'react';

/*
    For now, just displays a link to the ADL Github site. Will try to configure a way to
    directly display repositories onto the site.
*/
export default class ADLFooter extends Component {
    render() {
        return (
            <footer className="text-center text-lg-start bg-light text-muted">
                <section style={{padding: "2rem"}}>
                    <div className="container text-center text-md-start">
                        <div className="row">
                            <div className="mx-auto">
                                <h6 className="text-uppercase fw-bold">
                                    <i className="fas fa-gem me-3"></i>About the ADL Initiative
                                </h6>
                                <p>
                                    The Advanced Distributed Learning (ADL) Initiative is a government program focused on bridging the gaps
                                    across DoD and other federal agencies.  Primarily, it researches, develops, and funds technologies that 
                                    encourage collaboration, facilitate interoperability, and promote best practices within the DoD.
                                </p>
                                <hr/>
                                <p>
                                    For more information, please visit <a className="text-bold" href="https://adlnet.gov">adlnet.gov</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="text-center p-4" style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                    © 2021 Copyright: <a className="text-reset fw-bold" href="https://adlnet.gov/">ADL Initiative</a>
                </div>
            </footer>
        )
    }
}

