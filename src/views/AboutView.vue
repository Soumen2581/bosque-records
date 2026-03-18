<template>
  <PageLayout>
    <PageHeader 
      type="default" 
      subtitle="Deep forest mysteries await..."
    />
    
    <ContentContainer size="medium">
      <ComingSoon 
        title="About Us"
        message="Deep forest mysteries await..."
        description="We are crafting our story to share with you the journey of Bosque Records. Soon, you'll discover our origins, our vision, and the collective spirit that drives our mystical soundscapes."
        icon="fas fa-tree"
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