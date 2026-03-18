import { Elysia, t } from 'elysia'

// Bandcamp release interface
interface BandcampRelease {
  id: string
  title: string
  slug: string
  description?: string
  releaseDate: string
  coverImage: string
  featured: boolean
  price?: number
  artist: {
    id: string
    name: string
  }
  tracks: Array<{
    id: string
    title: string
    duration: number
    preview?: string
  }>
  tags: string[]
  bandcampUrl?: string
}

// Helper function to fetch detailed album information from individual album page
async function fetchAlbumDetails(bandcampUrl: string): Promise<{
  releaseDate?: string
  tracks: Array<{ id: string; title: string; duration: number; preview?: string }>
  description?: string
  tags?: string[]
}> {
  try {
    const response = await fetch(bandcampUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) return { tracks: [], tags: [] }
    
    const html = await response.text()
    const details: {
      releaseDate?: string
      tracks: Array<{ id: string; title: string; duration: number; preview?: string }>
      description?: string
      tags?: string[]
    } = {
      tracks: [],
      tags: []
    }
    
    // Extract release date from various possible patterns
    const dateMatch = html.match(/<span class="release-date">[\s\S]*?(\d{1,2}\s+\w+\s+\d{4})/i) ||
                      html.match(/(\d{1,2}\s+\w+\s+\d{4})/i) ||
                      html.match(/released[\s:]+(\d{1,2}\s+\w+\s+\d{4})/i)
    if (dateMatch && dateMatch[1]) {
      try {
        const date = new Date(dateMatch[1])
        if (!isNaN(date.getTime())) {
          details.releaseDate = date.toISOString().split('T')[0]
        }
      } catch (e) {
        // Ignore date parse errors
      }
    }
    
    // Extract tracks from tracklist
    const trackRows = html.match(/<tr[^>]*class="[^"]*track_row[^"]*"[^>]*>[\s\S]*?<\/tr>/gi) || []
    trackRows.forEach((row, index) => {
      const titleMatch = row.match(/<span class="track-title">([^<]+)</i) ||
                          row.match(/<div class="track-title">([^<]+)</i) ||
                          row.match(/title[^>]*>([^<]+)</i)
      const durationMatch = row.match(/<span class="time">(\d+:\d+)</i) ||
                             row.match(/(\d+:\d+)/)
      
      if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1].trim()
        let duration = 0
        if (durationMatch && durationMatch[1]) {
          const [mins, secs] = durationMatch[1].split(':').map(Number)
          duration = (mins || 0) * 60 + (secs || 0)
        }
        
        details.tracks.push({
          id: `track-${index}`,
          title,
          duration
        })
      }
    })
    
    // Extract tags/genres
    const tagMatches = html.match(/<a[^>]*class="tag"[^>]*>([^<]+)</gi) || []
    details.tags = [...new Set(tagMatches.map(m => {
      const match = m.match(/>([^<]+)</)
      return match ? match[1].trim().toLowerCase() : ''
    }).filter(Boolean))]
    
    // Extract description
    const descMatch = html.match(/<div[^>]*class="[^"]*tralbum-about[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                      html.match(/<div[^>]*class="[^"]*trackInfo[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    if (descMatch && descMatch[1]) {
      details.description = descMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 500)
    }
    
    return details
  } catch (error) {
    console.error(`Error fetching album details for ${bandcampUrl}:`, error)
    return { tracks: [], tags: [] }
  }
}

