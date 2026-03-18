<template>
  <div class="admin-view">
    <div class="admin-header">
      <h1 class="admin-title">🌿 Bosque Records Admin</h1>
      <p class="admin-subtitle">Manage your forest music label</p>
    </div>

    <!-- Stats Dashboard -->
    <div class="stats-grid" v-if="stats">
      <div class="stat-card">
        <div class="stat-number">{{ stats.artists }}</div>
        <div class="stat-label">Artists</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.releases }}</div>
        <div class="stat-label">Releases</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.tracks }}</div>
        <div class="stat-label">Tracks</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.events }}</div>
        <div class="stat-label">Events</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.products }}</div>
        <div class="stat-label">Products</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.artworks }}</div>
        <div class="stat-label">Artworks</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.subscribers }}</div>
        <div class="stat-label">Subscribers</div>
      </div>
    </div>

    <!-- Admin Navigation Tabs -->
    <div class="admin-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content Area -->
    <div class="admin-content">
      <!-- Artists Management -->
      <div v-if="activeTab === 'artists'" class="tab-content">
        <AdminArtists />
      </div>

      <!-- Releases Management -->
      <div v-if="activeTab === 'releases'" class="tab-content">
        <AdminReleases />
      </div>

      <!-- Tracks Management -->
      <div v-if="activeTab === 'tracks'" class="tab-content">
        <AdminTracks />
      </div>

      <!-- Events Management -->
      <div v-if="activeTab === 'events'" class="tab-content">
        <AdminEvents />
      </div>

      <!-- Products Management -->
      <div v-if="activeTab === 'products'" class="tab-content">
        <AdminProducts />
      </div>

      <!-- Artworks Management -->
      <div v-if="activeTab === 'artworks'" class="tab-content">
        <AdminArtworks />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminArtists from '@/components/admin/AdminArtists.vue'
import AdminReleases from '@/components/admin/AdminReleases.vue'
import AdminTracks from '@/components/admin/AdminTracks.vue'
import AdminEvents from '@/components/admin/AdminEvents.vue'
import AdminProducts from '@/components/admin/AdminProducts.vue'
import AdminArtworks from '@/components/admin/AdminArtworks.vue'

const activeTab = ref('artists')
const stats = ref(null)

const tabs = [
  { id: 'artists', label: '🎵 Artists' },
  { id: 'releases', label: '💿 Releases' },
  { id: 'tracks', label: '🎶 Tracks' },
  { id: 'events', label: '🎪 Events' },
  { id: 'products', label: '🛍️ Products' },
  { id: 'artworks', label: '🎨 Artworks' }
]

const fetchStats = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/stats')
    if (response.ok) {
      stats.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.admin-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #0a1a0a 0%, #1a2a1a 100%);
  color: #e8f5e8;
  min-height: 100vh;
}

.admin-header {
  text-align: center;
  margin-bottom: 30px;
}

.admin-title {
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(45deg, #4ade80, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin: 10px 0 0 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(34, 197, 94, 0.2);
  transform: translateY(-2px);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #4ade80;
  margin-bottom: 8px;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-tabs {
  display: flex;
  border-bottom: 2px solid rgba(34, 197, 94, 0.3);
  margin-bottom: 30px;
  overflow-x: auto;
}

.tab-button {
  background: none;
  border: none;
  padding: 15px 25px;
  color: #94a3b8;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.1);
}

.tab-button.active {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.2);
  border-bottom: 3px solid #4ade80;
}

.admin-content {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 30px;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .admin-view {
    padding: 15px;
  }
  
  .admin-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
  }
  
  .admin-content {
    padding: 20px;
  }
}
</style> 