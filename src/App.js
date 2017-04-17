import React from 'react'
import FormTabsContainer from './containers/FormTabsContainer'
import Graph from './containers/Graph'
import InfoPanel from './containers/InfoPanel'
import './App.css'
import logo from './logo.svg'

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <p className="App-intro">
                  introducation
                </p>
                <FormTabsContainer>
                </FormTabsContainer>

                <InfoPanel>
                </InfoPanel>

                <Graph>
                </Graph>
            </div>
            )
    }
}


export default App

