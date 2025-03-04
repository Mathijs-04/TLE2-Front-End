import {BrowserRouter as Router, Routes, Route} from 'react-router';
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Theorie from "./Theorie.jsx";
import Oefenen from "./Oefenen.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="theorie" element={<Theorie/>}/>
                    <Route path="oefenen" element={<Oefenen/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
