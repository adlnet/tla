import React, {Component} from 'react';

/*
    For now, just displays a link to the ADL Github site. Will try to configure a way to
    directly display repositories onto the site.
*/
export default class Repository extends Component {
    render() {
        return(
            <div>
                Redirect to <a href="https://www.github.com/adlnet">ADL Github</a>
            </div>
        )
    }
}