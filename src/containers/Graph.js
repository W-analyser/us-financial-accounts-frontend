import React from 'react'
import { connect } from 'react-redux'
import F1FormGraph from '../components/F1FormGraph'
import { VisualState } from '../constants'
import PropTypes from 'prop-types';
// const mapStateToProps = state => {
//     entries: state.f1Form.entries
// }

class Graph extends React.Component {
    render() {
        if (this.props.visual.curState === VisualState.Empty) {
            return (<div> empty </div>)
        } else if (this.props.visual.curState === VisualState.Pending) {
            return (<div> waiting for result </div>)
        } else if (this.props.visual.curState === VisualState.SHOW) {
            if (this.props.visual.tab === 0) {
                return (
                    <F1FormGraph key='F1FormGraph'
                         entries={this.props.forms.f1Form.entries}>
                    </F1FormGraph> 
                )  
            } else {
                return (<div> unknown form? </div>)
            }
        } else {
            return (<div> error </div>)
        }
    }
}

Graph.propTypes = {
    forms: PropTypes.object.isRequired,
    visual: PropTypes.object.isRequired
}

const mapStateToProps = state => {
    return {
        forms: state.forms,
        visual: state.visual
    }
}

export default connect(mapStateToProps)(F1FormGraph)


