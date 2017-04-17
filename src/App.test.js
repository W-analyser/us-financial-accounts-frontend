import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import financialAccountUsReducer from './reducer'





it('renders without crashing', () => {
    // let store = createStore(financialAccountUsReducer,
    //                     applyMiddleware(thunkMiddleware))

    // let app = (
    // <Provider store={store}>
    //     <App>
    //     </App>
    // </Provider>
    // )

    // const div = document.createElement('div')
    // ReactDOM.render(app, div)
});
