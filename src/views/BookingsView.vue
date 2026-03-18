<template>
  <PageLayout>
    <PageHeader 
      type="creative" 
      subtitle="Summon the forest dwellers..."
    />
    
    <ContentContainer size="medium">
      <ComingSoon 
        title="Bookings"
        message="Summon the forest dwellers..."
        description="Our booking system is being crafted to connect event organizers with our talented roster. Soon you'll be able to request performances from our artists and bring the mystical forest sound to your events."
        icon="fas fa-calendar-check"
      />
    </ContentContainer>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/components/common/PageLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ContentContainer from '@/components/common/ContentContainer.vue'
import ComingSoon from '@/components/common/ComingSoon.vue'
</script> 