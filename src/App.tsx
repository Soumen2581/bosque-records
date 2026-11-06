import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ArtistPage, ArtistsPage } from '@/pages/ArtistsPage'
import { DiscoverPage } from '@/pages/DiscoverPage'
import { HomePage } from '@/pages/HomePage'
import { AboutPage, BookingsPage, ContactPage, EventsPage, NotFoundPage, ShopPage, VisualPage } from '@/pages/InfoPages'
import { ReleasePage } from '@/pages/ReleasePage'
import { ReleasesPage } from '@/pages/ReleasesPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="releases" element={<ReleasesPage />} />
          <Route path="releases/:slug" element={<ReleasePage />} />
          <Route path="artists" element={<ArtistsPage />} />
          <Route path="artists/:id" element={<ArtistPage />} />
          <Route path="roster" element={<ArtistsPage />} />
          <Route path="roster/:id" element={<ArtistPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="visual-arts" element={<VisualPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
