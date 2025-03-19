import { ImageSource, Sound, Resource, Loader } from 'excalibur'

// voeg hier jouw eigen resources toe
const Resources = {
    letterA: new ImageSource(`alphabet/A.png`),
    letterB: new ImageSource(`alphabet/B.png`),
    letterC: new ImageSource(`alphabet/C.png`),
    letterD: new ImageSource(`alphabet/D.png`),
    letterE: new ImageSource(`alphabet/E.png`),
    letterF: new ImageSource(`alphabet/F.png`),
    letterG: new ImageSource(`alphabet/G.png`),
    letterH: new ImageSource(`alphabet/H.png`),
    letterI: new ImageSource(`alphabet/I.png`),
    letterJ: new ImageSource(`alphabet/J.png`),
    letterK: new ImageSource(`alphabet/K.png`),
    letterL: new ImageSource(`alphabet/L.png`),
    letterM: new ImageSource(`alphabet/M.png`),
    letterN: new ImageSource(`alphabet/N.png`),
    letterO: new ImageSource(`alphabet/O.png`),
    letterP: new ImageSource(`alphabet/P.png`),
    letterQ: new ImageSource(`alphabet/Q.png`),
    letterR: new ImageSource(`alphabet/R.png`),
    letterS: new ImageSource(`alphabet/S.png`),
    letterT: new ImageSource(`alphabet/T.png`),
    letterU: new ImageSource(`alphabet/U.png`),
    letterV: new ImageSource(`alphabet/V.png`),
    letterW: new ImageSource(`alphabet/W.png`),
    letterX: new ImageSource(`alphabet/X.png`),
    letterY: new ImageSource(`alphabet/Y.png`),
    letterZ: new ImageSource(`alphabet/Z.png`),


    Snail: new ImageSource('images/snail-easy.png'),
    Snail1: new ImageSource('images/snail-normal.png'),
    Snail2: new ImageSource('images/snail-hard.png'),

    BgEasy: new ImageSource('images/easy-bg.png'),
    BgNormal: new ImageSource('images/normal-bg.png'),
    BgHard: new ImageSource('images/hard-bg.png')
}




const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }
