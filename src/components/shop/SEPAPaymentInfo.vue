<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 mb-4">
      <i class="fas fa-university text-xl text-blue-400"></i>
      <span class="text-gray-light font-fell">SEPA Bank Transfer</span>
    </div>

    <!-- Info box -->
    <div class="p-4 bg-blue-900/20 border border-blue-800/50 rounded">
      <p class="text-sm text-gray-light">
        <i class="fas fa-info-circle text-blue-400 mr-2"></i>
        Transfer the total amount to the account below. Your order will be
        processed once payment is received (usually 2-5 business days).
      </p>
    </div>

    <!-- Bank details card -->
    <div class="p-4 bg-forest-black border border-forest-green/50 rounded space-y-4">
      <div class="flex justify-between items-center pb-3 border-b border-forest-green/30">
        <span class="text-sm text-gray-medium">Bank</span>
        <span class="text-gray-light font-medium">{{ bankDetails.bankName }}</span>
      </div>

      <div class="flex justify-between items-center py-3 border-b border-forest-green/30">
        <span class="text-sm text-gray-medium">Account Holder</span>
        <span class="text-gray-light font-medium">{{ bankDetails.accountHolder }}</span>
      </div>

      <div class="flex justify-between items-center py-3 border-b border-forest-green/30">
        <span class="text-sm text-gray-medium">IBAN</span>
        <div class="text-right">
          <span class="text-mystical-gold font-mono text-lg tracking-wider">
            {{ bankDetails.iban }}
          </span>
          <button
            @click="copyToClipboard(bankDetails.iban)"
            class="ml-2 text-gray-medium hover:text-mystical-gold transition-colors"
            title="Copy IBAN"
          >
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center py-3 border-b border-forest-green/30">
        <span class="text-sm text-gray-medium">BIC / SWIFT</span>
        <span class="text-gray-light font-mono tracking-wider">
          {{ bankDetails.bic }}
          <button
            @click="copyToClipboard(bankDetails.bic)"
            class="ml-2 text-gray-medium hover:text-mystical-gold transition-colors"
            title="Copy BIC"
          >
            <i class="fas fa-copy"></i>
          </button>
        </span>
      </div>

      <div class="flex justify-between items-center pt-3">
        <span class="text-sm text-gray-medium">Reference</span>
        <span class="text-mystical-gold font-fell text-lg">
          {{ bankDetails.reference }}
        </span>
      </div>
    </div>

    <!-- Amount to transfer -->
    <div class="p-4 bg-mystical-gold/10 border border-mystical-gold/30 rounded">
      <div class="flex justify-between items-center">
        <span class="text-gray-medium">Amount to Transfer</span>
        <span class="text-2xl text-mystical-gold font-fell">
          €{{ amount.toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- Important notes -->
    <div class="space-y-2 text-sm text-gray-medium">
      <h4 class="text-gray-light font-medium flex items-center gap-2">
        <i class="fas fa-exclamation-triangle text-yellow-500"></i>
        Important Notes:
      </h4>
      <ul class="list-disc list-inside space-y-1 pl-4">
        <li>Use the reference <strong class="text-gray-light">{{ bankDetails.reference }}</strong> as payment purpose</li>
        <li>Transfers usually take 2-5 business days within SEPA zone</li>
        <li>Your order will be processed after payment confirmation</li>
        <li>You'll receive an email confirmation once payment is received</li>
      </ul>
    </div>

    <!-- Copy all button -->
    <button
      @click="copyAllDetails"
      class="w-full py-3 bg-forest-green hover:bg-green-accent text-gray-light font-fell rounded transition-colors"
    >
      <i class="fas fa-copy mr-2"></i>
      Copy All Bank Details
    </button>

    <!-- Success message -->
    <Transition name="fade">
      <div
        v-if="copied"
        class="fixed bottom-4 right-4 bg-green-accent text-white px-4 py-2 rounded shadow-lg flex items-center gap-2"
      >
        <i class="fas fa-check-circle"></i>
        Copied to clipboard!
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  bankDetails: {
    bankName: string
    iban: string
    bic: string
    accountHolder: string
    reference: string
  }
  amount: number
}>()

const copied = ref(false)

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

const copyAllDetails = async () => {
  const details = `Bank Transfer Details
-------------------
Bank: Bosque Records
IBAN: DE00 0000 0000 0000 0000 00
BIC: XXXXXXXXXXX
Reference: Order BR-XXXXX
Amount: €0.00

Please use the reference as payment purpose.`

  await copyToClipboard(details)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
