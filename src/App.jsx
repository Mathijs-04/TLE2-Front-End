import {BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router';
import Home from "./Home.jsx";
import Alphabet from "./Alphabet.jsx";
import Information from "./Information.jsx";
import Profile from "./Profile.jsx";
import GameComponent from "./game/Game.jsx";
import RedirectHRLogin from "./components/RedirectHRLogin.jsx";

function App() {
    const router = createBrowserRouter([
        {
            children:[
                {
                    path: '/',
                    element: <Home/>
                },
                {
                    path: '/alfabet',
                    element: <Alphabet/>
                },
                {
                    path: '/Game',
                    element: <GameComponent/>
                },
                {
                    path: '/profile',
                    element: <Profile/>
                },
                {path: '/login',
                    element: <RedirectHRLogin/>
                }
            ]
        }
    ])
    return (
        <RouterProvider router={router}/>
    );
}

export default App;
