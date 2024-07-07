import React, { useReducer } from 'react'
import toolBoxContext from './toolbox-context'
import { TOOL_BOX_ACTIONS, TOOL_ITEM } from '../constants'
import { COLORS } from '../constants'

function toolboxReducer (state, action) {
    switch (action.type) {


        case TOOL_BOX_ACTIONS.CHANGE_STROKE:{
            const newState = {...state};
            newState[action.payload.tool].stroke = action.payload.stroke;
            return newState; 
        }


        case TOOL_BOX_ACTIONS.CHANGE_FILL:{
            const newState = {...state};
            newState[action.payload.tool].fill = action.payload.fill;
            return newState; 
        }

        case TOOL_BOX_ACTIONS.CHANGE_SIZE:{
            const newState = {...state};
            newState[action.payload.tool].size = action.payload.size;
            return newState; 
        }
        default:
            return state;    
    }
}

const initialToolboxState = {
    [TOOL_ITEM.BRUSH] : {
        stroke: COLORS.BLACK,
    },
    [TOOL_ITEM.LINE] : {
        stroke: COLORS.BLACK,
        size: 1,
    },
    [TOOL_ITEM.RECTANGLE] : {
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
    },
    [TOOL_ITEM.CIRCLE] : {
        stroke: COLORS.BLACK,
        fill: null,
        size: 1,
    },
    [TOOL_ITEM.ARROW] : {
        stroke: COLORS.BLACK,
        size: 1,
    },
    [TOOL_ITEM.TEXT] : {
        stroke: COLORS.BLACK,
        size: 32,
    },

}

const ToolboxProvider = ({children}) => {

    const [toolboxState, dispatchToolboxAction] =useReducer(toolboxReducer,initialToolboxState);

    const changeStrokeHandler = (tool , stroke ) => {
        dispatchToolboxAction({
            type: TOOL_BOX_ACTIONS.CHANGE_STROKE,
            payload:{
                tool,
                stroke,
            }
        })
    }

    const changeFillHandler = (tool , fill ) => {
        dispatchToolboxAction({
            type: TOOL_BOX_ACTIONS.CHANGE_FILL,
            payload:{
                tool,
                fill,
            }
        })
    }

    const changeSizeHandler = (tool , size ) => {
        dispatchToolboxAction({
            type: TOOL_BOX_ACTIONS.CHANGE_SIZE,
            payload:{
                tool,
                size,
            }
        })
    }

    const tooboxContextValue = {
        toolboxState,
        changeStroke: changeStrokeHandler,
        changeFill : changeFillHandler,
        changeSize  : changeSizeHandler,
    }

  return (
    <div>
        <toolBoxContext.Provider value={tooboxContextValue}>
            {children}
        </toolBoxContext.Provider>
    </div>
  )
}

export default ToolboxProvider