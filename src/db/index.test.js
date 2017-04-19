import Assert from 'assert'
import db from './index'



describe('db', () => {
    it('test db object', () => {
        Assert.notEqual(db, undefined)
    })

    it('testing', () => {

        db.getAllTableCodes().then(tables => {
            Assert.equal(3, 4)
            Assert.notEqual(tables, undefined)
            Assert.notEqual(tables.length, 0)
        }, error => {
            throw new Error('getAllTableCodes')
        }).then(tables => {
            let aTableId = tables[0].id
            return db.getSymbolsByTable(aTableId, symbols => {
                Assert.notEqual(symbols, undefined)
                Assert.notEqual(symbols.length, 0)
                Assert.eqaul(3, 4)
            }, error => {
                throw error
            })
        }).then(symbols => {
            db.getDataBySymbol(data => {
                Assert.notEqual(data, undefined)
            }, error => {
                throw error
            })
        }).catch(error => {
        })
    })
})


