import React, {  useCallback, useReducer } from 'react'
import { BOARD_ACTION, TOOL_ACTION_TYPES, TOOL_ITEM } from '../constants'
import BoardContext from './board-context';
import {  createElement, getSvgPathFromStroke } from '../utils/element';
import getStroke from 'perfect-freehand';
import { isPointNearElement } from '../utils/element';


const boardReducer = (state,action) =>{

  switch (action.type) {

    case BOARD_ACTION.CHANGE_ACTION_TYPE:{
      return{
        ...state,
        toolActionType : action.payload.actionType, 
      }
    }


    case BOARD_ACTION.CHANGE_TOOL:{
      return {
        ...state,
        activeToolItem : action.payload.tool,
      }
    }  


    
    case BOARD_ACTION.DRAW_DOWN:{
  
      const {clientX,clientY,stroke,fill,size} = action.payload;
      const newElement = createElement(state.elements.length,clientX,clientY,clientX,clientY , {type : state.activeToolItem,stroke , fill ,size})
      const prevElements=state.elements;
      return{
        ...state,
        toolActionType: state.activeToolItem === TOOL_ITEM.TEXT ? TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
        elements: [...prevElements , newElement ]
      }

    }




      case BOARD_ACTION.DRAW_MOVE:{
        const {clientX,clientY} = action.payload;
        const newElements=[...state.elements];
        const index=state.elements.length-1;
        const type=state.activeToolItem;
        

        switch (type) {
          case TOOL_ITEM.LINE:
          case TOOL_ITEM.RECTANGLE:
          case TOOL_ITEM.CIRCLE:
          case TOOL_ITEM.ARROW:
            const {x1,y1,stroke,fill,size }=newElements[index];
            const newElement= createElement(index,x1,y1,clientX,clientY, {type : state.activeToolItem, stroke , fill,size});
            newElements[index]=newElement;
            return{
              ...state,
              elements : newElements,
            }
          
          case TOOL_ITEM.BRUSH :
            newElements[index].points = [...newElements[index].points , {x:clientX,y:clientY} ];
            newElements[index].path = new Path2D(getSvgPathFromStroke(getStroke(newElements[index].points)));
            return{
              ...state,
              elements : newElements,
            }
        
          default:
            throw new Error("Type not recognized");
        }
      }    


      case BOARD_ACTION.DRAW_UP:{
        const elementsCopy = [...state.elements];
        const newHistory= state.history.slice(0,state.index+1);
        newHistory.push(elementsCopy);
        return{
          ...state,
          history : newHistory,
          index : state.index + 1,
        }
      }

      
      case BOARD_ACTION.ERASE:{
        const {clientX , clientY} = action.payload;
        let newElements = [...state.elements];
        let prevElements = [...state.elements];

        newElements= newElements.filter((element)=>{
          return !isPointNearElement(element,clientX,clientY);
        })
        
        if(prevElements.length===newElements.length){
          return state;
        }

        const newHistory= state.history.slice(0,state.index+1);
        newHistory.push(newElements);
        return{
          ...state,
          elements: newElements,
          history:newHistory,
          index:state.index+1,
        }
      }

      case BOARD_ACTION.CHANGE_TEXT:{
        const index = state.elements.length-1;
        const newElement = [...state.elements];
        newElement[index].text = action.payload.text;

        const newHistory= state.history.slice(0,state.index+1);
        newHistory.push(newElement);
        return{
          ...state,
          toolActionType : TOOL_ACTION_TYPES.NONE,
          elements : newElement,
          history : newHistory,
          index : state.index+1,
        }
      }

      case BOARD_ACTION.UNDO:{
        if(state.index<=0) return state;
        return{
          ...state,
          elements: state.history[state.index-1],
          index : state.index-1,
        }
      }

      case BOARD_ACTION.REDO:{
        if(state.index>=state.history.length-1) return state;
        return{
          ...state,
          elements: state.history[state.index+1],
          index : state.index+1,
        }
      }

    default: 
    return state;
  }
}

const initialBoardState ={
  activeToolItem : TOOL_ITEM.BRUSH,
  toolActionType:TOOL_ACTION_TYPES.NONE,
  elements : [],
  history : [[]],
  index : 0,
};

const BoardProvider = ({children}) => {
  
  const [boardState , dispatchBoardAction ] = useReducer( boardReducer , initialBoardState );
  
    
    const changeToolHandler = (tool)=>{
        dispatchBoardAction({ 
          type : BOARD_ACTION.CHANGE_TOOL ,
          payload : {  
          tool,
        }
        })
    };



      const boardMouseDownHandler = (event,toolboxState) =>{
        if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;

      const {clientX,clientY} = event ;
      if(boardState.activeToolItem === TOOL_ITEM.ERASER){
        dispatchBoardAction({
          type : BOARD_ACTION.CHANGE_ACTION_TYPE,
          payload: {
            actionType :  TOOL_ACTION_TYPES.ERASING,
          }
        })
        return;
      }

      dispatchBoardAction({
        type : BOARD_ACTION.DRAW_DOWN,
        payload :{
          clientX,
          clientY,
          stroke : toolboxState[boardState.activeToolItem]?.stroke,
          fill: toolboxState[boardState.activeToolItem]?.fill,
          size: toolboxState[boardState.activeToolItem]?.size,
        }
      })  
    }

    


    const boardMouseMoveHandler = (event) =>{
      if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
      const {clientX,clientY} = event ;
      if(boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING){
        dispatchBoardAction({
          type : BOARD_ACTION.DRAW_MOVE,
          payload :{
            clientX,
            clientY,
          }
        })
      }else if(boardState.toolActionType === TOOL_ACTION_TYPES.ERASING){
        dispatchBoardAction({
          type : BOARD_ACTION.ERASE,
          payload :{
            clientX,
            clientY,
          }
        })
      }
    }


    const boardMouseUpHandler = () =>{
      if(boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
      if(boardState.toolActionType===TOOL_ACTION_TYPES.DRAWING){
        dispatchBoardAction({
          type : BOARD_ACTION.DRAW_UP,
        })
      }
      dispatchBoardAction({
        type : BOARD_ACTION.CHANGE_ACTION_TYPE,
        payload: {
          actionType : TOOL_ACTION_TYPES.NONE,
        }
      })
    }

    const textAreaBlurHandler=(text)=>{
      dispatchBoardAction({
        type: BOARD_ACTION.CHANGE_TEXT,
        payload:{
          text,
        }
      })
    }

    const boardUndoHandler= useCallback(()=>{
      dispatchBoardAction({
        type : BOARD_ACTION.UNDO,
      })
    },[])

    const boardRedoHandler =useCallback(()=>{
      dispatchBoardAction({
        type : BOARD_ACTION.REDO,
      })
    },[])


    const boardContextValue ={
      activeToolItem :boardState.activeToolItem,
      elements : boardState.elements  ,
      toolActionType : boardState.toolActionType,
      changeToolHandler,
      boardMouseDownHandler,
      boardMouseMoveHandler,
      boardMouseUpHandler,
      textAreaBlurHandler,
      undo : boardUndoHandler,
      redo : boardRedoHandler,
    }
    
  return (
    <BoardContext.Provider value = { boardContextValue }>
        {children}
    </BoardContext.Provider>
  )
}

export default BoardProvider