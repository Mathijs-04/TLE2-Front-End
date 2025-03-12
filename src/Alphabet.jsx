import Navigation from "./components/Navigation";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

const images = [
    "/alphabet/A.png",
    "/alphabet/B.png",
    "/alphabet/C.png",
    "/alphabet/D.png",
    "/alphabet/E.png",
    "/alphabet/F.png",
    "/alphabet/G.png",
    "/alphabet/H.png",
    "/alphabet/I.png",
    "/alphabet/J.png",
    "/alphabet/K.png",
    "/alphabet/L.png",
    "/alphabet/M.png",
    "/alphabet/N.png",
    "/alphabet/O.png",
    "/alphabet/P.png",
    "/alphabet/Q.png",
    "/alphabet/R.png",
    "/alphabet/S.png",
    "/alphabet/T.png",
    "/alphabet/U.png",
    "/alphabet/V.png",
    "/alphabet/W.png",
    "/alphabet/X.png",
    "/alphabet/Y.png",
    "/alphabet/Z.png",
];

function Alphabet() {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const token = localStorage.getItem("token");

        const currentUrl = location.pathname;
        if (token === null) {
            localStorage.setItem("redirectUrl", currentUrl);
            window.location.href = 'https://cmgt.hr.nl/chat-login/handle/%7Bapplication%7D?redirect=http://localhost:5173/login';
        }
    }, [navigate]);
    return (
        <>
            <Navigation/>
            <main className=" flex flex-col justify-start items-center mb-8">

                <h1 className="text-center text-Navy font-nunito font-extrabold text-6xl mt-8 mb-8">Alfabet</h1>


                <div className="grid grid-cols-7 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="flex justify-center bg-IceBlue rounded-lg p-4"
                        >
                            <img
                                className="h-20 object-contain"
                                src={image}
                                alt={`Afbeelding ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>

            </main>
        </>
    );
}

export default Alphabet;
