import React, {Component} from 'react'
import db from '../db'
import { connect } from 'react-redux'
import {
    f1Form_selectSymbol, f1Form_selectTable, plotF1Form
} from '../actions'
import PropTypes from 'prop-types'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import GridList from 'material-ui/GridList'


class F1Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tablesWaiting: true,
            tables: [],
            symbols: [],
            error: {
                hasError: false,
                msg: 'error'
            }
        }

        let dispatch = this.props.dispatch
        db.getAllTableCodes().then(tables => {
            this.setState({
                tables: tables,
            })
            return Promise.resolve(tables[0])
        }).then(table => {
            dispatch(f1Form_selectTable(table.id))
            return db.getSymbolsByTable(table.id)
        }).then(symbols => {
            let symbolId = symbols[0].id
            dispatch(f1Form_selectSymbol(symbolId))
            this.setState({
                symbols: symbols,
                tablesWaiting: false,
                error: Object.assign({}, this.state.error, {
                    hasError: false
                })
            })
        }).catch(error => {
            if (error !== undefined && typeof error === 'object' && error.msg !== undefined) {
                this.setState({
                    error: {
                        hasError: true,
                        msg: error.msg
                    }
                })
            } else {
                this.setState({
                    error: {
                        hasError: true,
                        msg: 'error when during initialization'
                    }
                })        
            }
        })

        this.tableSelected = this.tableSelected.bind(this)
        this.symbolSelected = this.symbolSelected.bind(this)
        this.submit = this.submit.bind(this)
    }

    tableSelected(event, index) {
        let dispatch = this.props.dispatch
        let tableId = this.state.tables[index].id
        dispatch(f1Form_selectTable(tableId))
        db.getSymbolsByTable(tableId).then(symbols => {
            this.setState({
                symbols: symbols,
            })
            dispatch(f1Form_selectSymbol(symbols[0].id))
        }).catch(error => {
            console.log('error')
        })
    }

    symbolSelected(event, index) {
        let dispatch = this.props.dispatch
        let symbolId = this.state.symbols[index].id
        dispatch(f1Form_selectSymbol(symbolId))
    }

    submit() {
        if (this.props.tableId === undefined || this.props.symbolId === undefined) {
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
        if (this.state.error.hasError) {
            return (<div> error </div>)
        }

        if (this.state.tablesWaiting) {
            return ( <div> waiting... </div> )
        }

        let tablesDropdown = ( 
            <SelectField floatingLabelText='Table Code'
                        value={this.props.tableId}
                        onChange={this.tableSelected}>
                {
                    this.state.tables.map(table => {
                        return ( <MenuItem primaryText={table.tableCode} value={table.id} /> )
                    })
                } 
            </SelectField> 
            )

        let symbolsDropdown = ( 
            <SelectField 
                    floatingLabelText='Symbol Code'
                    value={this.props.symbolId} 
                    onChange={this.symbolSelected}>
                {
                    this.state.symbols.map(symbol => {
                        return ( <MenuItem value={symbol.id} primaryText={symbol.symbol} /> )
                    })
                } 
            </SelectField> 
            )

        let button = (
            <RaisedButton label='Plot' primary={true} onTouchTap={this.submit} />
            )



        return (
            <div >
                <div>
                    {tablesDropdown}
                </div> 
                <div>
                    {symbolsDropdown}
                </div>
                <div>
                    {button}
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




