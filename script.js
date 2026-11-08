/**
 * MY AGENT - Modern Real Estate Listing Application
 * Vanilla JavaScript (ES6+), localStorage persistence, client-side image compression
 */

// ==========================================================================
// CONSTANTS & INITIAL SAMPLE DATA
// ==========================================================================
// APP STATE
// ==========================================================================
let properties = [];
let currentUploadedImageBase64 = '';
let propertyToDeleteId = null;

// ==========================================================================
// DOM ELEMENTS SELECTION
// ==========================================================================
// Stats Elements
const statTotalCount = document.getElementById('stat-total-count');
const statRentCount = document.getElementById('stat-rent-count');
const statSaleCount = document.getElementById('stat-sale-count');
const statAvailableCount = document.getElementById('stat-available-count');

// Search & Filter Elements
const searchInput = document.getElementById('search-input');
const btnClearSearch = document.getElementById('btn-clear-search');
const filterPropertyType = document.getElementById('filter-property-type');
const filterListingType = document.getElementById('filter-listing-type');
const filterBedrooms = document.getElementById('filter-bedrooms');
const filterMinPrice = document.getElementById('filter-min-price');
const filterMaxPrice = document.getElementById('filter-max-price');
const filterAvailability = document.getElementById('filter-availability');
const btnClearAllFilters = document.getElementById('btn-clear-all-filters');
const btnToggleFilters = document.getElementById('btn-toggle-filters');
const filterControlsGroup = document.getElementById('filter-controls-group');
const activeFilterCountBadge = document.getElementById('active-filter-count');
const sortPropertiesSelect = document.getElementById('sort-properties');
const resultsCountText = document.getElementById('results-count-text');

// Grid & Empty States
const propertiesGrid = document.getElementById('properties-grid');
const emptyStateNoData = document.getElementById('empty-state-no-data');
const emptyStateNoResults = document.getElementById('empty-state-no-results');
const btnResetFiltersEmpty = document.getElementById('btn-reset-filters-empty');
const btnSeedSampleData = document.getElementById('btn-seed-sample-data');

// Property Form Modal Elements
const propertyModal = document.getElementById('property-modal');
const propertyModalTitle = document.getElementById('property-modal-title');
const btnOpenAddModal = document.getElementById('btn-open-add-modal');
const btnClosePropertyModal = document.getElementById('btn-close-property-modal');
const btnCancelForm = document.getElementById('btn-cancel-form');
const propertyForm = document.getElementById('property-form');
const saveBtnText = document.getElementById('save-btn-text');

// Form Inputs
const formPropertyId = document.getElementById('form-property-id');
const formTitle = document.getElementById('form-title');
const formPropertyType = document.getElementById('form-property-type');
const formListingType = document.getElementById('form-listing-type');
const formBedrooms = document.getElementById('form-bedrooms');
const formBathrooms = document.getElementById('form-bathrooms');
const formLocation = document.getElementById('form-location');
const formPrice = document.getElementById('form-price');
const formDescription = document.getElementById('form-description');
const formImageFile = document.getElementById('form-image-file');
const uploadDropzone = document.getElementById('upload-dropzone');
const imagePreviewContainer = document.getElementById('image-preview-container');
const formImagePreview = document.getElementById('form-image-preview');
const btnRemoveImage = document.getElementById('btn-remove-image');
const presetButtons = document.querySelectorAll('.preset-btn');

// Details Modal Elements
const detailsModal = document.getElementById('details-modal');
const btnCloseDetailsModal = document.getElementById('btn-close-details-modal');
const detailsContentContainer = document.getElementById('details-content-container');

// Delete Confirmation Modal Elements
const deleteModal = document.getElementById('delete-modal');
const deletePropertyName = document.getElementById('delete-property-name');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');

// Theme & Notifications
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const toastContainer = document.getElementById('toast-container');
const compressionCanvas = document.getElementById('compression-canvas');

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadPropertiesFromStorage();
  setupEventListeners();
  renderApp();
  const requestedListing = new URLSearchParams(location.search).get('listing');
  if (requestedListing) {
    if (properties.some(p => p.id === requestedListing)) openDetailsModal(requestedListing);
    else showToast('This listing is no longer available.', 'info');
  }
});

