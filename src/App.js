import Board from "./components/Board";
import Toolbar from "./components/toobar";
import Toolbox from "./components/toolbox";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";

function App() {
  return (
    <BoardProvider>
    <ToolboxProvider>
       <Board />
       <Toolbar />
       <Toolbox/>
    </ToolboxProvider>   
    </BoardProvider>
  );
}

export default App;