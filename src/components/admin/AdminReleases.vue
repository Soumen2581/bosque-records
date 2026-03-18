<template>
  <div class="admin-releases">
    <div class="section-header">
      <h2>💿 Releases Management</h2>
      <button @click="showAddForm = true" class="add-button">
        <span>+</span> Add New Release
      </button>
    </div>

    <!-- Add/Edit Release Form -->
    <div v-if="showAddForm || editingRelease" class="form-modal">
      <div class="form-container">
        <h3>{{ editingRelease ? 'Edit Release' : 'Add New Release' }}</h3>
        
        <form @submit.prevent="saveRelease" class="release-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Release Title *</label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                placeholder="e.g., Shaman's Dream"
              />
            </div>

            <div class="form-group">
              <label for="slug">Slug *</label>
              <input
                id="slug"
                v-model="formData.slug"
                type="text"
                required
                placeholder="e.g., shamans-dream"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="artist">Artist *</label>
            <select
              id="artist"
              v-model="formData.artistId"
              required
            >
              <option value="">Select an artist</option>
              <option
                v-for="artist in artists"
                :key="artist.id"
                :value="artist.id"
              >
                {{ artist.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              placeholder="Release description..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="releaseDate">Release Date *</label>
              <input
                id="releaseDate"
                v-model="formData.releaseDate"
                type="date"
                required
              />
            </div>

            <div class="form-group">
              <label for="price">Price ($)</label>
              <input
                id="price"
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                placeholder="9.99"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="coverImage">Cover Image URL *</label>
            <input
              id="coverImage"
              v-model="formData.coverImage"
              type="url"
              required
              placeholder="/uploads/releases/cover.jpg"
            />
          </div>

          <div class="form-group">
            <label for="tags">Tags</label>
            <input
              id="tags"
              v-model="formData.tags"
              type="text"
              placeholder="psytrance,forest,mystical"
            />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="formData.featured"
                type="checkbox"
              />
              Featured Release
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-button">
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ editingRelease ? 'Update Release' : 'Create Release' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Releases List -->
    <div class="releases-grid">
      <div
        v-for="release in releases"
        :key="release.id"
        class="release-card"
      >
        <div class="release-cover">
          <img
            v-if="release.coverImage"
            :src="release.coverImage"
            :alt="release.title"
            @error="handleImageError"
          />
          <div v-else class="cover-placeholder">
            🎵
          </div>
          <div v-if="release.featured" class="featured-badge">
            ⭐ Featured
          </div>
        </div>
        
        <div class="release-info">
          <h3>{{ release.title }}</h3>
          <p class="release-artist">by {{ release.artist.name }}</p>
          <p class="release-date">{{ formatDate(release.releaseDate) }}</p>
          <p class="release-stats">
            {{ release._count.tracks }} tracks
            <span v-if="release.price">• ${{ release.price }}</span>
          </p>
          <p v-if="release.description" class="release-description">
            {{ release.description.substring(0, 80) }}{{ release.description.length > 80 ? '...' : '' }}
          </p>
          <div v-if="release.tags" class="release-tags">
            <span
              v-for="tag in release.tags.split(',')"
              :key="tag"
              class="tag"
            >
              {{ tag.trim() }}
            </span>
          </div>
        </div>

        <div class="release-actions">
          <button @click="editRelease(release)" class="edit-button">
            ✏️ Edit
          </button>
          <button @click="deleteRelease(release.id)" class="delete-button">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="releases.length === 0" class="empty-state">
      <p>No releases found. Add your first release to get started!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Artist {
  id: string
  name: string
}

interface Release {
  id: string
  title: string
  slug: string
  description?: string
  releaseDate: string
  coverImage: string
  featured: boolean
  price?: number
  tags?: string
  artist: Artist
  _count: {
    tracks: number
  }
}

const releases = ref<Release[]>([])
const artists = ref<Artist[]>([])
const showAddForm = ref(false)
const editingRelease = ref<Release | null>(null)

const formData = ref({
  title: '',
  slug: '',
  description: '',
  releaseDate: '',
  coverImage: '',
  featured: false,
  price: null as number | null,
  artistId: '',
  tags: ''
})

const resetForm = () => {
  formData.value = {
    title: '',
    slug: '',
    description: '',
    releaseDate: '',
    coverImage: '',
    featured: false,
    price: null,
    artistId: '',
    tags: ''
  }
}

const fetchReleases = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/releases')
    if (response.ok) {
      releases.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch releases:', error)
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

const saveRelease = async () => {
  try {
    const payload = {
      ...formData.value,
      price: formData.value.price || undefined
    }

    const url = editingRelease.value
      ? `http://localhost:3001/api/admin/releases/${editingRelease.value.id}`
      : 'http://localhost:3001/api/admin/releases'
    
    const method = editingRelease.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      await fetchReleases()
      cancelForm()
    }
  } catch (error) {
    console.error('Failed to save release:', error)
  }
}

const editRelease = (release: Release) => {
  editingRelease.value = release
  formData.value = {
    title: release.title,
    slug: release.slug,
    description: release.description || '',
    releaseDate: release.releaseDate.split('T')[0],
    coverImage: release.coverImage,
    featured: release.featured,
    price: release.price || null,
    artistId: release.artist.id,
    tags: release.tags || ''
  }
  showAddForm.value = false
}

const deleteRelease = async (id: string) => {
  if (!confirm('Are you sure you want to delete this release? This will also delete all associated tracks.')) return

  try {
    const response = await fetch(`http://localhost:3001/api/admin/releases/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await fetchReleases()
    }
  } catch (error) {
    console.error('Failed to delete release:', error)
  }
}

const cancelForm = () => {
  showAddForm.value = false
  editingRelease.value = null
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
    day: 'numeric'
  })
}

onMounted(() => {
  fetchReleases()
  fetchArtists()
})
</script>

<style scoped>
.admin-releases {
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

.release-form {
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
.form-group textarea,
.form-group select {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
  padding: 12px;
  color: #e8f5e8;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
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

.releases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.release-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.release-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
}

.release-cover {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
}

.release-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
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

.release-info h3 {
  margin: 0 0 5px 0;
  color: #4ade80;
}

.release-artist {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.release-date {
  color: #94a3b8;
  font-size: 13px;
  margin: 0 0 8px 0;
}

.release-stats {
  color: #94a3b8;
  font-size: 13px;
  margin: 0 0 10px 0;
}

.release-description {
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 15px 0;
}

.release-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
}

.tag {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.release-actions {
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
  
  .releases-grid {
    grid-template-columns: 1fr;
  }
}
</style> 