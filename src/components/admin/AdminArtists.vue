<template>
  <div class="admin-artists">
    <div class="section-header">
      <h2>🎵 Artists Management</h2>
      <button @click="showAddForm = true" class="add-button">
        <span>+</span> Add New Artist
      </button>
    </div>

    <!-- Add/Edit Artist Form -->
    <div v-if="showAddForm || editingArtist" class="form-modal">
      <div class="form-container">
        <h3>{{ editingArtist ? 'Edit Artist' : 'Add New Artist' }}</h3>
        
        <form @submit.prevent="saveArtist" class="artist-form">
          <div class="form-group">
            <label for="name">Artist Name *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="e.g., Ghost Noize"
            />
          </div>

          <div class="form-group">
            <label for="slug">Slug *</label>
            <input
              id="slug"
              v-model="formData.slug"
              type="text"
              required
              placeholder="e.g., ghost-noize"
            />
          </div>

          <div class="form-group">
            <label for="bio">Biography</label>
            <textarea
              id="bio"
              v-model="formData.bio"
              rows="4"
              placeholder="Artist biography..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="avatar">Avatar URL</label>
            <input
              id="avatar"
              v-model="formData.avatar"
              type="url"
              placeholder="/uploads/artists/avatar.jpg"
            />
          </div>

          <div class="form-group">
            <label>Social Links</label>
            <div class="social-links">
              <div class="social-input">
                <label>SoundCloud</label>
                <input
                  v-model="formData.socialLinks.soundcloud"
                  type="url"
                  placeholder="https://soundcloud.com/artist"
                />
              </div>
              <div class="social-input">
                <label>Spotify</label>
                <input
                  v-model="formData.socialLinks.spotify"
                  type="url"
                  placeholder="https://open.spotify.com/artist/..."
                />
              </div>
              <div class="social-input">
                <label>Instagram</label>
                <input
                  v-model="formData.socialLinks.instagram"
                  type="url"
                  placeholder="https://instagram.com/artist"
                />
              </div>
              <div class="social-input">
                <label>Bandcamp</label>
                <input
                  v-model="formData.socialLinks.bandcamp"
                  type="url"
                  placeholder="https://artist.bandcamp.com"
                />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-button">
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ editingArtist ? 'Update Artist' : 'Create Artist' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Artists List -->
    <div class="artists-grid">
      <div
        v-for="artist in artists"
        :key="artist.id"
        class="artist-card"
      >
        <div class="artist-avatar">
          <img
            v-if="artist.avatar"
            :src="artist.avatar"
            :alt="artist.name"
            @error="handleImageError"
          />
          <div v-else class="avatar-placeholder">
            {{ artist.name.charAt(0) }}
          </div>
        </div>
        
        <div class="artist-info">
          <h3>{{ artist.name }}</h3>
          <p class="artist-slug">{{ artist.slug }}</p>
          <p class="artist-stats">
            {{ artist._count.releases }} releases • {{ artist._count.events }} events
          </p>
          <p v-if="artist.bio" class="artist-bio">
            {{ artist.bio.substring(0, 100) }}{{ artist.bio.length > 100 ? '...' : '' }}
          </p>
        </div>

        <div class="artist-actions">
          <button @click="editArtist(artist)" class="edit-button">
            ✏️ Edit
          </button>
          <button @click="deleteArtist(artist.id)" class="delete-button">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="artists.length === 0" class="empty-state">
      <p>No artists found. Add your first artist to get started!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Artist {
  id: string
  name: string
  slug: string
  bio?: string
  avatar?: string
  socialLinks?: string
  _count: {
    releases: number
    events: number
  }
}

const artists = ref<Artist[]>([])
const showAddForm = ref(false)
const editingArtist = ref<Artist | null>(null)

const formData = ref({
  name: '',
  slug: '',
  bio: '',
  avatar: '',
  socialLinks: {
    soundcloud: '',
    spotify: '',
    instagram: '',
    bandcamp: '',
    facebook: '',
    youtube: ''
  }
})

const resetForm = () => {
  formData.value = {
    name: '',
    slug: '',
    bio: '',
    avatar: '',
    socialLinks: {
      soundcloud: '',
      spotify: '',
      instagram: '',
      bandcamp: '',
      facebook: '',
      youtube: ''
    }
  }
}

const fetchArtists = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/artists')
    if (response.ok) {
      artists.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch artists:', error)
  }
}

const saveArtist = async () => {
  try {
    const payload = {
      ...formData.value,
      socialLinks: Object.fromEntries(
        Object.entries(formData.value.socialLinks).filter(([_, value]) => value)
      )
    }

    const url = editingArtist.value
      ? `http://localhost:3001/api/admin/artists/${editingArtist.value.id}`
      : 'http://localhost:3001/api/admin/artists'
    
    const method = editingArtist.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      await fetchArtists()
      cancelForm()
    }
  } catch (error) {
    console.error('Failed to save artist:', error)
  }
}

const editArtist = (artist: Artist) => {
  editingArtist.value = artist
  formData.value = {
    name: artist.name,
    slug: artist.slug,
    bio: artist.bio || '',
    avatar: artist.avatar || '',
    socialLinks: artist.socialLinks ? JSON.parse(artist.socialLinks) : {
      soundcloud: '',
      spotify: '',
      instagram: '',
      bandcamp: '',
      facebook: '',
      youtube: ''
    }
  }
  showAddForm.value = false
}

const deleteArtist = async (id: string) => {
  if (!confirm('Are you sure you want to delete this artist?')) return

  try {
    const response = await fetch(`http://localhost:3001/api/admin/artists/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await fetchArtists()
    }
  } catch (error) {
    console.error('Failed to delete artist:', error)
  }
}

const cancelForm = () => {
  showAddForm.value = false
  editingArtist.value = null
  resetForm()
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

onMounted(() => {
  fetchArtists()
})
</script>

<style scoped>
.admin-artists {
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.form-container h3 {
  margin: 0 0 25px 0;
  color: #4ade80;
}

.artist-form {
  display: flex;
  flex-direction: column;
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

.social-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.social-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.social-input label {
  font-size: 13px;
  color: #64748b;
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

.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.artist-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.artist-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
}

.artist-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
}

.artist-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.artist-info h3 {
  margin: 0 0 5px 0;
  color: #4ade80;
}

.artist-slug {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 8px 0;
}

.artist-stats {
  color: #94a3b8;
  font-size: 13px;
  margin: 0 0 10px 0;
}

.artist-bio {
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 15px 0;
}

.artist-actions {
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
  
  .artists-grid {
    grid-template-columns: 1fr;
  }
  
  .social-links {
    grid-template-columns: 1fr;
  }
}
</style> 