<template>
  <PageLayout>
    <PageHeader 
      type="creative" 
      subtitle="Gather under ancient trees..."
    />
    
    <ContentContainer size="medium">
      <ComingSoon 
        title="Events"
        message="Gather under ancient trees..."
        description="Our events calendar is being prepared to showcase upcoming festivals, club nights, and gatherings where you can experience the Bosque Records sound live. Stay tuned for announcements of mystical gatherings in the forest."
        icon="fas fa-calendar-alt"
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