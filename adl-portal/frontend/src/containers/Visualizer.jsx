import React, {Component} from 'react';
import HeatMap from '../components/HeatMap';
import RollingAvg from '../components/RollingAvg';
import Histogram from '../components/Histogram';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

/*
    Visualizer container which holds our data visualization
*/

export default class Visualizer extends Component {
    constructor() {
        super();
        this.state = {
            currentGraph: null
        }
    }

    renderGraph = (event) => {
        /* 
            depending on button press, will update state to correct graph that user has picked.
            if a user presses on a button that has already been selected, will remove the graph.
        */
        let btnId = event.target.dataset.id

        if (btnId === "rolling") {
            this.state.currentGraph === "rolling" ? this.setState({currentGraph: null}) : this.setState({currentGraph: btnId})
        } else if (btnId === "histogram") {
            this.state.currentGraph === "histogram" ? this.setState({currentGraph: null}) : this.setState({currentGraph: btnId})
        } else if (btnId === "heatmap") {
            this.state.currentGraph === "heatmap" ? this.setState({currentGraph: null}) : this.setState({currentGraph: btnId})
        }
    }

    render() {
        let graph = <div></div>
        if (this.state.currentGraph === "rolling") {
            graph = <RollingAvg/>
        } else if (this.state.currentGraph === "histogram") {
            graph = <Histogram/>
        } else if (this.state.currentGraph === "heatmap") {
            graph = <HeatMap/>
        }

        return (
            <div>
                <ButtonGroup >
                    <Button variant="secondary" data-id="rolling" onClick={this.renderGraph}>Rolling Average Graph</Button>
                    <Button variant="secondary" data-id="histogram" onClick={this.renderGraph}>Histogram Graph</Button>
                    <Button variant="secondary" data-id="heatmap" onClick={this.renderGraph}>Heatmap Graph</Button>
                </ButtonGroup>
                
                {/* depending on the current state(graph), will render the appropriate set of
                graphs. by default, will not render any graphs unless user clicks a button. */}
                {graph}
            </div>
        )
    }
}