// Roaster image imports
import ghostNoizeImg1 from '@/assets/styles/image/roaster/GHOST_NOIZE_Bosque_Records/Photos/IMG_4025.PNG'
import ghostNoizeImg2 from '@/assets/styles/image/roaster/GHOST_NOIZE_Bosque_Records/Photos/IMG_4026.PNG'
import ghostNoizeImg3 from '@/assets/styles/image/roaster/GHOST_NOIZE_Bosque_Records/Photos/IMG_4024.PNG'

import foeXanImg1 from '@/assets/styles/image/roaster/FOE_XAN_Bosque_Records/Photos/IMG_0315.PNG'
import foeXanImg2 from '@/assets/styles/image/roaster/FOE_XAN_Bosque_Records/Photos/IMG_0317.PNG'
import foeXanImg3 from '@/assets/styles/image/roaster/FOE_XAN_Bosque_Records/Photos/IMG_0316.PNG'

import cosmikFreqImg1 from '@/assets/styles/image/roaster/COSMIK_FREQUENCY_Bosque_Records/Photos/IMG_1196.jpeg'
import cosmikFreqImg2 from '@/assets/styles/image/roaster/COSMIK_FREQUENCY_Bosque_Records/Photos/IMG_1197.jpeg'
import cosmikFreqImg3 from '@/assets/styles/image/roaster/COSMIK_FREQUENCY_Bosque_Records/Photos/IMG_1195.jpeg'

import brainwavezImg1 from '@/assets/styles/image/roaster/BRAINWAVEZ_Bosque_Records/Photos/319653d6-8ebf-4bc7-a97b-6d2f939dac4b.jpg'
import brainwavezImg2 from '@/assets/styles/image/roaster/BRAINWAVEZ_Bosque_Records/Photos/e03f7430-633b-44c1-b2e7-3cc2400ef789.jpg'
import brainwavezImg3 from '@/assets/styles/image/roaster/BRAINWAVEZ_Bosque_Records/Photos/41210053-4ffd-4308-8177-558e4c586053.jpg'

export const useRoasterImages = () => {
  const roasterImages = {
    'ghost-noize': {
      main: ghostNoizeImg1,
      gallery: [ghostNoizeImg1, ghostNoizeImg2, ghostNoizeImg3]
    },
    'foe-xan': {
      main: foeXanImg1,
      gallery: [foeXanImg1, foeXanImg2, foeXanImg3]
    },
    'cosmik-frequency': {
      main: cosmikFreqImg1,
      gallery: [cosmikFreqImg1, cosmikFreqImg2, cosmikFreqImg3]
    },
    'brainwavez': {
      main: brainwavezImg1,
      gallery: [brainwavezImg1, brainwavezImg2, brainwavezImg3]
    }
  }

  const getArtistImage = (artistSlug: string, imageIndex = 0) => {
    const artist = roasterImages[artistSlug as keyof typeof roasterImages]
    if (!artist) return null
    
    if (imageIndex === 0) return artist.main
    return artist.gallery[imageIndex] || artist.main
  }

  const getArtistGallery = (artistSlug: string) => {
    const artist = roasterImages[artistSlug as keyof typeof roasterImages]
    return artist?.gallery || []
  }

  return {
    roasterImages,
    getArtistImage,
    getArtistGallery
  }
} 