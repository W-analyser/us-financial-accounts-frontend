import React from 'react'
import F1Form from './F1Form'
import { connect } from 'react-redux'
import { selectTab } from '../actions'
import { Tabs, Tab } from 'material-ui/Tabs'
import PropTypes from 'prop-types';

class FormTabsContainer extends React.Component {
    constructor(props) {
        super(props)
        this.selectTab = this.selectTab.bind(this)
    }

    selectTab(index) {
        this.props.dispatch(selectTab(index))
    }

    render() {
        const f1FormTab = (
            <Tab key='F1Form' label={this.props.tabs[0].name} value={0}>
                <F1Form >
                </F1Form>
            </Tab>
            )
        const tabContainers = [f1FormTab,]

        return (
            <Tabs onChange={ this.selectTab }
                    value={this.props.active}>
                { tabContainers }
            </Tabs>
            )
    }
}

FormTabsContainer.propTypes = {
    tabs: PropTypes.array.isRequired,
    active: PropTypes.number.isRequired
}

const mapStateToProps = state => {
    return {
        tabs: state.tabs.tabs,
        active: state.tabs.active
    }
}

export default connect(mapStateToProps)(FormTabsContainer)


