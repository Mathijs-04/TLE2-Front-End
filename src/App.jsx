import {BrowserRouter as Router, Routes, Route} from 'react-router';
import Layout from "./Navigation.jsx";
import Home from "./Home.jsx";
import Theorie from "./Theorie.jsx";
import Oefenen from "./Oefenen.jsx";
import Navigation from "./Navigation.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigation/>}>
                    <Route index element={<Home/>}/>
                    <Route path="theorie" element={<Theorie/>}/>
                    <Route path="oefenen" element={<Oefenen/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
