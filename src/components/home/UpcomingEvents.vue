<template>
  <section class="events">
    <div class="wrap">
      <h2>Events</h2>
      <ul v-if="eventsStore.upcomingEvents.length">
        <li v-for="event in eventsStore.upcomingEvents" :key="event.id">
          <router-link :to="`/events/${event.slug}`">
            <span>{{ formatDate(event.date) }}</span>
            <strong>{{ event.title }}</strong>
            <em>{{ event.venue }}<template v-if="event.location">, {{ event.location }}</template></em>
          </router-link>
        </li>
      </ul>
      <p v-else class="empty">
        No upcoming events are published.
        <router-link to="/bookings">Book the label.</router-link>
      </p>
    </div>
  </section>
</template>

<script setup>
import { useEventsStore } from '@/stores/events'

const eventsStore = useEventsStore()

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.events {
  padding: 4.5rem 6vw;
}

.wrap {
  max-width: 72rem;
  margin: 0 auto;
}

h2 {
  font-family: "IM Fell English", serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 400;
  color: var(--ink);
  margin: 0 0 1.5rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  display: grid;
  gap: 0.2rem;
  padding: 1.1rem 0;
  border-top: 1px solid var(--line);
  color: inherit;
  text-decoration: none;
}

li:last-child a {
  border-bottom: 1px solid var(--line);
}

span,
em {
  color: var(--muted);
  font-style: normal;
}

strong {
  font-family: "IM Fell English", serif;
  font-size: 1.6rem;
  font-weight: 400;
}

.empty a {
  display: inline;
  border: 0;
  padding: 0;
  color: var(--gold);
}
</style>
