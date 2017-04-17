import 'whatwg-fetch'
import Set from 'collections/set'

let endpoint;
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    endpoint = '127.0.0.1:8000'
} else {
    endpoint = ''
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

    getAllTableCodes() {
        return new Promise((resolve, reject) => {
            if (this.db.tables !== undefined) {
                resolve(this.db.tables)
                return ;
            } 

            let url = endpoint + 'api/tables'
            fetch(url, {
                method: 'GET',
                headers: {  
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }   
            }).then(response => {
                if (response.status === 200) {
                    let tables = response.json()['tables']
                    this.db.tables = tables
                    resolve(tables)
                } else {
                    reject(new Error(response.json()['msg']))
                }
            }, error => {
                reject(error)
            })
        })
    }

    // resolve parameter: array. [{data_table_id, symbol, id, location, category, unit}].
    getSymbolsByTable(tableId) {
        return new Promise((resolve, reject) => {
            if (this.db.symbolsByTableId === undefined) {
                this.db.symbolsByTableId = new Set(null, (o1, o2) => {
                    return o1.data_table_id === o2.data_table_id
                })
                this.db.symbols = []
            }

            if (this.db.symbolsByTableId.contains(tableId)) {
                let symbolsR = this.db.symbolsByTableId.get({data_table_id: tableId})
                let symbols = symbolsR.symbols
                resolve(symbols)
                return ;
            } 

            let url = endpoint + 'api/table/' + tableId
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    let data = response.json()
                    // update local database
                    data.symbols.each(s => {
                        s.data_table_id = tableId
                        this.db.symbols.push(s)
                    })
                    this.db.symbolsByTableId.add({
                        data_table_id: tableId,
                        symbols: data.symbols
                    })
                    
                    resolve(data.symbols)
                } else {
                    reject(new Error(response.json()['msg']))
                }
            }, error => {
                reject(error)
            })
        })
    }

    // resolve parameter: array. [{data_table_id, id, date}]
    getDatesByTable(tableId) {
        return new Promise((resolve, reject) => {
            if (this.db.datesByTable === undefined) {
                this.db.datesByTable = Set(null, (o1, o2) => {
                    return o1.data_table_id === o2.data_table_id
                })
                this.db.dates = []
            }

            if (this.db.datesByTable.contains({data_table_id: tableId})) {
                let data = this.db.datesByTable.get({data_table_id: tableId})
                resolve(data.dates)
                return ;
            }

            let url = endpoint + 'api/table/' + tableId
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    let data = response.json()
                    let dates = data.dates.map(date => {
                        date.data_table_id = data.data_table_id
                        this.db.dates.push(date)
                        return date
                    })
                    this.db.datesByTable.add({data_table_id: data.data_table_id, dates: dates})
                    resolve(dates)
                } else {
                    reject(new Error(response.json().msg))
                }
            }, error => {
                reject(error)
            })
        })
    }

    // @return promise. resolve(data).
    // data [{date: string, value: number},]
    getDataBySymbol(tableId, symbolId) {
        let dates = this.getDatesByTable(tableId)

        let entires = new Promise((resolve, reject) => {
            // TODO caching.
            let url = endpoint + 'api/table/entries/by_symbol/' + symbolId
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    let data = response.json()
                    let entries = data.entries.map(e => {
                        return e.data
                    })
                    resolve(entries)
                } else {
                    reject(new Error(response.json()['msg']))
                }
            }, error => {
                reject(error)
            })
        })

        return new Promise((resolve, reject) => {
            Promise.all([dates, entires]).then(values => {
                let [dates, entries] = values
                let dateSet = new Set(dates, (o1, o2) => {
                    return o1.id === o2.id
                }, date => {
                    return date.id
                })
                for (var i = entires.length - 1; i >= 0; i--) {
                    let entry = entires[i]
                    if (!dateSet.contains({ id: entry.date_id })) {
                        reject(new Error('missing date id?'))
                        return ;
                    }
                    let date = dateSet.get({ id: entry.date_id })
                    entry.date = date.date
                }
                resolve(entries)
            }, error => {
                reject(error)
            })
        });
    }
}
global.financialAccountsUSDadabaseInterface_132 = global.financialAccountsUSDadabaseInterface_132 || 
                                                new FinancialAccountsUSDadabaseInterface();                                               

export default global.financialAccountsUSDadabaseInterface_132








