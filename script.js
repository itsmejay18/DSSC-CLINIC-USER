class DSCCClinicDashboard {
    constructor() {
        this.currentSection = 'profile';
        this.appointments = [];
        this.profile = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStoredData();
        this.setMinDate();
        this.populateHistoryData();
        this.checkUpcomingAppointments();
        this.updateHeaderUser();
    }

    setupEventListeners() {
        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        menuToggle?.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay?.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Navigation menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
                
                // Close mobile menu
                if (window.innerWidth <= 1024) {
                    menuToggle.classList.remove('active');
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            });
        });

        // Profile picture upload
        this.setupProfilePictureUpload();

        // Profile form
        const profileForm = document.getElementById('profileForm');
        profileForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Appointment form
        const appointmentForm = document.getElementById('appointmentForm');
        appointmentForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.bookAppointment();
        });

        // Notification close
        const closeNotification = document.getElementById('closeNotification');
        closeNotification?.addEventListener('click', () => {
            document.getElementById('notificationBanner').classList.remove('show');
        });

        // Responsive table/card switching
        window.addEventListener('resize', () => {
            this.handleResponsiveDisplay();
        });

        // Initial responsive check
        this.handleResponsiveDisplay();
    }

    setupProfilePictureUpload() {
        const uploadBtn = document.getElementById('uploadProfilePicture');
        const removeBtn = document.getElementById('removeProfilePicture');
        const fileInput = document.getElementById('profilePictureInput');
        const preview = document.querySelector('.profile-picture-preview');
        const img = document.getElementById('profilePictureImg');
        const placeholder = document.getElementById('profilePicturePlaceholder');

        // Upload button click
        uploadBtn?.addEventListener('click', () => {
            fileInput.click();
        });

        // Preview click
        preview?.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file
            const validation = Utils.validateImageFile(file);
            if (!validation.valid) {
                Utils.showMessage(validation.error, 'error');
                return;
            }

            try {
                // Show loading state
                Utils.setLoadingState(preview, true);
                
                // Resize and compress image
                const compressedImage = await Utils.resizeImage(file);
                
                // Update preview
                img.src = compressedImage;
                img.style.display = 'block';
                placeholder.style.display = 'none';
                removeBtn.style.display = 'inline-flex';
                
                // Store in profile data
                this.profile.profilePicture = compressedImage;
                
                Utils.showMessage('Profile picture uploaded successfully!');
            } catch (error) {
                console.error('Error processing image:', error);
                Utils.showMessage('Error processing image. Please try again.', 'error');
            } finally {
                Utils.setLoadingState(preview, false);
            }
        });

        // Remove button click
        removeBtn?.addEventListener('click', () => {
            img.src = '';
            img.style.display = 'none';
            placeholder.style.display = 'flex';
            removeBtn.style.display = 'none';
            fileInput.value = '';
            
            // Remove from profile data
            this.profile.profilePicture = null;
            
            Utils.showMessage('Profile picture removed.');
        });
    }

    showSection(sectionId) {
        // Update active section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId)?.classList.add('active');

        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

        this.currentSection = sectionId;

        // Add animation to the active section
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            Utils.animateElement(activeSection);
        }
    }

    loadStoredData() {
        // Load profile data
        this.profile = Utils.getLocalStorage('dssc_profile', defaultProfile);
        this.populateProfileForm();

        // Load appointments
        this.appointments = Utils.getLocalStorage('dssc_appointments', []);
        this.displayAppointments();
    }

    populateProfileForm() {
        Object.keys(this.profile).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.profile[key];
                } else {
                    element.value = this.profile[key];
                }
            }
        });

        // Handle profile picture
        this.updateProfilePictureDisplay();
    }

    updateProfilePictureDisplay() {
        const img = document.getElementById('profilePictureImg');
        const placeholder = document.getElementById('profilePicturePlaceholder');
        const removeBtn = document.getElementById('removeProfilePicture');

        if (this.profile.profilePicture) {
            img.src = this.profile.profilePicture;
            img.style.display = 'block';
            placeholder.style.display = 'none';
            removeBtn.style.display = 'inline-flex';
        } else {
            img.style.display = 'none';
            placeholder.style.display = 'flex';
            removeBtn.style.display = 'none';
        }
    }

    saveProfile() {
        const form = document.getElementById('profileForm');
        
        if (!Utils.validateForm(form)) {
            Utils.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        const formData = new FormData(form);
        const profile = {};

        // Get text inputs and selects
        ['studentName', 'studentId', 'program', 'department', 'email', 'phone'].forEach(field => {
            profile[field] = formData.get(field);
        });

        // Validate email and phone
        if (!Utils.isValidEmail(profile.email)) {
            Utils.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (!Utils.isValidPhone(profile.phone)) {
            Utils.showMessage('Please enter a valid phone number.', 'error');
            return;
        }

        // Get checkboxes
        ['drugTest', 'bloodTyping', 'cvc'].forEach(field => {
            profile[field] = document.getElementById(field).checked;
        });

        // Save to storage
        if (Utils.setLocalStorage('dssc_profile', profile)) {
            this.profile = profile;
            Utils.showMessage('Profile saved successfully!');
            this.updateHeaderUser();
        } else {
            Utils.showMessage('Error saving profile. Please try again.', 'error');
        }
    }

    setMinDate() {
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            dateInput.min = Utils.getMinDate();
        }
    }

    bookAppointment() {
        const form = document.getElementById('appointmentForm');
        
        if (!Utils.validateForm(form)) {
            Utils.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        const formData = new FormData(form);
        const appointmentData = {
            id: Utils.generateId(),
            type: formData.get('appointmentType'),
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            status: 'Pending',
            booked_at: new Date().toISOString()
        };

        // Validate date is in the future
        if (!Utils.isDateInFuture(appointmentData.date)) {
            Utils.showMessage('Please select a future date.', 'error');
            return;
        }

        // Check for duplicate appointments on the same date and time
        const duplicate = this.appointments.find(apt => 
            apt.date === appointmentData.date && apt.time === appointmentData.time
        );

        if (duplicate) {
            Utils.showMessage('You already have an appointment at this time.', 'error');
            return;
        }

        // Add to appointments array
        this.appointments.push(appointmentData);

        // Save to storage
        if (Utils.setLocalStorage('dssc_appointments', this.appointments)) {
            Utils.showMessage('Appointment booked successfully!');
            form.reset();
            this.displayAppointments();
            this.checkUpcomingAppointments();
        } else {
            Utils.showMessage('Error booking appointment. Please try again.', 'error');
        }
    }

    displayAppointments() {
        const container = document.getElementById('appointmentsList');
        if (!container) return;

        if (this.appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No appointments booked yet.</p>
                    <p style="color: var(--gray-dark); font-size: 0.9rem; margin-top: 5px;">
                        Use the form on the left to book your first appointment.
                    </p>
                </div>
            `;
            return;
        }

        // Sort appointments by date and time
        const sortedAppointments = [...this.appointments].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });

        container.innerHTML = sortedAppointments.map(appointment => `
            <div class="appointment-card slide-in">
                <div class="appointment-header">
                    <div class="appointment-type">${appointment.type}</div>
                    <div class="appointment-status">${appointment.status}</div>
                </div>
                <div class="appointment-details">
                    <div><strong>Date:</strong> ${Utils.formatDate(appointment.date)}</div>
                    <div><strong>Time:</strong> ${Utils.formatTime(appointment.time)}</div>
                    <div style="margin-top: 5px; font-size: 0.85rem; color: var(--gray-dark);">
                        Booked on ${Utils.formatDateShort(appointment.booked_at)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    populateHistoryData() {
        this.populateMedicalHistory();
        this.populateDrugHistory();
    }

    populateMedicalHistory() {
        const tableBody = document.getElementById('medicalHistoryBody');
        const cardsContainer = document.getElementById('medicalHistoryCards');

        if (tableBody) {
            tableBody.innerHTML = sampleMedicalHistory.map(record => `
                <tr>
                    <td>${Utils.formatDateShort(record.date)}</td>
                    <td>${record.service}</td>
                    <td>${record.notes}</td>
                    <td><span class="status-${record.status.toLowerCase()}">${record.status}</span></td>
                </tr>
            `).join('');
        }

        if (cardsContainer) {
            cardsContainer.innerHTML = sampleMedicalHistory.map(record => `
                <div class="history-card">
                    <div class="history-card-header">
                        <div class="history-card-title">${record.service}</div>
                        <div class="history-card-date">${Utils.formatDateShort(record.date)}</div>
                    </div>
                    <div class="history-card-content">
                        <div class="history-card-row">
                            <span class="history-card-label">Notes:</span>
                            <span class="history-card-value">${record.notes}</span>
                        </div>
                        <div class="history-card-row">
                            <span class="history-card-label">Status:</span>
                            <span class="history-card-value">
                                <span class="status-${record.status.toLowerCase()}">${record.status}</span>
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    populateDrugHistory() {
        const tableBody = document.getElementById('drugHistoryBody');
        const cardsContainer = document.getElementById('drugHistoryCards');

        if (tableBody) {
            tableBody.innerHTML = sampleDrugHistory.map(record => `
                <tr>
                    <td><strong>${record.drug_name}</strong><br>
                        <small style="color: var(--gray-dark);">${record.dosage} - ${record.quantity}</small>
                    </td>
                    <td>${record.brand}</td>
                    <td>${record.issued_by}</td>
                    <td>${Utils.formatDateShort(record.date)}</td>
                </tr>
            `).join('');
        }

        if (cardsContainer) {
            cardsContainer.innerHTML = sampleDrugHistory.map(record => `
                <div class="history-card">
                    <div class="history-card-header">
                        <div class="history-card-title">${record.drug_name}</div>
                        <div class="history-card-date">${Utils.formatDateShort(record.date)}</div>
                    </div>
                    <div class="history-card-content">
                        <div class="history-card-row">
                            <span class="history-card-label">Brand:</span>
                            <span class="history-card-value">${record.brand}</span>
                        </div>
                        <div class="history-card-row">
                            <span class="history-card-label">Dosage:</span>
                            <span class="history-card-value">${record.dosage}</span>
                        </div>
                        <div class="history-card-row">
                            <span class="history-card-label">Quantity:</span>
                            <span class="history-card-value">${record.quantity}</span>
                        </div>
                        <div class="history-card-row">
                            <span class="history-card-label">Issued by:</span>
                            <span class="history-card-value">${record.issued_by}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    handleResponsiveDisplay() {
        const isMobile = window.innerWidth <= 768;
        
        // Toggle table/card display for history sections
        const tables = document.querySelectorAll('.table-responsive');
        const cardContainers = document.querySelectorAll('.history-cards');

        tables.forEach(table => {
            table.style.display = isMobile ? 'none' : 'block';
        });

        cardContainers.forEach(container => {
            container.style.display = isMobile ? 'block' : 'none';
        });
    }

    checkUpcomingAppointments() {
        if (this.appointments.length === 0) return;

        const upcomingAppointments = this.appointments.filter(apt => {
            const daysUntil = Utils.getDaysUntil(apt.date);
            return daysUntil >= 0 && daysUntil <= 2; // Show appointments in next 2 days
        });

        if (upcomingAppointments.length > 0) {
            const nextAppointment = upcomingAppointments[0];
            const daysUntil = Utils.getDaysUntil(nextAppointment.date);
            
            let message;
            if (daysUntil === 0) {
                message = `You have an appointment today at ${Utils.formatTime(nextAppointment.time)} - ${nextAppointment.type}`;
            } else if (daysUntil === 1) {
                message = `You have an appointment tomorrow at ${Utils.formatTime(nextAppointment.time)} - ${nextAppointment.type}`;
            } else {
                message = `You have an appointment in ${daysUntil} days at ${Utils.formatTime(nextAppointment.time)} - ${nextAppointment.type}`;
            }

            // Show notification after a slight delay
            setTimeout(() => {
                Utils.showNotification(message, 'success');
            }, 1000);
        }
    }

    updateHeaderUser() {
        const headerUser = document.getElementById('headerUserName');
        if (headerUser && this.profile.studentName) {
            headerUser.textContent = this.profile.studentName;
        }
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DSCCClinicDashboard();
});

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // This would be implemented for offline functionality
        console.log('Service Worker support detected');
    });
}