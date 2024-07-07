import React, { useContext } from 'react'
import classes from "./index.module.css"
import { COLORS, STROKE_TOOL_TYPES ,FILL_TOOL_TYPES, SIZE_TOOL_TYPES, TOOL_ITEM} from '../../constants'
import cx from "classnames"
import BoardContext from '../../store/board-context'
import toolBoxContext from '../../store/toolbox-context'

const Toolbox = () => {
    const {activeToolItem} = useContext(BoardContext);
    const {toolboxState , changeStroke , changeFill , changeSize } = useContext(toolBoxContext);

    const strokeColor = toolboxState[activeToolItem]?.stroke;
    const fillColor = toolboxState[activeToolItem]?.fill;
    const size = toolboxState[activeToolItem]?.size;

  return (

    <div className={classes.container}>


        {STROKE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLabel}>Stroke Color</div>
            <div className={classes.colorsContainer}>
                <div>
                    <input className={classes.colorPicker} type="color" value={strokeColor} onChange={(e)=> changeStroke(activeToolItem,e.target.value)}>
                    </input>
                </div>
                {Object.keys(COLORS).map((k)=>{
                    return(
                        <div className={cx(classes.colorBox ,{
                            [classes.activeColorBox] : strokeColor===COLORS[k],
                        })} 
                        style={{backgroundColor : COLORS[k]}}
                        onClick={()=>{changeStroke(activeToolItem,COLORS[k])}}
                        >
                        </div>
                    )
                })}
            </div>
        </div>}



        {FILL_TOOL_TYPES.includes(activeToolItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Fill Color</div>
          <div className={classes.colorsContainer}>
            {fillColor === null ? (
              <div
                className={cx(classes.colorPicker, classes.noFillColorBox)}
                onClick={() => changeFill(activeToolItem, COLORS.BLACK)}
              ></div>
            ) : (
              <div>
                <input
                  className={classes.colorPicker}
                  type="color"
                  value={strokeColor}
                  onChange={(e) => changeFill(activeToolItem, e.target.value)}
                ></input>
              </div>
            )}
            <div
              className={cx(classes.colorBox, classes.noFillColorBox, {
                [classes.activeColorBox]: fillColor === null,
              })}
              onClick={() => changeFill(activeToolItem, null)}
            ></div>
            {Object.keys(COLORS).map((k) => {
              return (
                <div
                  key={k}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: fillColor === COLORS[k],
                  })}
                  style={{ backgroundColor: COLORS[k] }}
                  onClick={() => changeFill(activeToolItem, COLORS[k])}
                ></div>
              );
            })}
          </div>
        </div>
      )}



        {SIZE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
            <div className={classes.toolBoxLabel}>{activeToolItem===TOOL_ITEM.TEXT ? "Font Size" : "Brush Size"}</div>
            <input 
            type='range'
            min={activeToolItem===TOOL_ITEM.TEXT ? 12 : 1}
            max={activeToolItem===TOOL_ITEM.TEXT ? 64 : 10}
            step={1}
            value={size}
            onChange={(event) => changeSize(activeToolItem,event.target.value)}
            />
        </div>}


    </div>
  )
}

export default Toolbox