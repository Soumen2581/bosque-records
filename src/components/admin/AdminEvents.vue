<template>
  <div class="admin-events">
    <div class="section-header">
      <h2>🎪 Events Management</h2>
      <button @click="showAddForm = true" class="add-button">
        <span>+</span> Add New Event
      </button>
    </div>

    <!-- Add/Edit Event Form -->
    <div v-if="showAddForm || editingEvent" class="form-modal">
      <div class="form-container">
        <h3>{{ editingEvent ? 'Edit Event' : 'Add New Event' }}</h3>
        
        <form @submit.prevent="saveEvent" class="event-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Event Title *</label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                placeholder="e.g., Forest Awakening Festival"
              />
            </div>

            <div class="form-group">
              <label for="slug">Slug *</label>
              <input
                id="slug"
                v-model="formData.slug"
                type="text"
                required
                placeholder="e.g., forest-awakening-festival"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              placeholder="Event description..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="date">Start Date *</label>
              <input
                id="date"
                v-model="formData.date"
                type="datetime-local"
                required
              />
            </div>

            <div class="form-group">
              <label for="endDate">End Date</label>
              <input
                id="endDate"
                v-model="formData.endDate"
                type="datetime-local"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="location">Location *</label>
              <input
                id="location"
                v-model="formData.location"
                type="text"
                required
                placeholder="e.g., Sacred Grove, Oregon"
              />
            </div>

            <div class="form-group">
              <label for="venue">Venue</label>
              <input
                id="venue"
                v-model="formData.venue"
                type="text"
                placeholder="e.g., Ancient Forest Amphitheater"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="image">Event Image URL</label>
            <input
              id="image"
              v-model="formData.image"
              type="url"
              placeholder="/uploads/events/event.jpg"
            />
          </div>

          <div class="form-group">
            <label for="ticketUrl">Ticket URL</label>
            <input
              id="ticketUrl"
              v-model="formData.ticketUrl"
              type="url"
              placeholder="https://tickets.example.com"
            />
          </div>

          <div class="form-group">
            <label>Artists</label>
            <div class="artists-selection">
              <label
                v-for="artist in artists"
                :key="artist.id"
                class="artist-checkbox"
              >
                <input
                  v-model="formData.artistIds"
                  :value="artist.id"
                  type="checkbox"
                />
                {{ artist.name }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="formData.featured"
                type="checkbox"
              />
              Featured Event
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-button">
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ editingEvent ? 'Update Event' : 'Create Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Events List -->
    <div class="events-grid">
      <div
        v-for="event in events"
        :key="event.id"
        class="event-card"
      >
        <div class="event-image">
          <img
            v-if="event.image"
            :src="event.image"
            :alt="event.title"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            🎪
          </div>
          <div v-if="event.featured" class="featured-badge">
            ⭐ Featured
          </div>
        </div>
        
        <div class="event-info">
          <h3>{{ event.title }}</h3>
          <p class="event-date">{{ formatDate(event.date) }}</p>
          <p v-if="event.endDate" class="event-end-date">
            to {{ formatDate(event.endDate) }}
          </p>
          <p class="event-location">
            📍 {{ event.location }}
            <span v-if="event.venue"> • {{ event.venue }}</span>
          </p>
          <p v-if="event.description" class="event-description">
            {{ event.description.substring(0, 100) }}{{ event.description.length > 100 ? '...' : '' }}
          </p>
          <div v-if="event.artists && event.artists.length > 0" class="event-artists">
            <strong>Artists:</strong>
            <span
              v-for="(artist, index) in event.artists"
              :key="artist.id"
            >
              {{ artist.name }}{{ index < event.artists.length - 1 ? ', ' : '' }}
            </span>
          </div>
          <div v-if="event.ticketUrl" class="event-tickets">
            🎫 <a :href="event.ticketUrl" target="_blank">Get Tickets</a>
          </div>
        </div>

        <div class="event-actions">
          <button @click="editEvent(event)" class="edit-button">
            ✏️ Edit
          </button>
          <button @click="deleteEvent(event.id)" class="delete-button">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="events.length === 0" class="empty-state">
      <p>No events found. Add your first event to get started!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Artist {
  id: string
  name: string
}

interface Event {
  id: string
  title: string
  slug: string
  description?: string
  date: string
  endDate?: string
  location: string
  venue?: string
  image?: string
  ticketUrl?: string
  featured: boolean
  artists: Artist[]
}

const events = ref<Event[]>([])
const artists = ref<Artist[]>([])
const showAddForm = ref(false)
const editingEvent = ref<Event | null>(null)

const formData = ref({
  title: '',
  slug: '',
  description: '',
  date: '',
  endDate: '',
  location: '',
  venue: '',
  image: '',
  ticketUrl: '',
  featured: false,
  artistIds: [] as string[]
})

const resetForm = () => {
  formData.value = {
    title: '',
    slug: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    venue: '',
    image: '',
    ticketUrl: '',
    featured: false,
    artistIds: []
  }
}

const fetchEvents = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/events')
    if (response.ok) {
      events.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

const fetchArtists = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/artists')
    if (response.ok) {
      artists.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch artists:', error)
  }
}

const saveEvent = async () => {
  try {
    const payload = {
      ...formData.value,
      endDate: formData.value.endDate || undefined,
      venue: formData.value.venue || undefined,
      image: formData.value.image || undefined,
      ticketUrl: formData.value.ticketUrl || undefined
    }

    const url = editingEvent.value
      ? `http://localhost:3001/api/admin/events/${editingEvent.value.id}`
      : 'http://localhost:3001/api/admin/events'
    
    const method = editingEvent.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      await fetchEvents()
      cancelForm()
    }
  } catch (error) {
    console.error('Failed to save event:', error)
  }
}

