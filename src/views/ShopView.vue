<template>
  <PageLayout>
    <PageHeader 
      type="default" 
      subtitle="Forest treasures await..."
    />
    
    <ContentContainer size="medium">
      <ComingSoon 
        title="Shop"
        message="Forest treasures await..."
        description="Our online shop is being prepared with exclusive merchandise, vinyl records, and sacred artifacts. Soon you'll be able to take home a piece of the mystical forest experience."
        icon="fas fa-shopping-bag"
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