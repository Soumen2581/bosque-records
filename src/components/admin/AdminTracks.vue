<template>
  <div class="admin-tracks">
    <div class="section-header">
      <h2>🎶 Tracks Management</h2>
      <button @click="showAddForm = true" class="add-button">
        <span>+</span> Add New Track
      </button>
    </div>

    <!-- Add/Edit Track Form -->
    <div v-if="showAddForm || editingTrack" class="form-modal">
      <div class="form-container">
        <h3>{{ editingTrack ? 'Edit Track' : 'Add New Track' }}</h3>
        
        <form @submit.prevent="saveTrack" class="track-form">
          <div class="form-group">
            <label for="release">Release *</label>
            <select
              id="release"
              v-model="formData.releaseId"
              required
            >
              <option value="">Select a release</option>
              <option
                v-for="release in releases"
                :key="release.id"
                :value="release.id"
              >
                {{ release.title }} ({{ release.artist.name }})
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="title">Track Title *</label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                placeholder="e.g., Awakening"
              />
            </div>

            <div class="form-group">
              <label for="order">Track Order *</label>
              <input
                id="order"
                v-model.number="formData.order"
                type="number"
                min="1"
                required
                placeholder="1"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="duration">Duration (seconds) *</label>
            <input
              id="duration"
              v-model.number="formData.duration"
              type="number"
              min="1"
              required
              placeholder="480"
            />
            <small class="form-hint">
              {{ formData.duration ? formatDuration(formData.duration) : 'Enter duration in seconds' }}
            </small>
          </div>

          <div class="form-group">
            <label for="audioFile">Audio File URL</label>
            <input
              id="audioFile"
              v-model="formData.audioFile"
              type="url"
              placeholder="/uploads/tracks/track.mp3"
            />
          </div>

          <div class="form-group">
            <label for="preview">Preview URL</label>
            <input
              id="preview"
              v-model="formData.preview"
              type="url"
              placeholder="/uploads/previews/track-preview.mp3"
            />
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-button">
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ editingTrack ? 'Update Track' : 'Create Track' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tracks List -->
    <div class="tracks-list">
      <div
        v-for="track in tracks"
        :key="track.id"
        class="track-card"
      >
        <div class="track-number">
          {{ track.order }}
        </div>
        
        <div class="track-info">
          <h3>{{ track.title }}</h3>
          <p class="track-release">{{ track.release.title }}</p>
          <p class="track-artist">by {{ track.release.artist.name }}</p>
          <p class="track-duration">{{ formatDuration(track.duration) }}</p>
        </div>

        <div class="track-files">
          <div v-if="track.audioFile" class="file-info">
            🎵 Audio: {{ getFileName(track.audioFile) }}
          </div>
          <div v-if="track.preview" class="file-info">
            🔊 Preview: {{ getFileName(track.preview) }}
          </div>
          <div v-if="!track.audioFile && !track.preview" class="no-files">
            No audio files
          </div>
        </div>

        <div class="track-actions">
          <button @click="editTrack(track)" class="edit-button">
            ✏️ Edit
          </button>
          <button @click="deleteTrack(track.id)" class="delete-button">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="tracks.length === 0" class="empty-state">
      <p>No tracks found. Add your first track to get started!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Release {
  id: string
  title: string
  artist: {
    name: string
  }
}

interface Track {
  id: string
  title: string
  duration: number
  audioFile?: string
  preview?: string
  order: number
  release: Release
}

const tracks = ref<Track[]>([])
const releases = ref<Release[]>([])
const showAddForm = ref(false)
const editingTrack = ref<Track | null>(null)

const formData = ref({
  title: '',
  duration: null as number | null,
  audioFile: '',
  preview: '',
  order: 1,
  releaseId: ''
})

const resetForm = () => {
  formData.value = {
    title: '',
    duration: null,
    audioFile: '',
    preview: '',
    order: 1,
    releaseId: ''
  }
}

const fetchTracks = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/tracks')
    if (response.ok) {
      tracks.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch tracks:', error)
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

const saveTrack = async () => {
  try {
    const payload = {
      ...formData.value,
      audioFile: formData.value.audioFile || undefined,
      preview: formData.value.preview || undefined
    }

    const url = editingTrack.value
      ? `http://localhost:3001/api/admin/tracks/${editingTrack.value.id}`
      : 'http://localhost:3001/api/admin/tracks'
    
    const method = editingTrack.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      await fetchTracks()
      cancelForm()
    }
  } catch (error) {
    console.error('Failed to save track:', error)
  }
}

const editTrack = (track: Track) => {
  editingTrack.value = track
  formData.value = {
    title: track.title,
    duration: track.duration,
    audioFile: track.audioFile || '',
    preview: track.preview || '',
    order: track.order,
    releaseId: track.release.id
  }
  showAddForm.value = false
}

const deleteTrack = async (id: string) => {
  if (!confirm('Are you sure you want to delete this track?')) return

  try {
    const response = await fetch(`http://localhost:3001/api/admin/tracks/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await fetchTracks()
    }
  } catch (error) {
    console.error('Failed to delete track:', error)
  }
}

const cancelForm = () => {
  showAddForm.value = false
  editingTrack.value = null
  resetForm()
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getFileName = (url: string) => {
  return url.split('/').pop() || url
}

onMounted(() => {
  fetchTracks()
  fetchReleases()
})
</script>

<style scoped>
.admin-tracks {
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

.track-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 120px;
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
.form-group select {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
  padding: 12px;
  color: #e8f5e8;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
}

.form-hint {
  color: #64748b;
  font-size: 12px;
  font-style: italic;
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

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.track-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: grid;
  grid-template-columns: 60px 1fr auto auto;
  gap: 20px;
  align-items: center;
  transition: all 0.3s ease;
}

.track-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-1px);
}

.track-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 18px;
}

.track-info h3 {
  margin: 0 0 5px 0;
  color: #4ade80;
}

.track-release {
  color: #cbd5e1;
  font-size: 14px;
  margin: 0 0 3px 0;
}

.track-artist {
  color: #64748b;
  font-size: 13px;
  margin: 0 0 5px 0;
}

.track-duration {
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
  font-family: monospace;
}

.track-files {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;
}

.file-info {
  color: #94a3b8;
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 4px;
}

.no-files {
  color: #64748b;
  font-size: 12px;
  font-style: italic;
}

.track-actions {
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
  
  .track-card {
    grid-template-columns: 1fr;
    gap: 15px;
    text-align: center;
  }
  
  .track-files {
    min-width: auto;
  }
}
</style> 