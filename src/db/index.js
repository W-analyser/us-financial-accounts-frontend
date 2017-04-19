import 'isomorphic-fetch'
import Set from 'collections/set'
import _ from 'underscore'

let endpoint;
let fetch_mode;
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    endpoint = 'http://127.0.0.1:8000/financial_accounts_us/'
    fetch_mode = 'cors'
} else {
    endpoint = ''
    fetch_mode = 'basic'
}

class FinancialAccountsUSDadabaseInterface {
    constructor() {
        let db = global.financialAccountsUSDadabase_132
        if (db === undefined) {
            global.financialAccountsUSDadabase_132 = {}
            db = global.financialAccountsUSDadabase_132
        }

        this.db = db
    }
    getRawDatabase() {
        return global.financialAccountsUSDadabase_132
    }

    // on success, relove(tables). tables: [{id: int, tableCode: string}]
    getAllTableCodes() {
        return new Promise((resolve, reject) => {
            if (this.db.tables !== undefined) {
                resolve(this.db.tables)
                return ;
            } 

            let url = endpoint + 'api/tables'
            fetch(url, {
                method: 'GET',
                mode: fetch_mode
            }).then(response => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    return response.json().then(data => {
                        let msg = data.msg
                        Promise.reject(new Error(msg))
                    })
                }
            }).then(data => {
                let tables = data.tables.map(table => {
                    return {
                        id: table.id,
                        tableCode: table.table_code
                    }
                })

                this.db.tables = tables
                resolve(tables)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // resolve parameter: array. [{dataTableId, symbol, id, location, category, unit}].
    getSymbolsByTable(tableId) {
        return new Promise((resolve, reject) => {
            if (this.db.symbolsByTableId === undefined) {
                // [{tableId: int, symbols: [symbol,]}
                this.db.symbolsByTableId = [] 
                // [symbol,]
                this.db.symbols = []
                // where symbol: {dataTableId, symbol, id, location, category, unit}
            }

            let symbolsContainer = _.find(this.db.symbolsByTableId, o => {
                return o.tableId === tableId
            })
            if (symbolsContainer !== undefined) {
                resolve(symbolsContainer.symbols)
                return ;   
            }

            let url = endpoint + 'api/table/' + tableId
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                mode: fetch_mode
            }).then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    return response.json().then(data => {
                        return Promise.reject(new Error(data.msg))
                    })
                }
            }).then(data => {
                let tableId = data.data_table_id
                let symbols = data.symbols.map(s => {
                    s.tableId = tableId
                    this.db.symbols.push(s) // update db
                    return s
                })
                // update db
                this.db.symbolsByTableId.push({
                    tableId,
                    symbols, 
                })

                resolve(symbols)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // resolve parameter: array. [{data_table_id, id, date}]
    getDatesByTable(tableId) {
        return new Promise((resolve, reject) => {
            if (this.db.datesByTable === undefined) {
                // datesByTable: [{tableId: int, dates: [date]}]
                this.db.datesByTable = []
                // dates: [date,]
                this.db.dates = []
                // where date: {tableId: int, id: int, date: string}
            }

            let dateContainer = _.find(this.db.datesByTable, dateContainer => {
                return dateContainer.tableId === tableId
            })
            if (dateContainer !== undefined) {
                resolve(dateContainer.dates)
                return ;
            }

            let url = endpoint + 'api/table/' + tableId
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                mode: fetch_mode
            }).then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    return response.json().then(data => {
                        return Promise.reject(new Error(data.msg))
                    })
                }
            }).then(data => {
                let tableId = data.data_table_id
                let dates = data.dates.map(date => {
                    date.tableId = tableId
                    this.db.dates.push(date) // add to db
                    return date
                })
                this.db.datesByTable.push({ tableId, dates }) // add to db
                resolve(dates)
            }).catch(error => {
                reject(error)
            })
        })
    }

    // @return promise. resolve(data).
    // data [{date: string, value: number},]
    getDataBySymbol(tableId, symbolId) {
        let dates = this.getDatesByTable(tableId)

        // entries [{dateId, symbolId, value}]
        let entries = new Promise((resolve, reject) => {
            // TODO caching.
            let url = endpoint + 'api/table/entries/by_symbol/' + symbolId
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                mode: fetch_mode
            }).then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    return response.json().then(data => {
                        return Promise.reject(data.msg)
                    })
                }
            }).then(data => {
                let symbolId = data.symbol_id
                let entries = data.entries.map(e => {
                    return {
                        symbolId: symbolId,
                        dateId: e.date_id,
                        value: e.data
                    }
                })
                resolve(entries)
            }).catch(error => {
                reject(error)
            })
        })

        return new Promise((resolve, reject) => {
            Promise.all([dates, entries]).then(values => {
                let [dates, entries] = values
                let ret = []
                for (var i = entries.length - 1; i >= 0; i--) {
                    let entry = entries[i]
                    let date = _.find(dates, date => {
                        return date.id === entry.dateId
                    })
                    if (date === undefined) {
                        reject(new Error('missing date id?'))
                        return ;
                    }
                    ret.push({date: date.date, value: entry.value})
                }
                resolve(ret)
            }, error => {
                reject(error)
            })
        });
    }
}
global.financialAccountsUSDadabaseInterface_132 = global.financialAccountsUSDadabaseInterface_132 || 
                                                new FinancialAccountsUSDadabaseInterface();                                               

export default global.financialAccountsUSDadabaseInterface_132








