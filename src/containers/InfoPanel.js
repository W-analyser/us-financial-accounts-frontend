import { connect } from 'react-redux'
import React from 'react'
import {Card, CardHeader, CardContent} from 'material-ui/Card';

class InfoPanel extends React.Component {
    render() {
        return (
            <Card>
                <CardHeader title={this.props.title} />
                <CardContent>
                    {this.props.body}
                </CardContent>
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