import {BrowserRouter as Router, Routes, Route} from 'react-router';
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Page1 from "./Page1.jsx";
import Page2 from "./Page2.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="page1" element={<Page1/>}/>
                    <Route path="page2" element={<Page2/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
