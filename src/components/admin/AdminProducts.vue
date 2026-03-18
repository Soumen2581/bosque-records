<template>
  <div class="admin-products">
    <div class="section-header">
      <h2>🛍️ Products Management</h2>
      <button @click="showAddForm = true" class="add-button">
        <span>+</span> Add New Product
      </button>
    </div>

    <!-- Add/Edit Product Form -->
    <div v-if="showAddForm || editingProduct" class="form-modal">
      <div class="form-container">
        <h3>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
        
        <form @submit.prevent="saveProduct" class="product-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Product Name *</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                placeholder="e.g., Bosque Records Hoodie"
              />
            </div>

            <div class="form-group">
              <label for="slug">Slug *</label>
              <input
                id="slug"
                v-model="formData.slug"
                type="text"
                required
                placeholder="e.g., bosque-records-hoodie"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              placeholder="Product description..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">Price ($) *</label>
              <input
                id="price"
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="29.99"
              />
            </div>

            <div class="form-group">
              <label for="category">Category *</label>
              <select
                id="category"
                v-model="formData.category"
                required
              >
                <option value="">Select category</option>
                <option value="Apparel">Apparel</option>
                <option value="Vinyl">Vinyl</option>
                <option value="Accessories">Accessories</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Digital">Digital</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="quantity">Quantity *</label>
              <input
                id="quantity"
                v-model.number="formData.quantity"
                type="number"
                min="0"
                required
                placeholder="50"
              />
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="formData.inStock"
                  type="checkbox"
                />
                In Stock
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Product Images</label>
            <div class="images-input">
              <div
                v-for="(image, index) in formData.images"
                :key="index"
                class="image-input-row"
              >
                <input
                  v-model="formData.images[index]"
                  type="url"
                  placeholder="/uploads/products/image.jpg"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="remove-image-button"
                >
                  ✕
                </button>
              </div>
              <button
                type="button"
                @click="addImage"
                class="add-image-button"
              >
                + Add Image
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-button">
              Cancel
            </button>
            <button type="submit" class="save-button">
              {{ editingProduct ? 'Update Product' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Products List -->
    <div class="products-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <div class="product-images">
          <img
            v-if="getProductImages(product)[0]"
            :src="getProductImages(product)[0]"
            :alt="product.name"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            🛍️
          </div>
          <div class="image-count" v-if="getProductImages(product).length > 1">
            +{{ getProductImages(product).length - 1 }} more
          </div>
        </div>
        
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="product-category">{{ product.category }}</p>
          <p class="product-price">${{ product.price }}</p>
          <p class="product-stock">
            <span :class="{ 'in-stock': product.inStock, 'out-of-stock': !product.inStock }">
              {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
            </span>
            • {{ product.quantity }} available
          </p>
          <p v-if="product.description" class="product-description">
            {{ product.description.substring(0, 80) }}{{ product.description.length > 80 ? '...' : '' }}
          </p>
        </div>

        <div class="product-actions">
          <button @click="editProduct(product)" class="edit-button">
            ✏️ Edit
          </button>
          <button @click="deleteProduct(product.id)" class="delete-button">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <div v-if="products.length === 0" class="empty-state">
      <p>No products found. Add your first product to get started!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  images: string
  category: string
  inStock: boolean
  quantity: number
}

const products = ref<Product[]>([])
const showAddForm = ref(false)
const editingProduct = ref<Product | null>(null)

const formData = ref({
  name: '',
  slug: '',
  description: '',
  price: null as number | null,
  images: [''],
  category: '',
  inStock: true,
  quantity: 0
})

const resetForm = () => {
  formData.value = {
    name: '',
    slug: '',
    description: '',
    price: null,
    images: [''],
    category: '',
    inStock: true,
    quantity: 0
  }
}

const addImage = () => {
  formData.value.images.push('')
}

const removeImage = (index: number) => {
  if (formData.value.images.length > 1) {
    formData.value.images.splice(index, 1)
  }
}

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/products')
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

const saveProduct = async () => {
  try {
    const payload = {
      ...formData.value,
      images: formData.value.images.filter(img => img.trim()),
      description: formData.value.description || undefined
    }

    const url = editingProduct.value
      ? `http://localhost:3001/api/admin/products/${editingProduct.value.id}`
      : 'http://localhost:3001/api/admin/products'
    
    const method = editingProduct.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      await fetchProducts()
      cancelForm()
    }
  } catch (error) {
    console.error('Failed to save product:', error)
  }
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  const images = getProductImages(product)
  formData.value = {
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    images: images.length > 0 ? images : [''],
    category: product.category,
    inStock: product.inStock,
    quantity: product.quantity
  }
  showAddForm.value = false
}

const deleteProduct = async (id: string) => {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    const response = await fetch(`http://localhost:3001/api/admin/products/${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await fetchProducts()
    }
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}

const cancelForm = () => {
  showAddForm.value = false
  editingProduct.value = null
  resetForm()
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

const getProductImages = (product: Product): string[] => {
  try {
    return JSON.parse(product.images)
  } catch {
    return []
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.admin-products {
  color: #e8f5e8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-header h2 {
  margin: 0;
  color: #4ade80;
}

.add-button {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.form-container {
  background: #1a2a1a;
  border-radius: 12px;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.form-container h3 {
  margin: 0 0 25px 0;
  color: #4ade80;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #94a3b8;
}

.form-group input,
.form-group textarea,
.form-group select {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
  padding: 12px;
  color: #e8f5e8;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #94a3b8;
  margin-top: 20px;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.images-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.image-input-row input {
  flex: 1;
}

.remove-image-button {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.add-image-button {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 10px;
}

.save-button {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.cancel-button {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.product-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  border-color: rgba(34, 197, 94, 0.4);
  transform: translateY(-2px);
}

.product-images {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
}

.product-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.image-count {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.product-info h3 {
  margin: 0 0 5px 0;
  color: #4ade80;
}

.product-category {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 5px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-price {
  color: #4ade80;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.product-stock {
  color: #94a3b8;
  font-size: 13px;
  margin: 0 0 10px 0;
}

.in-stock {
  color: #4ade80;
}

.out-of-stock {
  color: #f87171;
}

.product-description {
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 15px 0;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.edit-button, .delete-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-button {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.edit-button:hover {
  background: rgba(59, 130, 246, 0.3);
}

.delete-button {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.delete-button:hover {
  background: rgba(239, 68, 68, 0.3);
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 40px;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style> 