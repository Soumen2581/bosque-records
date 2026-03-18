import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useScrollAnimations() {
  const isVisible = ref<boolean>(false)
  const scrollY = ref<number>(0)
  const parallaxOffset = ref<number>(0)

  const handleScroll = () => {
    scrollY.value = window.scrollY
    parallaxOffset.value = scrollY.value * 0.5
  }

  const setupIntersectionObserver = (elementRef: Ref<HTMLElement | null>, options?: IntersectionObserverInit) => {
    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    }

    if (!elementRef.value) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in')
          entry.target.classList.remove('opacity-0')
          observer.unobserve(entry.target)
        }
      })
    }, defaultOptions)

    observer.observe(elementRef.value)

    return () => {
      if (elementRef.value) {
        observer.unobserve(elementRef.value)
      }
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    scrollY,
    parallaxOffset,
    isVisible,
    setupIntersectionObserver
  }
}

