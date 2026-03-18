<template>
  <PageLayout>
    <PageHeader 
      type="creative" 
      subtitle="Sacred imagery awakens..."
    />
    
    <ContentContainer size="medium">
      <ComingSoon 
        title="Visual Arts Gallery"
        message="Sacred imagery awakens..."
        description="Prepare to immerse yourself in a gallery of visionary art that complements our sonic journeys. Our visual artists are preparing stunning works that capture the essence of the mystical forest experience."
        icon="fas fa-palette"
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