// Helper function to extract Bandcamp releases from HTML or JSON
async function fetchBandcampReleases(): Promise<BandcampRelease[]> {
  try {
    const bandcampUrl = 'https://bosquerecords.bandcamp.com/music'
    
    // Fetch the Bandcamp page
    const response = await fetch(bandcampUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Bandcamp page: ${response.status}`)
    }

    const html = await response.text()
    
    // Try to extract JSON-LD structured data or embedded JSON
    // Bandcamp often embeds release data in script tags
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi)
    let releases: BandcampRelease[] = []

    if (scriptMatches) {
      for (const script of scriptMatches) {
        // Look for JSON-LD structured data
        if (script.includes('application/ld+json')) {
          try {
            const jsonMatch = script.match(/<script[^>]*>([\s\S]*?)<\/script>/i)
            if (jsonMatch && jsonMatch[1]) {
              const jsonData = JSON.parse(jsonMatch[1])
              // Process structured data if found
            }
          } catch (e) {
            // Continue searching
          }
        }
        
        // Look for embedded Bandcamp data
        if (script.includes('bandcamp') || script.includes('TralbumData') || script.includes('ItemData')) {
          try {
            const dataMatch = script.match(/var\s+(TralbumData|ItemData)\s*=\s*({[\s\S]*?});/)
            if (dataMatch) {
              // Parse Bandcamp data structure
            }
          } catch (e) {
            // Continue searching
          }
        }
      }
    }

    // Parse HTML for release information
    // Method 1: Look for list items with data-tralbumid (most reliable)
    const albumItemRegex = /<li[^>]*data-tralbumid="(\d+)"[^>]*data-item-id="(\d+)"[^>]*>([\s\S]*?)<\/li>/gi
    let match
    const albumItems: Array<{ tralbumId: string; itemId: string; html: string }> = []
    
    while ((match = albumItemRegex.exec(html)) !== null) {
      albumItems.push({
        tralbumId: match[1],
        itemId: match[2],
        html: match[3]
      })
    }
    
    // Method 2: Fallback to /album/ links if no list items found
    const albumLinks = html.match(/href="(\/album\/[^"]+)"/gi) || []
    
    if (albumItems.length > 0) {
      // Use list items with data attributes
      releases = albumItems.map((item, index) => {
        const itemHtml = item.html
        
        // Extract title
        const titleMatch = itemHtml.match(/<div class="collection-item-title">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) ||
                            itemHtml.match(/<div[^>]*class="[^"]*title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) ||
                            itemHtml.match(/<a[^>]*href="\/album\/[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
        const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Untitled Release'
        
        // Extract artist
        const artistMatch = itemHtml.match(/<div class="collection-item-artist">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i) ||
                           itemHtml.match(/<div[^>]*class="[^"]*artist[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)
        const artistName = artistMatch ? artistMatch[1].replace(/<[^>]*>/g, '').trim() : 'Bosque Records'
        
        // Extract cover image
        const imageMatch = itemHtml.match(/<img[^>]*src="([^"]+)"[^>]*>/i)
        let coverImage = imageMatch ? imageMatch[1] : ''
        
        // Ensure image URL is absolute
        if (coverImage && !coverImage.startsWith('http')) {
          if (coverImage.startsWith('//')) {
            coverImage = 'https:' + coverImage
          } else if (coverImage.startsWith('/')) {
            coverImage = 'https://bosquerecords.bandcamp.com' + coverImage
          } else {
            coverImage = 'https://bosquerecords.bandcamp.com/' + coverImage
          }
        }
        
        // Extract URL
        const urlMatch = itemHtml.match(/<a href="([^"]+)" class="item-link"/i) ||
                        itemHtml.match(/<a[^>]*href="(\/album\/[^"]+)"[^>]*>/i)
        const bandcampUrl = urlMatch 
          ? (urlMatch[1].startsWith('http') ? urlMatch[1] : `https://bosquerecords.bandcamp.com${urlMatch[1]}`)
          : undefined
        
        // Extract slug from URL or title
        let slug = title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        
        if (urlMatch && urlMatch[1]) {
          const slugMatch = urlMatch[1].match(/\/(?:album|track)\/([^\/\?]+)/)
          if (slugMatch) {
            slug = slugMatch[1]
          }
        }
        
        return {
          id: `bandcamp-${item.tralbumId}-${item.itemId}`,
          title: title || 'Untitled Release',
          slug: slug || `release-${index}`,
          description: '',
          releaseDate: new Date().toISOString().split('T')[0],
          coverImage: coverImage || '',
          featured: index < 4,
          price: undefined,
          artist: {
            id: `artist-${artistName.toLowerCase().replace(/\s+/g, '-')}`,
            name: artistName
          },
          tracks: [],
          tags: ['psytrance', 'electronic'],
          bandcampUrl
        }
      })
      
      // Fetch detailed information from album pages in parallel (limit concurrent requests)
      const batchSize = 3
      type AlbumDetailsType = {
        releaseDate?: string
        tracks: Array<{ id: string; title: string; duration: number; preview?: string }>
        description?: string
        tags?: string[]
      }
      const defaultDetails: AlbumDetailsType = { tracks: [], tags: [] }
      
      for (let i = 0; i < releases.length; i += batchSize) {
        const batch = releases.slice(i, i + batchSize)
        await Promise.all(
          batch.map(async (release) => {
            if (release.bandcampUrl) {
              try {
                const details: AlbumDetailsType = await Promise.race([
                  fetchAlbumDetails(release.bandcampUrl),
                  new Promise<AlbumDetailsType>((resolve) => 
                    setTimeout(() => resolve(defaultDetails), 2000)
                  )
                ])
                
                if (details.releaseDate) release.releaseDate = details.releaseDate
                if (details.tracks.length > 0) release.tracks = details.tracks
                if (details.description) release.description = details.description
                if (details.tags && details.tags.length > 0) release.tags = details.tags
              } catch (error) {
                // Continue with default values
                console.warn(`Failed to fetch details for ${release.bandcampUrl}:`, error)
              }
            }
          })
        )
      }
    } else if (albumLinks && albumLinks.length > 0) {
      // Extract unique album URLs
      const uniqueUrls = [...new Set(albumLinks.map(link => {
        const match = link.match(/href="([^"]+)"/i)
        return match ? match[1] : null
      }).filter((url): url is string => url !== null))]
      
      releases = uniqueUrls.map((url, index) => {
        // Extract album slug from URL
        const slugMatch = url.match(/\/album\/([^\/\?]+)/)
        const albumSlug = slugMatch ? slugMatch[1] : ''
        
        // Try to find title from surrounding HTML context
        // Look for the album link in the HTML and find nearby text
        const urlIndex = html.indexOf(url)
        let title = ''
        
        if (urlIndex > 0) {
          // Look before and after the URL for title text
          const contextBefore = html.substring(Math.max(0, urlIndex - 300), urlIndex)
          const contextAfter = html.substring(urlIndex, Math.min(html.length, urlIndex + 300))
          
          // Try multiple patterns to find title
          // Pattern 1: Look for text in span or div with title class
          let titleMatch = contextAfter.match(/<span[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)</i) ||
                          contextAfter.match(/<div[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)</i) ||
                          contextAfter.match(/<h3[^>]*>([^<]+)</i) ||
                          contextAfter.match(/<h4[^>]*>([^<]+)</i)
          
          // Pattern 2: Look for text after the link
          if (!titleMatch) {
            titleMatch = contextAfter.match(/<a[^>]*href="[^"]*"[^>]*>([^<]+)</i)
          }
          
          // Pattern 3: Look for data attributes
          if (!titleMatch) {
            titleMatch = contextBefore.match(/data-title="([^"]+)"/i) ||
                        contextAfter.match(/data-title="([^"]+)"/i)
          }
          
          // Pattern 4: Look for alt text in nearby images
          if (!titleMatch) {
            titleMatch = contextBefore.match(/alt="([^"]+)"/i)
          }
          
          title = titleMatch ? titleMatch[1].trim() : ''
          
          // Clean up title (remove HTML entities, extra spaces)
          if (title) {
            title = title.replace(/&amp;/g, '&')
                         .replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&quot;/g, '"')
                         .replace(/&#39;/g, "'")
                         .replace(/\s+/g, ' ')
                         .trim()
          }
          
          // If still no title, create from slug
          if (!title && albumSlug) {
            title = albumSlug
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase())
              .replace(/\bEp\b/gi, 'EP')
              .replace(/\bVa\b/gi, 'VA')
          }
        } else {
          // Fallback: create title from slug
          if (albumSlug) {
            title = albumSlug
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase())
              .replace(/\bEp\b/gi, 'EP')
              .replace(/\bVa\b/gi, 'VA')
          }
        }
        
        let finalTitle = title || 'Untitled Release'
        
        // Try to find image associated with this album
        // Look for img tags near the album link
        const albumSection = html.substring(
          Math.max(0, html.indexOf(url) - 500),
          Math.min(html.length, html.indexOf(url) + 500)
        )
        const imageMatch = albumSection.match(/<img[^>]*src="([^"]+)"[^>]*>/i)
        let coverImage = imageMatch ? imageMatch[1] : ''
        
        // Convert relative image URLs to absolute
        if (coverImage && !coverImage.startsWith('http')) {
          if (coverImage.startsWith('//')) {
            coverImage = 'https:' + coverImage
          } else if (coverImage.startsWith('/')) {
            coverImage = 'https://bosquerecords.bandcamp.com' + coverImage
          } else {
            coverImage = 'https://bosquerecords.bandcamp.com/' + coverImage
          }
        }
        
        // Create slug from title
        const slug = finalTitle.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || albumSlug
        
        // Try to extract artist name (might be in the page context)
        // For now, default to "Various Artists" or extract from page
        const artistName = 'Bosque Records'
        
        return {
          id: `bandcamp-${index}-${albumSlug}`,
          title: finalTitle,
          slug,
          description: '',
          releaseDate: new Date().toISOString().split('T')[0], // Default to today
          coverImage: coverImage || '',
          featured: index < 4, // First 4 releases are featured
          price: undefined,
          artist: {
            id: `artist-bandcamp-${index}`,
            name: artistName
          },
          tracks: [],
          tags: ['psytrance', 'electronic'],
          bandcampUrl: url.startsWith('http') ? url : `https://bosquerecords.bandcamp.com${url}`
        }
      })
      
      // Also try to find titles and images from list items
      const listItemMatches = html.match(/<li[^>]*>[\s\S]{0,2000}<a[^>]*href="\/album\/[^"]*"[\s\S]{0,2000}<\/li>/gi)
      if (listItemMatches) {
        listItemMatches.forEach((item, idx) => {
          if (idx < releases.length) {
            // Extract title from list item
            const titleMatch = item.match(/<a[^>]*href="\/album\/[^"]*"[^>]*>([^<]+)</i) ||
                                item.match(/<span[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)</i)
            if (titleMatch && titleMatch[1]) {
              releases[idx].title = titleMatch[1].trim()
            }
            
            // Extract image from list item
            const imgMatch = item.match(/<img[^>]*src="([^"]+)"[^>]*>/i)
            if (imgMatch && imgMatch[1]) {
              let imgUrl = imgMatch[1]
              if (!imgUrl.startsWith('http')) {
                if (imgUrl.startsWith('//')) {
                  imgUrl = 'https:' + imgUrl
                } else if (imgUrl.startsWith('/')) {
                  imgUrl = 'https://bosquerecords.bandcamp.com' + imgUrl
                }
              }
              releases[idx].coverImage = imgUrl
            }
          }
        })
      }
    }

    // Fallback: Try to use Bandcamp's RSS feed or API endpoints
    if (releases.length === 0) {
      try {
        // Try RSS feed
        const rssUrl = 'https://bosquerecords.bandcamp.com/feed'
        const rssResponse = await fetch(rssUrl)
        if (rssResponse.ok) {
          const rssText = await rssResponse.text()
          // Parse RSS (would need an RSS parser)
          // For now, return empty array
        }
      } catch (e) {
        console.error('RSS feed fetch failed:', e)
      }
    }

    console.log(`[Bandcamp] Found ${releases.length} releases (${albumItems.length} list items, ${albumLinks.length} album links)`)
    return releases
  } catch (error) {
    console.error('Error fetching Bandcamp releases:', error)
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return []
  }
}

export const bandcampRoute = new Elysia({ prefix: '/bandcamp' })
  .get('/debug', async () => {
    try {
      const bandcampUrl = 'https://bosquerecords.bandcamp.com/music'
      const response = await fetch(bandcampUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      const html = await response.text()
      
      // Extract album URLs
      const albumUrls = html.match(/\/album\/[^"\s]+/g) || []
      const uniqueUrls = [...new Set(albumUrls)].slice(0, 10)
      
      return {
        success: true,
        htmlLength: html.length,
        albumUrlsFound: albumUrls.length,
        uniqueUrls: uniqueUrls,
        sampleHtml: html.substring(0, 2000)
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      }
    }
  })
  .get('/releases', async () => {
    try {
      const releases = await fetchBandcampReleases()
      return {
        success: true,
        count: releases.length,
        releases
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        releases: []
      }
    }
  })
  .get('/releases/featured', async () => {
    try {
      const releases = await fetchBandcampReleases()
      const featured = releases.filter(r => r.featured).slice(0, 4)
      return {
        success: true,
        count: featured.length,
        releases: featured
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        releases: []
      }
    }
  })