const editEvent = (event: Event) => {
  editingEvent.value = event
  formData.value = {
    title: event.title,
    slug: event.slug,
    description: event.description || '',
    date: event.date.substring(0, 16),
    endDate: event.endDate ? event.endDate.substring(0, 16) : '',
    location: event.location,
    venue: event.venue || '',
    image: event.image || '',
    ticketUrl: event.ticketUrl || '',
    featured: event.featured,
    artistIds: event.artists.map(a => a.id)
  }
  showAddForm.value = false
}

const deleteEvent = async (id: string) => {
  if (!confirm('Are you sure you want to delete this event?')) return

  try {
    const response = await fetch(`http://localhost:3001/api/admin/events/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await fetchEvents()
    }
  } catch (error) {
    console.error('Failed to delete event:', error)
  }
}

const cancelForm = () => {
  showAddForm.value = false
  editingEvent.value = null
  resetForm()
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchEvents()
  fetchArtists()
})
</script>

<style scoped>
.admin-events {
  color: #e8f5e8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  margin: 0;
  color: #4ade80;
}

.add-button {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.form-container {
  background: #1a2a1a;
  border-radius: 12px;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.form-container h3 {
  margin: 0 0 25px 0;
  color: #4ade80;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #94a3b8;
}

.form-group input,
.form-group textarea {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
  padding: 12px;
  color: #e8f5e8;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
}

.artists-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.artist-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #cbd5e1;
  font-size: 14px;
}

.artist-checkbox input[type="checkbox"] {
  width: auto;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #94a3b8;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-button {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.cancel-button {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.event-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.event-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
}

.event-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.featured-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
}

.event-info h3 {
  margin: 0 0 8px 0;
  color: #4ade80;
}

.event-date {
  color: #cbd5e1;
  font-size: 14px;
  margin: 0 0 3px 0;
  font-weight: 600;
}

.event-end-date {
  color: #94a3b8;
  font-size: 13px;
  margin: 0 0 8px 0;
}

.event-location {
  color: #64748b;
  font-size: 13px;
  margin: 0 0 10px 0;
}

.event-description {
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 15px 0;
}

.event-artists {
  color: #94a3b8;
  font-size: 13px;
  margin: 0 0 10px 0;
}

.event-artists strong {
  color: #4ade80;
}

.event-tickets {
  margin: 0 0 15px 0;
}

.event-tickets a {
  color: #4ade80;
  text-decoration: none;
  font-size: 13px;
}

.event-tickets a:hover {
  text-decoration: underline;
}

.event-actions {
  display: flex;
  gap: 10px;
}

.edit-button, .delete-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-button {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.edit-button:hover {
  background: rgba(59, 130, 246, 0.3);
}

.delete-button {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.delete-button:hover {
  background: rgba(239, 68, 68, 0.3);
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 40px;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .artists-selection {
    grid-template-columns: 1fr;
  }
}
</style> 