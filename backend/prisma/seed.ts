import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌿 Seeding Bosque Records database...')

  // Create Artists from the actual roaster
  const ghostNoizeArtist = await prisma.artist.create({
    data: {
      name: 'Ghost Noize',
      slug: 'ghost-noize',
      bio: 'A mystical producer creating deep, immersive psytrance journeys inspired by ancient forest spirits and shamanic experiences.',
      avatar: '/uploads/artists/ghost-noize-avatar.jpg',
      socialLinks: JSON.stringify({
        soundcloud: 'https://soundcloud.com/ghostnoize',
        instagram: 'https://instagram.com/ghostnoize',
        facebook: 'https://facebook.com/ghostnoize'
      })
    }
  })

  const foeXanArtist = await prisma.artist.create({
    data: {
      name: 'Foe Xan',
      slug: 'foe-xan',
      bio: 'Traversing the boundaries between consciousness and sound, Foe Xan crafts hypnotic soundscapes that guide listeners through ethereal realms.',
      avatar: '/uploads/artists/foe-xan-avatar.jpg',
      socialLinks: JSON.stringify({
        soundcloud: 'https://soundcloud.com/foexan',
        spotify: 'https://open.spotify.com/artist/foexan'
      })
    }
  })

  const cosmikFrequencyArtist = await prisma.artist.create({
    data: {
      name: 'Cosmik Frequency',
      slug: 'cosmik-frequency',
      bio: 'Drawing energy from the cosmic frequencies of the universe, weaving organic textures with pulsating rhythms and deep bass lines.',
      avatar: '/uploads/artists/cosmik-frequency-avatar.jpg',
      socialLinks: JSON.stringify({
        bandcamp: 'https://cosmikfrequency.bandcamp.com',
        youtube: 'https://youtube.com/cosmikfrequency'
      })
    }
  })

  const brainwavezArtist = await prisma.artist.create({
    data: {
      name: 'Brainwavez',
      slug: 'brainwavez',
      bio: 'Exploring the depths of consciousness through progressive psytrance, creating spiraling melodies that resonate with the inner mind.',
      avatar: '/uploads/artists/brainwavez-avatar.jpg',
      socialLinks: JSON.stringify({
        soundcloud: 'https://soundcloud.com/brainwavez',
        bandcamp: 'https://brainwavez.bandcamp.com'
      })
    }
  })

  // Create Releases using roaster artist images
  const release1 = await prisma.release.create({
    data: {
      title: 'Shaman\'s Dream',
      slug: 'shamans-dream',
      description: 'A mystical journey through ancient forest paths where shamanic wisdom meets psychedelic soundscapes.',
      releaseDate: new Date('2023-06-15'),
      coverImage: '/uploads/releases/shamans-dream-cover.jpg', // Will map to Ghost Noize image
      featured: true,
      price: 12.99,
      artistId: ghostNoizeArtist.id,
      tags: 'psytrance,forest,shamanic,mystical'
    }
  })

  const release2 = await prisma.release.create({
    data: {
      title: 'Moonlit Ritual',
      slug: 'moonlit-ritual',
      description: 'Ceremonial sounds under the sacred moon, guiding listeners through ethereal dimensions of consciousness.',
      releaseDate: new Date('2023-04-22'),
      coverImage: '/uploads/releases/moonlit-ritual-cover.jpg', // Will map to Foe Xan image
      featured: true,
      price: 10.99,
      artistId: foeXanArtist.id,
      tags: 'psytrance,lunar,ritual,ethereal'
    }
  })

  const release3 = await prisma.release.create({
    data: {
      title: 'Ancient Roots',
      slug: 'ancient-roots',
      description: 'Deep bass frequencies from the earth\'s core, connecting with the primal energy of nature\'s root network.',
      releaseDate: new Date('2023-02-10'),
      coverImage: '/uploads/releases/ancient-roots-cover.jpg', // Will map to Cosmik Frequency image
      featured: true,
      price: 15.99,
      artistId: cosmikFrequencyArtist.id,
      tags: 'psytrance,forest,earth,bass,organic'
    }
  })

  const release4 = await prisma.release.create({
    data: {
      title: 'Spiral Grove',
      slug: 'spiral-grove',
      description: 'Spiraling melodies through twisted branches, exploring the progressive depths of forest consciousness.',
      releaseDate: new Date('2022-12-05'),
      coverImage: '/uploads/releases/spiral-grove-cover.jpg', // Will map to Brainwavez image
      featured: true,
      price: 11.99,
      artistId: brainwavezArtist.id,
      tags: 'psytrance,progressive,forest,spiral'
    }
  })

  const release5 = await prisma.release.create({
    data: {
      title: 'Ancient Whispers',
      slug: 'ancient-whispers',
      description: 'Echoes from the depths of the forest where ancient spirits communicate through haunting melodies.',
      releaseDate: new Date('2023-08-15'),
      coverImage: '/uploads/releases/ancient-whispers-cover.jpg', // Alternative Ghost Noize image
      featured: false,
      price: 9.99,
      artistId: ghostNoizeArtist.id,
      tags: 'psytrance,dark,forest,ancient'
    }
  })

  const release6 = await prisma.release.create({
    data: {
      title: 'Ethereal Paths',
      slug: 'ethereal-paths',
      description: 'Follow the winding paths of consciousness through dimensions of sound and spirit.',
      releaseDate: new Date('2023-07-20'),
      coverImage: '/uploads/releases/ethereal-paths-cover.jpg', // Alternative Foe Xan image
      featured: false,
      price: 11.99,
      artistId: foeXanArtist.id,
      tags: 'psytrance,ethereal,progressive,spiritual'
    }
  })

  // Create Tracks
  await prisma.track.createMany({
    data: [
      // Shaman's Dream tracks
      {
        title: 'Awakening',
        duration: 480,
        audioFile: '/uploads/tracks/awakening.mp3',
        preview: '/uploads/previews/awakening-preview.mp3',
        order: 1,
        releaseId: release1.id
      },
      {
        title: 'Vision Quest',
        duration: 360,
        audioFile: '/uploads/tracks/vision-quest.mp3',
        preview: '/uploads/previews/vision-quest-preview.mp3',
        order: 2,
        releaseId: release1.id
      },
      // Moonlit Ritual tracks
      {
        title: 'Lunar Dance',
        duration: 420,
        audioFile: '/uploads/tracks/lunar-dance.mp3',
        preview: '/uploads/previews/lunar-dance-preview.mp3',
        order: 1,
        releaseId: release2.id
      },
      // Ancient Roots tracks
      {
        title: 'Earth Pulse',
        duration: 540,
        audioFile: '/uploads/tracks/earth-pulse.mp3',
        preview: '/uploads/previews/earth-pulse-preview.mp3',
        order: 1,
        releaseId: release3.id
      },
      {
        title: 'Root Network',
        duration: 390,
        audioFile: '/uploads/tracks/root-network.mp3',
        preview: '/uploads/previews/root-network-preview.mp3',
        order: 2,
        releaseId: release3.id
      },
      {
        title: 'Fungal Wisdom',
        duration: 450,
        audioFile: '/uploads/tracks/fungal-wisdom.mp3',
        preview: '/uploads/previews/fungal-wisdom-preview.mp3',
        order: 3,
        releaseId: release3.id
      },
      // Spiral Grove tracks
      {
        title: 'Twisted Path',
        duration: 480,
        audioFile: '/uploads/tracks/twisted-path.mp3',
        preview: '/uploads/previews/twisted-path-preview.mp3',
        order: 1,
        releaseId: release4.id
      },
      // Ancient Whispers tracks
      {
        title: 'Forest Whispers',
        duration: 420,
        audioFile: '/uploads/tracks/forest-whispers.mp3',
        preview: '/uploads/previews/forest-whispers-preview.mp3',
        order: 1,
        releaseId: release5.id
      },
      {
        title: 'Ancient Call',
        duration: 380,
        audioFile: '/uploads/tracks/ancient-call.mp3',
        preview: '/uploads/previews/ancient-call-preview.mp3',
        order: 2,
        releaseId: release5.id
      },
      // Ethereal Paths tracks
      {
        title: 'Ethereal Journey',
        duration: 450,
        audioFile: '/uploads/tracks/ethereal-journey.mp3',
        preview: '/uploads/previews/ethereal-journey-preview.mp3',
        order: 1,
        releaseId: release6.id
      }
    ]
  })

  // Create Events featuring roaster artists
  const futureDate1 = new Date()
  futureDate1.setDate(futureDate1.getDate() + 30)
  
  const futureDate2 = new Date()
  futureDate2.setDate(futureDate2.getDate() + 45)
  
  const futureDate3 = new Date()
  futureDate3.setDate(futureDate3.getDate() + 60)

  const event1 = await prisma.event.create({
    data: {
      title: 'Forest Awakening Festival',
      slug: 'forest-awakening-festival',
      description: 'A three-day journey into the heart of nature featuring the complete Bosque Records roaster in an immersive forest setting.',
      date: futureDate1,
      endDate: new Date(futureDate1.getTime() + 3 * 24 * 60 * 60 * 1000),
      location: 'Sacred Grove, Oregon',
      venue: 'Ancient Forest Amphitheater',
      image: '/uploads/events/forest-awakening.jpg',
      ticketUrl: 'https://tickets.forestawakening.com',
      featured: true
    }
  })

  const event2 = await prisma.event.create({
    data: {
      title: 'Moonlight Ritual',
      slug: 'moonlight-ritual',
      description: 'An intimate gathering under the full moon featuring Ghost Noize and Foe Xan in a mystical forest setting.',
      date: futureDate2,
      location: 'Mystic Valley, California',
      venue: 'Moonlight Clearing',
      image: '/uploads/events/moonlight-ritual.jpg',
      ticketUrl: 'https://tickets.moonlightritual.com',
      featured: true
    }
  })

  const event3 = await prisma.event.create({
    data: {
      title: 'Digital Shamanism Workshop',
      slug: 'digital-shamanism-workshop',
      description: 'Learn the art of creating mystical soundscapes with Cosmik Frequency and Brainwavez sharing their production techniques.',
      date: futureDate3,
      location: 'Seattle, Washington',
      venue: 'Underground Studios',
      image: '/uploads/events/digital-shamanism.jpg',
      featured: false
    }
  })

  // Connect roaster artists to events
  await prisma.event.update({
    where: { id: event1.id },
    data: {
      artists: {
        connect: [
          { id: ghostNoizeArtist.id },
          { id: foeXanArtist.id },
          { id: cosmikFrequencyArtist.id },
          { id: brainwavezArtist.id }
        ]
      }
    }
  })

  await prisma.event.update({
    where: { id: event2.id },
    data: {
      artists: {
        connect: [
          { id: ghostNoizeArtist.id },
          { id: foeXanArtist.id }
        ]
      }
    }
  })

  await prisma.event.update({
    where: { id: event3.id },
    data: {
      artists: {
        connect: [
          { id: cosmikFrequencyArtist.id },
          { id: brainwavezArtist.id }
        ]
      }
    }
  })

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Bosque Records Hoodie',
        slug: 'bosque-records-hoodie',
        description: 'Premium black hoodie with mystical forest design and gold accents.',
        price: 45.99,
        images: JSON.stringify(['/uploads/products/hoodie-front.jpg', '/uploads/products/hoodie-back.jpg']),
        category: 'Apparel',
        inStock: true,
        quantity: 25
      },
      {
        name: 'Shaman\'s Dream Vinyl',
        slug: 'shamans-dream-vinyl',
        description: 'Limited edition vinyl release of Ghost Noize\'s acclaimed Shaman\'s Dream album.',
        price: 29.99,
        images: JSON.stringify(['/uploads/products/shamans-dream-vinyl.jpg']),
        category: 'Vinyl',
        inStock: true,
        quantity: 100
      },
      {
        name: 'Forest Spirit Sticker Pack',
        slug: 'forest-spirit-sticker-pack',
        description: 'Collection of 8 mystical stickers featuring forest spirits and sacred symbols from the Bosque roaster.',
        price: 8.99,
        images: JSON.stringify(['/uploads/products/sticker-pack.jpg']),
        category: 'Accessories',
        inStock: true,
        quantity: 200
      },
      {
        name: 'Mystic Meditation Mat',
        slug: 'mystic-meditation-mat',
        description: 'Sacred geometry meditation mat inspired by Cosmik Frequency\'s cosmic designs.',
        price: 34.99,
        images: JSON.stringify(['/uploads/products/meditation-mat.jpg']),
        category: 'Lifestyle',
        inStock: true,
        quantity: 15
      }
    ]
  })

  // Create Artworks inspired by roaster artists
  await prisma.artwork.createMany({
    data: [
      {
        title: 'Ghost Noize Vision',
        description: 'A mystical landscape where ancient shamanic spirits meet modern psytrance energy.',
        imageUrl: '/uploads/artworks/ghost-noize-vision.jpg',
        artist: 'Luna Moonwhisper',
        category: 'Digital Art',
        featured: true
      },
      {
        title: 'Foe Xan Portal',
        description: 'A gateway between dimensions, painted with ethereal energy inspired by Foe Xan\'s music.',
        imageUrl: '/uploads/artworks/foe-xan-portal.jpg',
        artist: 'Cosmic Sage',
        category: 'Digital Art',
        featured: true
      },
      {
        title: 'Cosmik Frequency Mandala',
        description: 'Intricate patterns that represent the mathematical beauty of cosmic frequencies.',
        imageUrl: '/uploads/artworks/cosmik-frequency-mandala.jpg',
        artist: 'Geometric Dreams',
        category: 'Mandala',
        featured: false
      },
      {
        title: 'Brainwavez Guardian',
        description: 'A progressive being that guides consciousness through spiraling dimensions.',
        imageUrl: '/uploads/artworks/brainwavez-guardian.jpg',
        artist: 'Spirit Illustrator',
        category: 'Character Art',
        featured: true
      },
      {
        title: 'Bosque Forest Circle',
        description: 'A magical circle representing the unity of all roaster artists in the mystical forest.',
        imageUrl: '/uploads/artworks/bosque-forest-circle.jpg',
        artist: 'Nature Mystic',
        category: 'Nature Art',
        featured: false
      },
      {
        title: 'Roaster Tree of Life',
        description: 'The universe contained within the branches of a tree, with each artist as a branch.',
        imageUrl: '/uploads/artworks/roaster-tree-life.jpg',
        artist: 'Universal Artist',
        category: 'Cosmic Art',
        featured: true
      }
    ]
  })

  // Create Newsletter Subscriptions
  await prisma.newsletter.createMany({
    data: [
      { email: 'mystic.wanderer@email.com' },
      { email: 'forest.spirit@email.com' },
      { email: 'cosmic.dancer@email.com' },
      { email: 'ghost.noize.fan@email.com' },
      { email: 'foe.xan.follower@email.com' }
    ]
  })

  console.log('✨ Seed data created successfully with roaster artists!')
  console.log(`Created ${await prisma.artist.count()} artists`)
  console.log(`Created ${await prisma.release.count()} releases`)
  console.log(`Created ${await prisma.track.count()} tracks`)
  console.log(`Created ${await prisma.event.count()} events`)
  console.log(`Created ${await prisma.product.count()} products`)
  console.log(`Created ${await prisma.artwork.count()} artworks`)
  console.log(`Created ${await prisma.newsletter.count()} newsletter subscribers`)
  
  console.log('\n🎵 Roaster Artists:')
  console.log('- Ghost Noize (shamanic psytrance)')
  console.log('- Foe Xan (ethereal soundscapes)')
  console.log('- Cosmik Frequency (cosmic bass)')
  console.log('- Brainwavez (progressive consciousness)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 