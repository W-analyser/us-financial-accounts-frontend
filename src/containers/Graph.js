import React, {Component} from 'react'
import { connect } from 'react-redux'
import F1FormGraph from '../components/F1FormGraph'
import { VisualState } from '../constants'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import PropTypes from 'prop-types'

// const mapStateToProps = state => {
//     entries: state.f1Form.entries
// }

class Graph extends Component {
    render() {
        let content;
        if (this.props.visual.curState === VisualState.Empty) {
            content = (<CardText> empty </CardText>)
        } else if (this.props.visual.curState === VisualState.Pending) {
            content = (<CardText> waiting for result </CardText>)
        } else if (this.props.visual.curState === VisualState.SHOW) {
            if (this.props.visual.tab === 0) {
                content = (
                    <CardText >
                        <F1FormGraph key='F1FormGraph'
                             entries={this.props.forms.f1Form.entries}>
                        </F1FormGraph> 
                    </CardText>
                )  
            } else {
                content = (<CardText> unknown form? </CardText>)
            }
        } else {
            content = (<CardText> error </CardText>)
        }

        return  (
            <Card>
                <CardHeader title='Graph' />
                {content}
            </Card>
            )
    }
}


Graph.PropTypes = {
    forms: PropTypes.object.isRequired,
    visual: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        forms: state.forms,
        visual: state.visual
    }
}

export default connect(mapStateToProps)(Graph)


