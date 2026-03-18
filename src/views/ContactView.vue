<template>
  <PageLayout>
    <PageHeader 
      type="default" 
      subtitle="Reach out through the forest..."
    />
    
    <ContentContainer size="medium">
      <ComingSoon 
        title="Contact Us"
        message="Reach out through the forest..."
        description="We're setting up our communication channels to ensure you can easily connect with us. Soon you'll be able to send messages, inquiries, and join our community through our contact form and social channels."
        icon="fas fa-envelope"
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