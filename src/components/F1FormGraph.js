import React from 'react'
import PropTypes from 'prop-types'

class F1FormGraph extends React.Component {
    render() {
        let entries = this.props.entries
        let text = ''
        for (var i = entries.length - 1; i >= 0; i--) {
            let entry = entries[i]
            text += entry.date + ': ' + entry.data + ','
        }
        return (
            <div>
                {text}
            </div>
            )
    }
}

F1FormGraph.propTypes = {
    entries: PropTypes.array.isRequired
}

export default F1FormGraph
