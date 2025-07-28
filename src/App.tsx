import {routes} from "./consts/routes.tsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        {routes.map(({ path, component }) =>
          <Route key={path} path={path} element={component} />
        )}
      </Routes>
    </Router>
  )
}

export default App
