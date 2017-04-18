import React, { Component } from 'react'
import FormTabsContainer from './containers/FormTabsContainer'
import Graph from './containers/Graph'
import InfoPanel from './containers/InfoPanel'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css'
// import logo from './logo.svg'

class App extends Component {
    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <p className="App-intro">
                    introducation
                    </p>
                    <FormTabsContainer>
                    </FormTabsContainer>

                    <InfoPanel>
                    </InfoPanel>

                    {/*<Graph >
                    </Graph>*/}
                </div>
            </MuiThemeProvider>
            )
    }
}


export default App

