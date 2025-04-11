import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BookPurchase from './pages/BookPurchase';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <Router>
        <Switch>
          <Route path="/book-purchase" component={BookPurchase} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
