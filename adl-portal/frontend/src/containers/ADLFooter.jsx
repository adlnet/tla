import React, { Component } from 'react';

/*
    For now, just displays a link to the ADL Github site. Will try to configure a way to
    directly display repositories onto the site.
*/
export default class ADLFooter extends Component {
    render() {
        return (
            <footer class="text-center text-lg-start bg-light text-muted">
                <section style={{padding: "2rem"}}>
                    <div class="container text-center text-md-start">
                        <div class="row">
                            <div class="mx-auto">
                                <h6 class="text-uppercase fw-bold">
                                    <i class="fas fa-gem me-3"></i>About the ADL Initiative
                                </h6>
                                <p>
                                    The Advanced Distributed Learning (ADL) Initiative is a government program focused on bridging the gaps
                                    across DoD and other federal agencies.  Primarily, it researches, develops, and funds technologies that 
                                    encourage collaboration, facilitate interoperability, and promote best practices within the DoD.
                                    <hr/>
                                    For more information, please visit <a class="text-bold" href="https://adlnet.gov">adlnet.gov</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <div class="text-center p-4" style={{"background-color": "rgba(0, 0, 0, 0.05)"}}>
                    © 2021 Copyright: <a class="text-reset fw-bold" href="https://adlnet.gov/">ADL Initiative</a>
                </div>
            </footer>
        )
    }
}

