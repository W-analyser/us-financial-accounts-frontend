import databaseInterface from '../db'
import * as constants from '../constants'

const dataAction = type => data => {
    return {type, data}
}

// @data, tab index
const selectTab = dataAction(constants.SELECT_TAB)
// @data, {title: string, body: string}
const displayInfoPanel = dataAction(constants.DISPLAY_INFO_PANEL)
// @data, state
const updateVisualState = dataAction(constants.UPDATE_VISUAL_STATE)


// @data. symbol id selected.
const f1Form_selectSymbol = dataAction(constants.F1_FORM_SELECT_SYMBOL)
// @data. table id selected.
const f1Form_selectTable = dataAction(constants.F1_FORM_SELECT_TABLE)
// @data. array of entry. an entry {date: stirng, value: number or null}
const f1Form_setData = dataAction(constants.F1_FORM_SET_DATA)
// submit form for process
const plotF1Form = ({table, symbol}) => dispatch => {
    dispatch(updateVisualState(constants.VisualState.PENDING))
    databaseInterface.getDataBySymbol(table, symbol).then(data => {
        if (data.length === 0) {
            dispatch(displayInfoPanel('not data given the table and symbol?'))
            dispatch(constants.VisualState.EMPTY)
        } else {
            dispatch(f1Form_setData(data))
            dispatch(updateVisualState(constants.VisualState.SHOW))
        }
    }, error => {
        dispatch(displayInfoPanel(error.message))
        dispatch(updateVisualState(constants.VisualState.EMPTY))
    })
}

export {
    selectTab, displayInfoPanel, updateVisualState,
    f1Form_selectSymbol, f1Form_selectTable, f1Form_setData,
    plotF1Form
}


