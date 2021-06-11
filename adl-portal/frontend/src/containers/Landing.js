import React, {Component} from 'react';
import Cards from '../components/Cards';

/*
    Basic landing page for when a user enters the site for the first time.
*/

export default class Landing extends Component {
    renderCards = (array) => {
        if (array.length === 0) {
            return (
                <div></div>
            )
        } else {
            let cards = [];
            for (let i = 0; i < array.length; i++) {
                cards.push(<Cards name={array[i].name} link={array[i].link} image={array[i].image} definition={array[i].definition} />)
            }
            return (
                <div className="justify-between m-16 grid grid-cols-4 grid-flow-row gap-x-6 gap-y-6">
                    {cards}
                </div>
            )
        }
    }

    render() {
        let cards = [
            {name: "KAFKA", link: "https://tla-dev-kafka.usalearning.net/monitor", image: "kafka", definition: "An open-source distributed event streaming platform. Kafka enables the real-time transmission and propagation of learner xAPI traffic within this system"},
            {name: "Moodle", link: "https://tla-dev-moodle.usalearning.net/", image: "moodle", definition: "A Moodle based content management system (CMS) for the ADL Initiative, instrumented with xAPI."},
            {name: "Keycloak SSO", link: "https://keycloak.org", image: "keycloak", definition: "Single Sign-On system using OpenID Connect. This provides the unique learner ID used by xAPI traffic within the reference implementation."},
            {name: "Experience Index (XI)", link: "https://tla-dev-acts.usalearning.net/xi", image: "xi", definition: "Stores learner and learning content-related metadata."},
            {name: "Competency and Skills System (CaSS)", link: "https://adlnet.gov/projects/cass/", image: "cass", definition: "A competency management system that allows competencies, competency frameworks, and competency-based learner models to be managed independently of any learning management system (LMS), course, training program, or credential."},
            {name: "ADL GitHub", link: "https://github.com/adlnet", image: "github", definition: "ADL Initiative's GitHub repository."}
        ]

        return(
            <div>
                <div className="landing-main">
                    This is a development site, and not intended for production
                </div>
                    <h2 className="text-center">ADL Projects</h2>
                {/* <div className="landing-prompt object-center">
                    ADL Projects
                </div> */}
                <div className="main-content">
                    {this.renderCards(cards)}
                </div>
            </div>
        )
    }
}