import { combineReducers } from 'redux'
import * as constants from '../constants'

const tabsDefault = {
    active: 0, // index to tabs
    tabs: [{
        name: 'F1',
        code: constants.TAB_CODES.F1FORM
    }]
}
const tabsReducer = (tabs = tabsDefault, action) => {
    if (action.type === constants.SELECT_TAB) {
        let tabIndex = action.data
        if (tabIndex >= tabs.tabs.length) {
            console.log('tab??')
            return tabs;
        }

        return Object.assign({}, tabs, {
            active: tabIndex
        })
    } else {
        return tabs
    }
}

const infoPanelDefault = {
    title: undefined, // string
    body: undefined  // string. markdown
}
const infoPanelReducer = (infoPanel = infoPanelDefault, action) => {
    if (action.type === constants.DISPLAY_INFO_PANEL) {
        return Object.assign({}, infoPanel, {
            title: action.data.title,
            body: action.data.body
        })
    } else {
        return infoPanel
    }
}

const f1FromDefault = {
    tableId: undefined,
    symbolId: undefined, // string
    entries: [] // {date: string, value: number}
}
const f1FormReducer = (f1Form = f1FromDefault, action) => {
    if (action.type === constants.F1_FORM_SELECT_SYMBOL) {
        return Object.assign({}, f1Form, {
            symbolId: action.data
        })
    } else if (action.type === constants.F1_FORM_SELECT_TABLE) {
        return Object.assign({}, f1Form, {
            tableId: action.data
        })
    } else if (action.type === constants.F1_FORM_SET_DATA) {
        return Object.assign({}, f1Form, {
            entries: action.data
        })
    } else {
        return f1Form
    }
}

const visualDefault = {
    curState: constants.VisualState.EMPTY,
    tab: tabsDefault.active // tab index
}
const visualReducer = (visual = visualDefault, action) => {
    if (action.type === constants.UPDATE_VISUAL_STATE) {
        return Object.assign({}, visual, {
            curState: action.data
        })
    } else if (action.type === constants.SELECT_TAB) {
        return Object.assign({}, visual, {
            tab: action.data
        })
    } else {
        return visual
    }
}

export default combineReducers({
    tabs: tabsReducer,
    infoPanel: infoPanelReducer,
    forms: combineReducers({
            f1Form: f1FormReducer,
        }),
    visual: visualReducer
    })