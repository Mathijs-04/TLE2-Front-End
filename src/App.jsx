import {BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider} from 'react-router';
import Home from "./Home.jsx";
import Alphabet from "./Alphabet.jsx";
import Information from "./Information.jsx";
import Profile from "./Profile.jsx";
import GameComponent from "./game/Game.jsx";

function App() {
    const router = createBrowserRouter([
        {
            children:[
                {
                    path: '/',
                    element: <Home/>
                },
                {
                    path: '/alphabet',
                    element: <Alphabet/>
                },
                {
                    path: '/informatie',
                    element: <Information/>
                },
                {
                    path: '/Game',
                    element: <GameComponent/>
                },
                {
                    path: '/profile',
                    element: <Profile/>
                },
            ]
        }
    ])
    return (
        <RouterProvider router={router}/>
    );
}

export default App;
