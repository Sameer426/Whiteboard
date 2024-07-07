import React, { useContext } from 'react'
import classes from "./index.module.css"
import cx from "classnames"
import { TOOL_ITEM } from '../../constants'
import { FaRegCircle } from 'react-icons/fa'
import { FaSlash ,FaArrowRight , FaPaintBrush , FaEraser, FaFont, FaUndoAlt , FaRedoAlt,FaDownload} from 'react-icons/fa'
import { LuRectangleHorizontal } from 'react-icons/lu'
import boardContest from '../../store/board-context'

const Toolbar = () => {
    
  const {activeToolItem , changeToolHandler ,undo ,redo}=useContext(boardContest);

  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const tempCanvas = document.createElement("canvas");
    const context = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    context.drawImage(canvas, 0, 0);
    const data = tempCanvas.toDataURL("image/jpeg");
    
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.jpeg";
    anchor.click();
  };
  

  return (
    <div className={classes.container}>
        <div className={cx(classes.toolItem , {[classes.active] : activeToolItem===TOOL_ITEM.BRUSH})} onClick={()=>{changeToolHandler(TOOL_ITEM.BRUSH)}}>
            <FaPaintBrush />
        </div>
        <div className={cx(classes.toolItem , {[classes.active] : activeToolItem===TOOL_ITEM.LINE})} onClick={()=>{changeToolHandler(TOOL_ITEM.LINE)}}>
            <FaSlash />
        </div>
        <div className={cx(classes.toolItem , {[classes.active] : activeToolItem===TOOL_ITEM.RECTANGLE})} onClick={()=>{changeToolHandler(TOOL_ITEM.RECTANGLE)}}>
            <LuRectangleHorizontal />
        </div>
        <div className={cx(classes.toolItem , {[classes.active] : activeToolItem===TOOL_ITEM.CIRCLE})} onClick={()=>{changeToolHandler(TOOL_ITEM.CIRCLE)}}>
            <FaRegCircle />
        </div>
        <div className={cx(classes.toolItem , {[classes.active] : activeToolItem===TOOL_ITEM.ARROW})} onClick={()=>{changeToolHandler(TOOL_ITEM.ARROW)}}>
            <FaArrowRight />
        </div>
        <div className={cx(classes.toolItem , {[classes.active] : activeToolItem===TOOL_ITEM.ERASER})} onClick={()=>{changeToolHandler(TOOL_ITEM.ERASER)}}>
            <FaEraser />
        </div>
        <div className={cx(classes.toolItem , {[classes.active] : activeToolItem===TOOL_ITEM.TEXT})} onClick={()=>{changeToolHandler(TOOL_ITEM.TEXT)}}>
            <FaFont />
        </div>
        <div className={classes.toolItem} onClick={undo}>
            <FaUndoAlt />
        </div>
        <div className={classes.toolItem} onClick={redo}>
            <FaRedoAlt />
        </div>
        <div className={classes.toolItem} onClick={handleDownloadClick}>
            <FaDownload />
        </div>
    </div>
  )
}

export default Toolbar