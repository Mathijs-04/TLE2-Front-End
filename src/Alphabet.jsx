import Navigation from "./components/Navigation";

const images = [
    "/public/alphabet/A.png",
    "/public/alphabet/B.png",
    "/public/alphabet/C.png",
    "/public/alphabet/D.png",
    "/public/alphabet/E.png",
    "/public/alphabet/F.png",
    "/public/alphabet/G.png",
    "/public/alphabet/H.png",
    "/public/alphabet/I.png",
    "/public/alphabet/J.png",
    "/public/alphabet/K.png",
    "/public/alphabet/L.png",
    "/public/alphabet/M.png",
    "/public/alphabet/N.png",
    "/public/alphabet/O.png",
    "/public/alphabet/P.png",
    "/public/alphabet/Q.png",
    "/public/alphabet/R.png",
    "/public/alphabet/S.png",
    "/public/alphabet/T.png",
    "/public/alphabet/U.png",
    "/public/alphabet/V.png",
    "/public/alphabet/W.png",
    "/public/alphabet/X.png",
    "/public/alphabet/Y.png",
    "/public/alphabet/Z.png",

];

function Alphabet() {
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
