import React, {Component} from 'react'
import db from '../db'
import { connect } from 'react-redux'
import {
    f1Form_selectSymbol, f1Form_selectTable, plotF1Form
} from '../actions'
import PropTypes from 'prop-types'


class F1Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tablesWaiting: true,
            tables: [],
            symbols: [],
            tableId: undefined,
            symbolId: undefined
        }

        db.getAllTableCodes().then(tables => {
            this.setState({
                tables: tables,
                tablesWaiting: false
            })
        })

        this.tableSelected = this.tableSelected.bind(this)
        this.symbolSelected = this.symbolSelected.bind(this)
    }

    tableSelected(event) {
        let dispatch = this.props.dispatch
        let tableId = parseInt(event.target.value, 10)
        dispatch(f1Form_selectTable(tableId))
        db.getSymbolsByTable(tableId).then(symbols => {
            this.setState({
                symbols: symbols,
                tableId: tableId,
            })
        }, error => {
            console.log('error')
        })
    }

    symbolSelected(event) {
        let dispatch = this.props.dispatch
        let symbolId = parseInt(event.target.value, 10)
        dispatch(f1Form_selectSymbol(symbolId))
        this.setState({
            symbolId: symbolId
        })
    }

    submit() {
        if (this.state.tableId === undefined || this.state.symbolId === undefined) {
            console.log('need to select table and symbolId')
            return ;
        } 
        let dispatch = this.props.dispatch
        dispatch(plotF1Form({
            table: this.props.tableId,
            symbol: this.props.symbolId
        }))
    }

    render() {
        if (this.state.tablesWaiting) {
            return ( <div> waiting... </div> )
        }

        let tablesDropdownItems = this.state.tables.map(table => {
            return ( <option value={table.id}> {table.tableCode} </option> )
        })
        let tablesDropdown = ( 
            <select value={this.props.tableId || undefined}
                    onChange={this.tableSelected.bind(this)}>
                {tablesDropdownItems} 
            </select> 
            )

        let symbolsDropdownItems = this.state.symbols.map(symbol => {
            return ( <option value={symbol.id}> {symbol.symbol} </option> )
        })
        let symbolsDropdown = ( 
            <select value={this.props.symbolId || undefined} 
                    onChange={this.symbolSelected.bind(this)}>
                {symbolsDropdownItems} 
            </select> 
            )

        return (
            <div>
                <div> {tablesDropdown} </div>
                <div> {symbolsDropdown} </div>
                <div> 
                    <button onClick={this.submit.bind(this)}>
                    Plot
                    </button>
                </div>
            </div>
            )
    }
}

F1Form.PropTypes = {
    tableId: PropTypes.number.isRequired,
    symbolId: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        tableId: state.forms.f1Form.tableId,
        symbolId: state.forms.f1Form.symbolId
    }
}

export default connect(mapStateToProps)(F1Form)




