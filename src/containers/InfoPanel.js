import { connect } from 'react-redux'
import React, { Component } from 'react'
import {Card, CardHeader, CardText} from 'material-ui/Card';


class InfoPanel extends React.Component {
    render() {
        return (
            <Card>
                <CardHeader title={this.props.title} />
                <CardText>
                    {this.props.body}
                </CardText>
            </Card>
            )
    }
}


const mapStateToProps = state => {
    return {
        title: state.infoPanel.title,
        body: state.infoPanel.body
    }
}


export default connect(mapStateToProps)(InfoPanel)