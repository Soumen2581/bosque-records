<template>
  <section class="hero">
    <div class="hero-copy">
      <img
        :src="bosqueRecordsLogo"
        alt="Bosque Records"
        class="hero-mark"
        width="280"
        height="160"
      >
      <h1>A sanctuary of resonant frequencies</h1>
      <p>{{ label.statement }}</p>
      <div class="hero-actions">
        <router-link to="/releases" class="action action-primary">Discover Music</router-link>
        <router-link to="/roster" class="action">Explore Artists</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import bosqueRecordsLogo from '@/assets/styles/image/logos/Bosque Records Logo.png'
import { label } from '@/config/label'
</script>

<style scoped>
.hero {
  min-height: calc(100vh - 5.5rem);
  display: grid;
  align-items: end;
  padding: 8vh 6vw 10vh;
}

.hero-copy {
  max-width: 40rem;
}

.hero-mark {
  width: min(16rem, 52vw);
  height: auto;
  margin-bottom: 1.75rem;
}

h1 {
  font-family: "IM Fell English", serif;
  font-weight: 400;
  font-size: clamp(2.6rem, 6vw, 5.4rem);
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0 0 1.25rem;
}

p {
  max-width: 36rem;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.65rem 1.15rem;
  border: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
}

.action-primary {
  background: var(--forest);
  border-color: transparent;
}

.action:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}
</style>
