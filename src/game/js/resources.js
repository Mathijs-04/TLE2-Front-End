import { ImageSource, Sound, Resource, Loader } from 'excalibur'

// voeg hier jouw eigen resources toe
const Resources = {
    Fish: new ImageSource('alphabet/B.png'),
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