/**
 * Initializes theme based on localStorage or user system preference
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

/**
 * Toggles theme between light and dark mode
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  showToast(`Switched to ${newTheme} mode`, 'info');
}

/**
 * Loads properties from localStorage. If none exist, seeds with sample Nigerian properties.
 */
function loadPropertiesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        properties = parsed;
        return;
      }
    }
  } catch (err) {
    console.warn('Error reading from localStorage:', err);
  }

  // Seed sample data if localStorage is empty
  properties = [...SAMPLE_PROPERTIES];
  savePropertiesToStorage();
}

/**
 * Saves current properties array to localStorage with error handling for quota
 */
function savePropertiesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    return true;
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      showToast('Browser storage is full! Please delete some properties or upload smaller images.', 'error');
    } else {
      showToast('Failed to save data: ' + err.message, 'error');
    }
    return false;
  }
}

// ==========================================================================
// EVENT LISTENERS SETUP
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Open Add Modal
  btnOpenAddModal.addEventListener('click', () => openPropertyModal('add'));
  document.querySelectorAll('.btn-add-first-property').forEach(btn => {
    btn.addEventListener('click', () => openPropertyModal('add'));
  });

  // Modal Closers
  btnClosePropertyModal.addEventListener('click', closePropertyModal);
  btnCancelForm.addEventListener('click', closePropertyModal);
  btnCloseDetailsModal.addEventListener('click', closeDetailsModal);
  detailsModal.addEventListener('close', () => {
    const url = new URL(location.href);
    if (url.searchParams.has('listing')) {
      url.searchParams.delete('listing');
      history.replaceState(null, '', url);
    }
  });
  btnCancelDelete.addEventListener('click', closeDeleteModal);
  btnConfirmDelete.addEventListener('click', handleConfirmDelete);

  // Close modals on clicking outside dialog (light dismiss)
  [propertyModal, detailsModal, deleteModal].forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        dialog.close();
      }
    });
  });

  // Form Submissions
  propertyForm.addEventListener('submit', handleFormSubmit);

  // Search & Filter Listeners
  searchInput.addEventListener('input', () => {
    btnClearSearch.classList.toggle('hidden', !searchInput.value.trim());
    renderApp();
  });

  btnClearSearch.addEventListener('click', () => {
    searchInput.value = '';
    btnClearSearch.classList.add('hidden');
    searchInput.focus();
    renderApp();
  });

  [filterPropertyType, filterListingType, filterBedrooms, filterMinPrice, filterMaxPrice, filterAvailability].forEach(el => {
    el.addEventListener('input', renderApp);
    el.addEventListener('change', renderApp);
  });

  sortPropertiesSelect.addEventListener('change', renderApp);

  btnClearAllFilters.addEventListener('click', resetAllFilters);
  btnResetFiltersEmpty.addEventListener('click', resetAllFilters);

  // Toggle Filters on mobile
  btnToggleFilters.addEventListener('click', () => {
    const isExpanded = filterControlsGroup.classList.toggle('expanded');
    btnToggleFilters.setAttribute('aria-expanded', isExpanded);
  });

  // Seed sample data button
  btnSeedSampleData.addEventListener('click', () => {
    properties = [...SAMPLE_PROPERTIES];
    savePropertiesToStorage();
    renderApp();
    showToast('Sample properties loaded successfully!', 'success');
  });

  // Image upload handling
  uploadDropzone.addEventListener('click', () => formImageFile.click());
  uploadDropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      formImageFile.click();
    }
  });

  formImageFile.addEventListener('change', handleImageFileSelected);

  // Drag and drop for image upload
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadDropzone.classList.add('drag-active');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadDropzone.classList.remove('drag-active');
    });
  });

  uploadDropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      processSelectedImageFile(files[0]);
    }
  });

  btnRemoveImage.addEventListener('click', removeUploadedImage);

  // Quick preset sample images
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetUrl = btn.dataset.preset;
      currentUploadedImageBase64 = presetUrl;
      formImagePreview.src = presetUrl;
      uploadDropzone.classList.add('hidden');
      imagePreviewContainer.classList.remove('hidden');
      clearError('image');
    });
  });

  // Real-time validation clearing on input
  formTitle.addEventListener('input', () => clearError('title'));
  formPropertyType.addEventListener('change', () => clearError('property-type'));
  formListingType.addEventListener('change', () => clearError('listing-type'));
  formBedrooms.addEventListener('change', () => clearError('bedrooms'));
  formBathrooms.addEventListener('input', () => clearError('bathrooms'));
  formLocation.addEventListener('input', () => clearError('location'));
  formPrice.addEventListener('input', () => clearError('price'));
  formDescription.addEventListener('input', () => clearError('description'));
}

