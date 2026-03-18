import { ref, reactive, onUnmounted, computed, type Ref } from 'vue'

interface Track {
  id: string | number
  title: string
  preview?: string
  audioFile?: string
}

interface Release {
  title?: string
  coverImage?: string
  artist?: {
    name: string
  }
}

interface CurrentTrack {
  id: string | number | null
  title: string
  artist: string
  release: string
  audioUrl: string
  coverImage: string
}

export function useAudio() {
  const audio: Ref<HTMLAudioElement | null> = ref(null)
  const isPlaying = ref(false)
  const isLoading = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.7)
  const error: Ref<string | null> = ref(null)
  
  const currentTrack: CurrentTrack = reactive({
    id: null,
    title: '',
    artist: '',
    release: '',
    audioUrl: '',
    coverImage: ''
  })
  
  // Computed
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })
  
  const formattedCurrentTime = computed(() => formatTime(currentTime.value))
  const formattedDuration = computed(() => formatTime(duration.value))
  
  // Helper function to format time
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00'
    
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  // Initialize audio element
  const initAudio = (): void => {
    if (audio.value) return
    
    audio.value = new Audio()
    
    // Event listeners
    audio.value.addEventListener('loadstart', () => {
      isLoading.value = true
      error.value = null
    })
    
    audio.value.addEventListener('canplay', () => {
      isLoading.value = false
      duration.value = audio.value?.duration || 0
    })
    
    audio.value.addEventListener('timeupdate', () => {
      currentTime.value = audio.value?.currentTime || 0
    })
    
    audio.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentTime.value = 0
    })
    
    audio.value.addEventListener('error', (e: Event) => {
      isLoading.value = false
      isPlaying.value = false
      error.value = 'Failed to load audio file'
      console.error('Audio error:', e)
    })
    
    audio.value.addEventListener('play', () => {
      isPlaying.value = true
    })
    
    audio.value.addEventListener('pause', () => {
      isPlaying.value = false
    })
    
    // Set initial volume
    audio.value.volume = volume.value
  }
  
  // Load and play track
  const playTrack = async (track: Track, release?: Release): Promise<void> => {
    try {
      initAudio()
      
      // Update current track info
      currentTrack.id = track.id
      currentTrack.title = track.title
      currentTrack.artist = release?.artist?.name || 'Unknown Artist'
      currentTrack.release = release?.title || ''
      currentTrack.audioUrl = track.preview || track.audioFile || ''
      currentTrack.coverImage = release?.coverImage || ''
      
      if (!currentTrack.audioUrl) {
        throw new Error('No audio URL provided')
      }
      
      // Stop current playback
      await stop()
      
      // Load new track
      if (audio.value) {
        audio.value.src = currentTrack.audioUrl
        audio.value.load()
      }
      
      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          audio.value?.removeEventListener('canplay', onCanPlay)
          audio.value?.removeEventListener('error', onError)
          resolve()
        }
        
        const onError = (e: Event) => {
          audio.value?.removeEventListener('canplay', onCanPlay)
          audio.value?.removeEventListener('error', onError)
          reject(new Error('Failed to load audio'))
        }
        
        audio.value?.addEventListener('canplay', onCanPlay)
        audio.value?.addEventListener('error', onError)
      })
      
      // Start playback
      await audio.value?.play()
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      console.error('Error playing track:', err)
      throw err
    }
  }
  
  // Play/pause toggle
  const togglePlayback = async (): Promise<void> => {
    if (!audio.value) return
    
    try {
      if (isPlaying.value) {
        await pause()
      } else {
        await play()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      error.value = errorMessage
      console.error('Error toggling playback:', err)
    }
  }
  
  // Play
  const play = async (): Promise<void> => {
    if (!audio.value) return
    
    try {
      await audio.value.play()
    } catch (err) {
      error.value = 'Failed to play audio'
      throw err
    }
  }
  
  // Pause
  const pause = async (): Promise<void> => {
    if (!audio.value) return
    
    audio.value.pause()
  }
  
  // Stop
  const stop = async (): Promise<void> => {
    if (!audio.value) return
    
    audio.value.pause()
    audio.value.currentTime = 0
    currentTime.value = 0
  }
  
  // Seek to position
  const seekTo = (position: number): void => {
    if (!audio.value || isNaN(position)) return
    
    const seekTime = Math.max(0, Math.min(duration.value, position))
    audio.value.currentTime = seekTime
    currentTime.value = seekTime
  }
  
  // Seek by percentage
  const seekToPercentage = (percentage: number): void => {
    if (!audio.value || duration.value === 0) return
    
    const seekTime = (percentage / 100) * duration.value
    seekTo(seekTime)
  }
  
  // Set volume
  const setVolume = (newVolume: number): void => {
    const vol = Math.max(0, Math.min(1, newVolume))
    volume.value = vol
    
    if (audio.value) {
      audio.value.volume = vol
    }
  }
  
  // Mute/unmute
  const toggleMute = (): void => {
    if (!audio.value) return
    
    audio.value.muted = !audio.value.muted
  }
  
  // Check if specific track is currently playing
  const isCurrentTrack = (trackId: string | number): boolean => {
    return currentTrack.id === trackId && isPlaying.value
  }
  
  // Clear current track
  const clearTrack = (): void => {
    stop()
    Object.assign(currentTrack, {
      id: null,
      title: '',
      artist: '',
      release: '',
      audioUrl: '',
      coverImage: ''
    })
  }
  
  // Cleanup
  const cleanup = (): void => {
    if (audio.value) {
      audio.value.pause()
      audio.value.src = ''
      audio.value = null
    }
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })
  
  return {
    // State
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    error,
    currentTrack,
    
    // Computed
    progress,
    formattedCurrentTime,
    formattedDuration,
    
    // Methods
    playTrack,
    togglePlayback,
    play,
    pause,
    stop,
    seekTo,
    seekToPercentage,
    setVolume,
    toggleMute,
    isCurrentTrack,
    clearTrack,
    cleanup
  }
} 