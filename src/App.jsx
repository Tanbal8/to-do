import ToDo from './pages/to-do/ToDo';
import notification from "./utils/notification/notification";
import GlobalContext from './contexts/GlobalContext';
import './App.css';
import './styles/variables.css';

const App = () => {
  return (
    <GlobalContext value={{
      notification,
    }}>
      <ToDo />
    </GlobalContext>
  );
}

export default App;
