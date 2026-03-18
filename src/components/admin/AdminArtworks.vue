<template>
  <div class="admin-artworks">
    <div class="section-header">
      <h2>🎨 Artworks Management</h2>
      <button @click="showAddForm = true" class="add-button">
        <span>+</span> Add New Artwork
      </button>
    </div>

    <!-- Add/Edit Artwork Form -->
    <div v-if="showAddForm || editingArtwork" class="form-modal">
      <div class="form-container">
        <h3>{{ editingArtwork ? 'Edit Artwork' : 'Add New Artwork' }}</h3>
        
        <form @submit.prevent="saveArtwork" class="artwork-form">
          <div class="form-group">
            <label for="title">Artwork Title *</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              placeholder="e.g., Ghost Noize Vision"
            />
          </div>

          <div class="form-group">
            <label for="artist">Artist Name *</label>
            <input
              id="artist"
              v-model="formData.artist"
              type="text"
              required
              placeholder="e.g., Luna Moonwhisper"
            />
          </div>

          <div class="form-group">
            <label for="category">Category *</label>
            <select
              id="category"
              v-model="formData.category"
              required
            >
              <option value="">Select category</option>
              <option value="Digital Art">Digital Art</option>
              <option value="Mandala">Mandala</option>
              <option value="Character Art">Character Art</option>
              <option value="Nature Art">Nature Art</option>
              <option value="Cosmic Art">Cosmic Art</option>
              <option value="Abstract">Abstract</option>
              <option value="Photography">Photography</option>
            </select>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              placeholder="Artwork description..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="imageUrl">Image URL *</label>
            <input
              id="imageUrl"
              v-model="formData.imageUrl"
              type="url"
              required
              placeholder="/uploads/artworks/artwork.jpg"
            />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="formData.featured"
                type="checkbox"
              />
              Featured Artwork
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-button">
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ editingArtwork ? 'Update Artwork' : 'Create Artwork' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Artworks Grid -->
    <div class="artworks-grid">
      <div
        v-for="artwork in artworks"
        :key="artwork.id"
        class="artwork-card"
      >
        <div class="artwork-image">
          <img
            v-if="artwork.imageUrl"
            :src="artwork.imageUrl"
            :alt="artwork.title"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            🎨
          </div>
          <div v-if="artwork.featured" class="featured-badge">
            ⭐ Featured
          </div>
        </div>
        
        <div class="artwork-info">
          <h3>{{ artwork.title }}</h3>
          <p class="artwork-artist">by {{ artwork.artist }}</p>
          <p class="artwork-category">{{ artwork.category }}</p>
          <p v-if="artwork.description" class="artwork-description">
            {{ artwork.description.substring(0, 80) }}{{ artwork.description.length > 80 ? '...' : '' }}
          </p>
          <p class="artwork-date">{{ formatDate(artwork.createdAt) }}</p>
        </div>

        <div class="artwork-actions">
          <button @click="editArtwork(artwork)" class="edit-button">
            ✏️ Edit
          </button>
          <button @click="deleteArtwork(artwork.id)" class="delete-button">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="artworks.length === 0" class="empty-state">
      <p>No artworks found. Add your first artwork to get started!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Artwork {
  id: string
  title: string
  description?: string
  imageUrl: string
  artist: string
  category: string
  featured: boolean
  createdAt: string
}

const artworks = ref<Artwork[]>([])
const showAddForm = ref(false)
const editingArtwork = ref<Artwork | null>(null)

const formData = ref({
  title: '',
  description: '',
  imageUrl: '',
  artist: '',
  category: '',
  featured: false
})

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    imageUrl: '',
    artist: '',
    category: '',
    featured: false
  }
}

const fetchArtworks = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/artworks')
    if (response.ok) {
      artworks.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch artworks:', error)
  }
}

const saveArtwork = async () => {
  try {
    const payload = {
      ...formData.value,
      description: formData.value.description || undefined
    }

    const url = editingArtwork.value
      ? `http://localhost:3001/api/admin/artworks/${editingArtwork.value.id}`
      : 'http://localhost:3001/api/admin/artworks'
    
    const method = editingArtwork.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      await fetchArtworks()
      cancelForm()
    }
  } catch (error) {
    console.error('Failed to save artwork:', error)
  }
}

const editArtwork = (artwork: Artwork) => {
  editingArtwork.value = artwork
  formData.value = {
    title: artwork.title,
    description: artwork.description || '',
    imageUrl: artwork.imageUrl,
    artist: artwork.artist,
    category: artwork.category,
    featured: artwork.featured
  }
  showAddForm.value = false
}

const deleteArtwork = async (id: string) => {
  if (!confirm('Are you sure you want to delete this artwork?')) return

  try {
    const response = await fetch(`http://localhost:3001/api/admin/artworks/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await fetchArtworks()
    }
  } catch (error) {
    console.error('Failed to delete artwork:', error)
  }
}

const cancelForm = () => {
  showAddForm.value = false
  editingArtwork.value = null
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
  fetchArtworks()
})
</script>

<style scoped>
.admin-artworks {
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

.artwork-form {
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

.artworks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.artwork-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.artwork-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
}

.artwork-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
}

.artwork-image img {
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
  font-size: 48px;
  color: white;
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: bold;
}

.artwork-info h3 {
  margin: 0 0 5px 0;
  color: #4ade80;
}

.artwork-artist {
  color: #cbd5e1;
  font-size: 14px;
  margin: 0 0 5px 0;
  font-style: italic;
}

.artwork-category {
  color: #64748b;
  font-size: 13px;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.artwork-description {
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 10px 0;
}

.artwork-date {
  color: #94a3b8;
  font-size: 12px;
  margin: 0 0 15px 0;
}

.artwork-actions {
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
  
  .artworks-grid {
    grid-template-columns: 1fr;
  }
}
</style> 