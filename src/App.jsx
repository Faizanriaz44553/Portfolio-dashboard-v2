import { useRoutes } from "react-router-dom";
import RoutesPath from "./routes";


const App = () => {
  
  const routes = useRoutes(RoutesPath);

  return routes;
};

export default App;