// ==========================================================================
// IMAGE COMPRESSION & RESIZING (Client-Side HTML5 Canvas)
// ==========================================================================
/**
 * Processes selected image file, resizes to max 800px width/height and compresses to JPEG
 * This prevents localStorage 5MB quota errors.
 */
function handleImageFileSelected(e) {
  const file = e.target.files && e.target.files[0];
  if (file) {
    processSelectedImageFile(file);
  }
}

function processSelectedImageFile(file) {
  if (!file.type.startsWith('image/')) {
    showError('image', 'Please select a valid image file (JPG, PNG, WebP)');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // Calculate scaled dimensions to keep localStorage usage small (e.g. max 800px)
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      compressionCanvas.width = width;
      compressionCanvas.height = height;
      const ctx = compressionCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to compressed JPEG data URL (~40-60KB)
      const compressedDataUrl = compressionCanvas.toDataURL('image/jpeg', 0.78);
      currentUploadedImageBase64 = compressedDataUrl;
      formImagePreview.src = compressedDataUrl;

      uploadDropzone.classList.add('hidden');
      imagePreviewContainer.classList.remove('hidden');
      clearError('image');
    };
    img.onerror = () => {
      showError('image', 'Could not read image. Please try another file.');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function removeUploadedImage() {
  currentUploadedImageBase64 = '';
  formImageFile.value = '';
  formImagePreview.src = '';
  imagePreviewContainer.classList.add('hidden');
  uploadDropzone.classList.remove('hidden');
}

// ==========================================================================
// RENDER & FILTERING ENGINE
// ==========================================================================
/**
 * Main application render function. Updates statistics, filters listings, and updates UI.
 */
function renderApp() {
  updateStatistics();

  const filteredProperties = getFilteredProperties();
  updateResultsCount(filteredProperties.length, properties.length);

  // Handle Empty States
  if (properties.length === 0) {
    propertiesGrid.classList.add('hidden');
    emptyStateNoResults.classList.add('hidden');
    emptyStateNoData.classList.remove('hidden');
    return;
  }

  if (filteredProperties.length === 0) {
    propertiesGrid.classList.add('hidden');
    emptyStateNoData.classList.add('hidden');
    emptyStateNoResults.classList.remove('hidden');
    return;
  }

  // Render cards
  emptyStateNoData.classList.add('hidden');
  emptyStateNoResults.classList.add('hidden');
  propertiesGrid.classList.remove('hidden');

  renderPropertyCards(filteredProperties);
}

/**
 * Updates Statistics Counter Cards
 */
function updateStatistics() {
  const total = properties.length;
  const forRent = properties.filter(p => p.listingType === 'For Rent').length;
  const forSale = properties.filter(p => p.listingType === 'For Sale').length;
  const available = properties.filter(p => p.availability === 'Available').length;

  statTotalCount.textContent = total;
  statRentCount.textContent = forRent;
  statSaleCount.textContent = forSale;
  statAvailableCount.textContent = available;
}

/**
 * Filters and sorts properties based on all active controls
 */
function getFilteredProperties() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedType = filterPropertyType.value;
  const selectedListingType = filterListingType.value;
  const selectedBedrooms = filterBedrooms.value;
  const minPrice = parseFloat(filterMinPrice.value);
  const maxPrice = parseFloat(filterMaxPrice.value);
  const selectedAvailability = filterAvailability.value;
  const sortBy = sortPropertiesSelect.value;

  // Track active filters for badge
  let activeFilterCount = 0;
  if (selectedType !== 'all') activeFilterCount++;
  if (selectedListingType !== 'all') activeFilterCount++;
  if (selectedBedrooms !== 'all') activeFilterCount++;
  if (!isNaN(minPrice)) activeFilterCount++;
  if (!isNaN(maxPrice)) activeFilterCount++;
  if (selectedAvailability !== 'all') activeFilterCount++;

  if (activeFilterCount > 0) {
    activeFilterCountBadge.textContent = activeFilterCount;
    activeFilterCountBadge.classList.remove('hidden');
  } else {
    activeFilterCountBadge.classList.add('hidden');
  }

  // Filter listings
  const filtered = properties.filter(prop => {
    // Search keyword match (title or location)
    if (searchTerm) {
      const matchTitle = (prop.title || '').toLowerCase().includes(searchTerm);
      const matchLocation = (prop.location || '').toLowerCase().includes(searchTerm);
      if (!matchTitle && !matchLocation) return false;
    }

    // Property Type
    if (selectedType !== 'all' && prop.type !== selectedType) {
      return false;
    }

    // Listing Type
    if (selectedListingType !== 'all' && prop.listingType !== selectedListingType) {
      return false;
    }

    // Bedrooms
    if (selectedBedrooms !== 'all') {
      if (selectedBedrooms === '5') {
        const beds = parseInt(prop.bedrooms, 10);
        if (beds < 5) return false;
      } else {
        if (String(prop.bedrooms) !== selectedBedrooms) return false;
      }
    }

    // Price range
    const price = Number(prop.price);
    if (!isNaN(minPrice) && price < minPrice) return false;
    if (!isNaN(maxPrice) && price > maxPrice) return false;

    // Availability
    if (selectedAvailability !== 'all' && prop.availability !== selectedAvailability) {
      return false;
    }

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    if (sortBy === 'bedrooms-high') return Number(b.bedrooms) - Number(a.bedrooms);
    // Default: 'newest'
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  return filtered;
}

/**
 * Updates result count headline
 */
function updateResultsCount(shownCount, totalCount) {
  if (shownCount === totalCount) {
    resultsCountText.textContent = `Showing all ${totalCount} properties`;
  } else {
    resultsCountText.textContent = `Showing ${shownCount} of ${totalCount} properties`;
  }
}

/**
 * Clears search and all filter controls
 */
function resetAllFilters() {
  searchInput.value = '';
  btnClearSearch.classList.add('hidden');
  filterPropertyType.value = 'all';
  filterListingType.value = 'all';
  filterBedrooms.value = 'all';
  filterMinPrice.value = '';
  filterMaxPrice.value = '';
  filterAvailability.value = 'all';
  sortPropertiesSelect.value = 'newest';

  renderApp();
  showToast('All filters have been reset', 'info');
}

// ==========================================================================
// PROPERTY CARDS RENDERING
// ==========================================================================
/**
 * Renders property cards into the grid
 */
function renderPropertyCards(items) {
  propertiesGrid.innerHTML = '';

  const fragment = document.createDocumentFragment();

  items.forEach(prop => {
    const card = document.createElement('article');
    card.className = 'property-card';
    card.setAttribute('aria-label', `${prop.title}, ${prop.location}`);
    card.dataset.id = prop.id;

    const formattedPrice = formatNairaPrice(prop.price);
    const rentPeriod = prop.listingType === 'For Rent' ? '<span class="card-price-period"> / year</span>' : '';
    const badgeListingClass = prop.listingType === 'For Rent' ? 'badge-rent' : 'badge-sale';
    const isAvailable = prop.availability === 'Available';
    const badgeAvailClass = isAvailable ? 'badge-available' : 'badge-unavailable';

    card.innerHTML = `
      <div class="card-media">
        <img
          src="${escapeHtml(prop.image || 'assets/images/duplex.jpg')}"
          alt="${escapeHtml(prop.title)}"
          class="card-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='assets/images/duplex.jpg';"
        >
        <div class="card-badges-top">
          <span class="badge ${badgeListingClass}">${escapeHtml(prop.listingType)}</span>
          <span class="badge ${badgeAvailClass}">${escapeHtml(prop.availability)}</span>
        </div>
        <span class="badge-type">${escapeHtml(prop.type)}</span>
      </div>

      <div class="card-content">
        <div class="card-price-row">
          <span class="card-price">${formattedPrice}</span>${rentPeriod}
        </div>

        <h3 class="card-title" title="${escapeHtml(prop.title)}">${escapeHtml(prop.title)}</h3>

        <p class="card-location">
          <svg class="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${escapeHtml(prop.location)}</span>
        </p>

        <div class="card-features">
          <div class="feature-item" title="${prop.bedrooms} Bedrooms">
            <svg class="feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 4v16"></path>
              <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
              <path d="M2 17h20"></path>
              <path d="M6 8v9"></path>
            </svg>
            <span>${escapeHtml(prop.bedrooms)} ${Number(prop.bedrooms) === 1 ? 'Bed' : 'Beds'}</span>
          </div>

          <div class="feature-item" title="${prop.bathrooms} Bathrooms">
            <svg class="feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 6h6"></path>
              <path d="M10 3v3"></path>
              <path d="M14 3v3"></path>
              <rect x="3" y="11" width="18" height="9" rx="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>${escapeHtml(prop.bathrooms)} ${Number(prop.bathrooms) === 1 ? 'Bath' : 'Baths'}</span>
          </div>

          <div class="feature-item" title="${prop.type}">
            <svg class="feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span>${escapeHtml(prop.type)}</span>
          </div>
        </div>

        <div class="card-footer">
          <button type="button" class="card-btn-view" aria-label="View ${escapeHtml(prop.title)}">
            <span>View details</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div class="card-admin-actions">
            <button
              type="button"
              class="btn-card-action btn-card-edit"
              data-id="${escapeHtml(prop.id)}"
              title="Edit Property"
              aria-label="Edit ${escapeHtml(prop.title)}"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              type="button"
              class="btn-card-action btn-card-delete"
              data-id="${escapeHtml(prop.id)}"
              title="Delete Property"
              aria-label="Delete ${escapeHtml(prop.title)}"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Click on entire card opens details
    card.addEventListener('click', () => {
      openDetailsModal(prop.id);
    });

    // Edit button click
    const editBtn = card.querySelector('.btn-card-edit');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPropertyModal('edit', prop.id);
    });

    // Delete button click
    const deleteBtn = card.querySelector('.btn-card-delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDeleteModal(prop.id);
    });

    fragment.appendChild(card);
  });

  propertiesGrid.appendChild(fragment);
}

// ==========================================================================
// DETAILS MODAL
// ==========================================================================
function openDetailsModal(id) {
  const prop = properties.find(p => p.id === id);
  if (!prop) return;

  const formattedPrice = formatNairaPrice(prop.price);
  const rentPeriod = prop.listingType === 'For Rent' ? '<span class="details-price-period"> / year</span>' : '';
  const badgeListingClass = prop.listingType === 'For Rent' ? 'badge-rent' : 'badge-sale';
  const badgeAvailClass = prop.availability === 'Available' ? 'badge-available' : 'badge-unavailable';

  detailsContentContainer.innerHTML = `
    <div class="details-hero">
      <img
        src="${escapeHtml(prop.image || 'assets/images/duplex.jpg')}"
        alt="${escapeHtml(prop.title)}"
        class="details-hero-img"
        onerror="this.onerror=null; this.src='assets/images/duplex.jpg';"
      >
      <div class="details-hero-overlay">
        <div class="details-badges-row">
          <span class="badge ${badgeListingClass}">${escapeHtml(prop.listingType)}</span>
          <span class="badge ${badgeAvailClass}">${escapeHtml(prop.availability)}</span>
          <span class="badge" style="background: rgba(15,23,42,0.85); color: #fff;">${escapeHtml(prop.type)}</span>
        </div>
      </div>
    </div>

    <div class="details-content-inner">
      <div class="details-header-row">
        <div class="details-title-col">
          <h2 class="details-title" id="details-title">${escapeHtml(prop.title)}</h2>
          <p class="details-location">
            <svg class="location-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${escapeHtml(prop.location)}</span>
          </p>
        </div>

        <div class="details-price-col">
          <div class="details-price">${formattedPrice}${rentPeriod}</div>
          <span class="details-price-period">${prop.listingType === 'For Rent' ? 'Annual Rent' : 'Purchase Price'}</span>
        </div>
      </div>

      <!-- Specs Grid -->
      <div class="details-specs-grid">
        <div class="spec-box">
          <svg class="spec-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 4v16"></path>
            <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
            <path d="M2 17h20"></path>
            <path d="M6 8v9"></path>
          </svg>
          <span class="spec-value">${escapeHtml(prop.bedrooms)}</span>
          <span class="spec-title">Bedrooms</span>
        </div>

        <div class="spec-box">
          <svg class="spec-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 6h6"></path>
            <path d="M10 3v3"></path>
            <path d="M14 3v3"></path>
            <rect x="3" y="11" width="18" height="9" rx="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span class="spec-value">${escapeHtml(prop.bathrooms)}</span>
          <span class="spec-title">Bathrooms</span>
        </div>

        <div class="spec-box">
          <svg class="spec-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          <span class="spec-value">${escapeHtml(prop.type)}</span>
          <span class="spec-title">Property Type</span>
        </div>

        <div class="spec-box">
          <svg class="spec-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span class="spec-value">${escapeHtml(prop.availability)}</span>
          <span class="spec-title">Status</span>
        </div>
      </div>

      <!-- Description Block -->
      <div class="details-desc-block">
        <h3 class="details-section-title">Property Description</h3>
        <p class="details-desc-text">${escapeHtml(prop.description)}</p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="details-actions-bar">
        <button type="button" class="btn btn-secondary" id="details-edit-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Edit Listing</span>
        </button>
        <button type="button" class="btn btn-outline" id="details-delete-btn" style="color: var(--danger); border-color: var(--danger-light);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Delete</span>
        </button>
        <button type="button" class="btn btn-primary" id="details-close-btn">
          <span>Close</span>
        </button>
      </div>
    </div>
  `;

  // Attach event handlers inside details modal
  document.getElementById('details-edit-btn').addEventListener('click', () => {
    closeDetailsModal();
    openPropertyModal('edit', prop.id);
  });

  document.getElementById('details-delete-btn').addEventListener('click', () => {
    closeDetailsModal();
    openDeleteModal(prop.id);
  });

  document.getElementById('details-close-btn').addEventListener('click', closeDetailsModal);

  detailsModal.showModal();
}

function closeDetailsModal() {
  detailsModal.close();
}

// ==========================================================================
// ADD & EDIT PROPERTY MODAL FORM
// ==========================================================================
function openPropertyModal(mode = 'add', propertyId = null) {
  resetFormErrors();
  propertyForm.reset();
  removeUploadedImage();

  if (mode === 'edit' && propertyId) {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;

    propertyModalTitle.textContent = 'Edit Property Listing';
    saveBtnText.textContent = 'Update Property';

    formPropertyId.value = prop.id;
    formTitle.value = prop.title || '';
    formPropertyType.value = prop.type || '';
    formListingType.value = prop.listingType || '';
    formBedrooms.value = String(prop.bedrooms) || '';
    formBathrooms.value = prop.bathrooms || '';
    formLocation.value = prop.location || '';
    formPrice.value = prop.price || '';
    formDescription.value = prop.description || '';

    // Availability radio
    const availRadio = propertyForm.querySelector(`input[name="form-availability"][value="${prop.availability}"]`);
    if (availRadio) availRadio.checked = true;

    // Image
    if (prop.image) {
      currentUploadedImageBase64 = prop.image;
      formImagePreview.src = prop.image;
      uploadDropzone.classList.add('hidden');
      imagePreviewContainer.classList.remove('hidden');
    }
  } else {
    // Mode 'add'
    propertyModalTitle.textContent = 'Add New Property';
    saveBtnText.textContent = 'Save Property';
    formPropertyId.value = '';
    // Default to 'Available'
    const availRadio = propertyForm.querySelector('input[name="form-availability"][value="Available"]');
    if (availRadio) availRadio.checked = true;
  }

  propertyModal.showModal();
}

function closePropertyModal() {
  propertyModal.close();
  resetFormErrors();
}

/**
 * Validates and handles Property form submit (Add or Edit)
 */
function handleFormSubmit(e) {
  e.preventDefault();
  resetFormErrors();

  const titleVal = formTitle.value.trim();
  const typeVal = formPropertyType.value;
  const listingTypeVal = formListingType.value;
  const bedroomsVal = formBedrooms.value;
  const bathroomsVal = formBathrooms.value.trim();
  const locationVal = formLocation.value.trim();
  const priceVal = formPrice.value.trim();
  const descVal = formDescription.value.trim();
  const availRadio = propertyForm.querySelector('input[name="form-availability"]:checked');
  const availabilityVal = availRadio ? availRadio.value : 'Available';
  const imageVal = currentUploadedImageBase64.trim();

  let hasError = false;

  // 1. Title validation
  if (!titleVal) {
    showError('title', 'Property title is required');
    hasError = true;
  } else if (titleVal.length < 5) {
    showError('title', 'Title should be at least 5 characters');
    hasError = true;
  }

  // 2. Property Type validation
  if (!typeVal) {
    showError('property-type', 'Please select a property type');
    hasError = true;
  }

  // 3. Listing Type validation
  if (!listingTypeVal) {
    showError('listing-type', 'Please select a listing type (For Rent or For Sale)');
    hasError = true;
  }

  // 4. Bedrooms validation
  if (!bedroomsVal) {
    showError('bedrooms', 'Please select number of bedrooms');
    hasError = true;
  }

  // 5. Bathrooms validation
  if (!bathroomsVal || parseInt(bathroomsVal, 10) < 1) {
    showError('bathrooms', 'Number of bathrooms must be at least 1');
    hasError = true;
  }

  // 6. Location validation
  if (!locationVal) {
    showError('location', 'Location (City or Area) is required');
    hasError = true;
  }

  // 7. Price validation
  if (!priceVal || parseFloat(priceVal) <= 0) {
    showError('price', 'Please enter a valid price in Nigerian Naira (₦)');
    hasError = true;
  }

  // 8. Image validation
  if (!imageVal) {
    showError('image', 'Please upload a property photo or select a sample photo');
    hasError = true;
  }

  // 9. Description validation
  if (!descVal) {
    showError('description', 'Property description is required');
    hasError = true;
  } else if (descVal.length < 15) {
    showError('description', 'Please provide a more detailed description (min 15 characters)');
    hasError = true;
  }

  if (hasError) return;

  const existingId = formPropertyId.value;

  if (existingId) {
    // EDIT EXISTING
    const index = properties.findIndex(p => p.id === existingId);
    if (index !== -1) {
      properties[index] = {
        ...properties[index],
        title: titleVal,
        type: typeVal,
        listingType: listingTypeVal,
        bedrooms: bedroomsVal,
        bathrooms: parseInt(bathroomsVal, 10),
        location: locationVal,
        price: parseFloat(priceVal),
        description: descVal,
        image: imageVal,
        availability: availabilityVal,
        updatedAt: Date.now()
      };

      const saved = savePropertiesToStorage();
      if (saved) {
        closePropertyModal();
        renderApp();
        showToast('Property updated successfully!', 'success');
      }
    }
  } else {
    // ADD NEW
    const newProperty = {
      id: generatePropertyId(),
      title: titleVal,
      type: typeVal,
      listingType: listingTypeVal,
      bedrooms: bedroomsVal,
      bathrooms: parseInt(bathroomsVal, 10),
      location: locationVal,
      price: parseFloat(priceVal),
      description: descVal,
      image: imageVal,
      availability: availabilityVal,
      createdAt: Date.now()
    };

    properties.unshift(newProperty);
    const saved = savePropertiesToStorage();
    if (saved) {
      closePropertyModal();
      renderApp();
      showToast('Property added successfully!', 'success');
    }
  }
}

// Form validation helpers
function showError(fieldId, message) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = message;
  }
  const inputEl = document.getElementById(`form-${fieldId}`);
  if (inputEl) {
    inputEl.classList.add('has-error');
  }
}

function clearError(fieldId) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = '';
  }
  const inputEl = document.getElementById(`form-${fieldId}`);
  if (inputEl) {
    inputEl.classList.remove('has-error');
  }
}

function resetFormErrors() {
  document.querySelectorAll('.error-hint').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-control').forEach(el => el.classList.remove('has-error'));
}

// ==========================================================================
// DELETE PROPERTY (With confirmation requirement)
// ==========================================================================
function openDeleteModal(id) {
  const prop = properties.find(p => p.id === id);
  if (!prop) return;

  propertyToDeleteId = id;
  deletePropertyName.textContent = prop.title;
  deleteModal.showModal();
}

function closeDeleteModal() {
  deleteModal.close();
  propertyToDeleteId = null;
}

function handleConfirmDelete() {
  if (!propertyToDeleteId) return;

  const deletedIndex = properties.findIndex(p => p.id === propertyToDeleteId);
  if (deletedIndex !== -1) {
    const deletedProperty = properties[deletedIndex];
    properties.splice(deletedIndex, 1);
    if (!savePropertiesToStorage()) {
      properties.splice(deletedIndex, 0, deletedProperty);
      return;
    }
    closeDeleteModal();
    renderApp();
    btnOpenAddModal.focus();
    showToast('Listing deleted', 'success', {
      detail: deletedProperty.title,
      duration: 8000,
      action: 'Undo',
      onAction: () => {
        properties.splice(Math.min(deletedIndex, properties.length), 0, deletedProperty);
        if (!savePropertiesToStorage()) {
          properties = properties.filter(p => p.id !== deletedProperty.id);
          return;
        }
        renderApp();
        showToast('Listing restored', 'success');
      }
    });
  }
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================
/**
 * Generates a unique property ID
 */
function generatePropertyId() {
  return `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Formats a number to Nigerian Naira currency format (e.g. ₦45,000,000)
 */
function formatNairaPrice(amount) {
  const num = Number(amount) || 0;
  return '₦' + num.toLocaleString('en-NG');
}

/**
 * Escapes HTML characters to prevent XSS injection
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Shows a toast message with automatic slide-out
 */
function showToast(message, type = 'info', options = {}) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = document.createElement('span');
  icon.className = 'toast-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = type === 'success' ? '✓' : type === 'error' ? '!' : 'i';
  const content = document.createElement('div');
  content.className = 'toast-copy';
  const title = document.createElement('p');
  title.className = 'toast-title';
  title.textContent = message;
  content.appendChild(title);
  if (options.detail) {
    const detail = document.createElement('p');
    detail.className = 'toast-detail';
    detail.textContent = options.detail;
    content.appendChild(detail);
  }
  toast.append(icon, content);
  let timer;
  let removed = false;
  const dismiss = () => {
    if (removed) return;
    removed = true;
    clearTimeout(timer);
    if (toast.contains(document.activeElement)) btnOpenAddModal.focus();
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.remove(), 240);
    document.removeEventListener('visibilitychange', onVisibility);
  };
  const resume = () => {
    clearTimeout(timer);
    if (!removed && !document.hidden && !toast.matches(':hover') && !toast.contains(document.activeElement)) {
      timer = setTimeout(dismiss, options.duration || 5000);
    }
  };
  const onVisibility = () => document.hidden ? clearTimeout(timer) : resume();
  if (options.action) {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'toast-action';
    action.textContent = options.action;
    action.addEventListener('click', () => { dismiss(); options.onAction(); });
    toast.appendChild(action);
  }
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast-dismiss';
  close.setAttribute('aria-label', 'Dismiss notification');
  close.textContent = '×';
  close.addEventListener('click', dismiss);
  toast.appendChild(close);
  toast.addEventListener('pointerenter', () => clearTimeout(timer));
  toast.addEventListener('pointerleave', resume);
  toast.addEventListener('focusin', () => clearTimeout(timer));
  toast.addEventListener('focusout', () => setTimeout(resume, 0));
  document.addEventListener('visibilitychange', onVisibility);
  toastContainer.appendChild(toast);
  resume();
}

// Keyboard interactions stay immediate; pointer-opened dialogs retain their entrance.
document.addEventListener('keydown', () => { document.documentElement.dataset.input = 'keyboard'; }, true);
document.addEventListener('pointerdown', () => { document.documentElement.dataset.input = 'pointer'; }, true);
