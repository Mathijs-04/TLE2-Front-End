import Navigation from "./components/Navigation";

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
    return (
        <>
            <Navigation/>
            <main className=" flex flex-col justify-start items-center mb-8">

                <h1 className="text-center text-Navy font-nunito font-extrabold text-4xl sm:text-5xl lg:text-6xl mt-8 mb-8">Alfabet</h1>


                <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">

                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="flex justify-center bg-IceBlue h-32 rounded-lg p-4"
                        >
                            <img className="max-h-20 md:max-h-32 lg:max-h-40 w-auto"
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
