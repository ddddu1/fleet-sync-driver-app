// ===== APP INITIALIZATION =====

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('FleetSync Driver App initialized');
    
    // Check if we're on login page or app pages
    if (document.body.classList.contains('login-page')) {
        initLoginPage();
    } else {
        initAppPages();
    }
    
    // Initialize common components
    initCommonComponents();
    
    // Simulate app loading
    simulateAppLoading();
});

// ===== LOGIN PAGE FUNCTIONS =====
function initLoginPage() {
    console.log('Initializing login page');
    
    // Show splash screen for 2 seconds, then login form
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
        
        // Initialize login form interactions
        initLoginForm();
    }, 2000);
}

function initLoginForm() {
    const loginBtn = document.getElementById('loginBtn');
    const showPasswordBtn = document.querySelector('.show-password');
    const passwordInput = document.getElementById('password');
    
    // Toggle password visibility
    if (showPasswordBtn && passwordInput) {
        showPasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Handle login
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const driverId = document.getElementById('driverId').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            this.disabled = true;
            
            // Validate inputs
            if (!driverId || !password) {
                showToast('Please enter driver ID and password', 'error');
                this.innerHTML = originalText;
                this.disabled = false;
                return;
            }
            
            // Simulate API call
            setTimeout(() => {
                // Success
                showToast('Login successful! Redirecting to dashboard...', 'success');
                
                // Store login state
                if (rememberMe) {
                    localStorage.setItem('fleetSyncRememberMe', 'true');
                    localStorage.setItem('fleetSyncDriverId', driverId);
                }
                
                localStorage.setItem('fleetSyncLoggedIn', 'true');
                localStorage.setItem('fleetSyncDriverName', 'Ahmed Hassan');
                localStorage.setItem('fleetSyncDriverId', 'DRV-245');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'app-dashboard.html';
                }, 1500);
                
            }, 1500);
        });
        
        // Auto-fill demo credentials
        document.getElementById('driverId').value = 'DRV-245';
        document.getElementById('password').value = 'demo123';
        document.getElementById('rememberMe').checked = true;
    }
}

// ===== APP PAGES FUNCTIONS =====
function initAppPages() {
    console.log('Initializing app pages');
    
    // Check if user is logged in
    if (!localStorage.getItem('fleetSyncLoggedIn')) {
        window.location.href = 'app-index.html';
        return;
    }
    
    // Initialize navigation
    initNavigation();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'app-dashboard.html':
            initDashboard();
            break;
        case 'app-trips.html':
            initTripsPage();
            break;
        case 'app-vehicle.html':
            initVehiclePage();
            break;
        case 'app-profile.html':
            initProfilePage();
            break;
    }
    
    // Update user info in sidebar
    updateUserInfo();
    
    // Initialize real-time data simulation
    initRealTimeData();
}

function initNavigation() {
    // Menu button
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    
    if (menuBtn && sideMenu) {
        menuBtn.addEventListener('click', function() {
            sideMenu.classList.add('show');
        });
    }
    
    if (closeMenu && sideMenu) {
        closeMenu.addEventListener('click', function() {
            sideMenu.classList.remove('show');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (sideMenu && sideMenu.classList.contains('show') && 
            !sideMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            sideMenu.classList.remove('show');
        }
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('fleetSyncLoggedIn');
                window.location.href = 'app-index.html';
            }
        });
    }
    
    // Bottom navigation active state
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updateUserInfo() {
    const driverName = localStorage.getItem('fleetSyncDriverName') || 'Driver';
    const driverId = localStorage.getItem('fleetSyncDriverId') || 'DRV-000';
    
    // Update sidebar if exists
    const driverNameElements = document.querySelectorAll('.driver-details h3, .driver-info h3');
    const driverIdElements = document.querySelectorAll('.driver-details p, .nav-subtitle');
    
    driverNameElements.forEach(el => {
        if (el.textContent.includes('Driver')) {
            el.textContent = driverName;
        }
    });
    
    driverIdElements.forEach(el => {
        if (el.textContent.includes('DRV-')) {
            el.textContent = el.textContent.replace(/DRV-\d+/, driverId);
        }
    });
    
    // Update avatar initials
    const avatarElements = document.querySelectorAll('.driver-avatar, .user-avatar-small');
    avatarElements.forEach(avatar => {
        const initials = driverName.split(' ').map(n => n[0]).join('').toUpperCase();
        if (!avatar.querySelector('img')) {
            avatar.textContent = initials;
        }
    });
}

// ===== DASHBOARD PAGE =====
function initDashboard() {
    console.log('Initializing dashboard');
    
    // Update current time
    updateCurrentTime();
    
    // Initialize trip progress animation
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        // Animate progress bar
        setTimeout(() => {
            progressFill.style.width = '65%';
        }, 500);
    }
    
    // Start trip button
    const startTripBtn = document.querySelector('.trip-actions .btn-primary');
    if (startTripBtn) {
        startTripBtn.addEventListener('click', function() {
            showToast('Starting navigation to destination...', 'success');
            
            // Simulate navigation start
            setTimeout(() => {
                const tripStatus = document.querySelector('.trip-status.active');
                if (tripStatus) {
                    tripStatus.textContent = 'Navigating';
                    tripStatus.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
                }
            }, 1000);
        });
    }
    
    // Sync now button
    const syncBtn = document.querySelector('.status-actions .btn');
    if (syncBtn) {
        syncBtn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                showToast('Data synced successfully!', 'success');
                
                // Update last sync time
                const lastUpdate = document.querySelector('.status-info p');
                if (lastUpdate) {
                    lastUpdate.textContent = 'Data syncing every 10 seconds • Last update: Just now';
                }
            }, 1500);
        });
    }
    
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            
            switch(action) {
                case 'Start Trip':
                    window.location.href = 'app-trips.html';
                    break;
                case 'Log Fuel':
                    showToast('Opening fuel logging form...', 'info');
                    break;
                case 'Report Issue':
                    window.location.href = 'app-vehicle.html';
                    break;
                case 'Live Map':
                    showToast('Opening live map view...', 'info');
                    break;
            }
        });
    });
    
    // Simulate live data updates
    setInterval(() => {
        updateLiveStats();
    }, 5000);
}

function updateCurrentTime() {
    const timeElements = document.querySelectorAll('.location-time, .nav-subtitle');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    timeElements.forEach(el => {
        if (el.textContent.includes('ETA') || el.textContent.includes('Last update')) {
            // Update ETA times
            const hours = now.getHours();
            const minutes = now.getMinutes() + 30;
            const etaHours = minutes >= 60 ? hours + 1 : hours;
            const etaMinutes = minutes % 60;
            const etaString = `${etaHours}:${etaMinutes.toString().padStart(2, '0')} ${etaHours >= 12 ? 'PM' : 'AM'}`;
            
            if (el.textContent.includes('ETA')) {
                el.textContent = el.textContent.replace(/\d{1,2}:\d{2} [AP]M/, etaString);
            }
        }
    });
}

function updateLiveStats() {
    // Update speed (random between 60-75 km/h)
    const speedElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (speedElement) {
        const currentSpeed = parseInt(speedElement.textContent);
        const newSpeed = Math.max(60, Math.min(75, currentSpeed + (Math.random() > 0.5 ? 1 : -1)));
        speedElement.textContent = newSpeed;
    }
    
    // Update fuel (decrease slowly)
    const fuelElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (fuelElement) {
        const currentFuel = parseInt(fuelElement.textContent);
        if (currentFuel > 20) {
            const newFuel = currentFuel - 0.1;
            fuelElement.textContent = newFuel.toFixed(1);
            
            // Update fuel range
            const rangeElement = document.querySelector('.stat-card:nth-child(2) .stat-subtext');
            if (rangeElement) {
                const range = Math.floor(newFuel * 3.57); // ~3.57 km per 1% fuel
                rangeElement.textContent = `~${range} km range`;
            }
        }
    }
    
    // Update trip progress (if trip is active)
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-info span:first-child');
    const distanceText = document.querySelector('.progress-info span:last-child');
    
    if (progressFill && progressText && distanceText) {
        const currentWidth = parseFloat(progressFill.style.width);
        if (currentWidth < 100) {
            const newWidth = Math.min(100, currentWidth + 0.5);
            progressFill.style.width = `${newWidth}%`;
            progressText.textContent = `${Math.round(newWidth)}% Complete`;
            
            // Update distance
            const currentDist = parseFloat(distanceText.textContent.split(' / ')[0]);
            const totalDist = 42;
            const newDist = Math.min(totalDist, currentDist + 0.3);
            distanceText.textContent = `${newDist.toFixed(1)} km / ${totalDist} km`;
        }
    }
}

// ===== TRIPS PAGE =====
function initTripsPage() {
    console.log('Initializing trips page');
    
    // Start trip button
    const startTripBtn = document.querySelector('.trip-action-btn.primary');
    if (startTripBtn) {
        startTripBtn.addEventListener('click', function() {
            showToast('Starting new trip... Opening route selection', 'info');
            
            // Change button state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Simulate trip start
                const nextTrip = document.querySelector('.current-trip-card');
                if (nextTrip) {
                    nextTrip.querySelector('.trip-status').textContent = 'Starting Soon';
                    nextTrip.querySelector('.trip-status').style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
                    nextTrip.querySelector('.trip-status').style.color = 'var(--primary)';
                }
            }, 2000);
        });
    }
    
    // Route selection buttons
    const routeSelectBtns = document.querySelectorAll('.route-option .btn');
    routeSelectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const routeCard = this.closest('.route-option');
            const routeName = routeCard.querySelector('h4').textContent;
            
            if (this.textContent.includes('Select')) {
                showToast(`Selected route: ${routeName}`, 'success');
                
                // Highlight selected route
                document.querySelectorAll('.route-option').forEach(opt => {
                    opt.style.borderColor = 'var(--border)';
                });
                routeCard.style.borderColor = 'var(--success)';
                routeCard.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
            } else {
                showToast(`Previewing ${routeName}...`, 'info');
            }
        });
    });
    
    // Filter and calendar buttons
    const filterBtn = document.querySelector('.nav-btn:nth-child(1)');
    const calendarBtn = document.querySelector('.nav-btn:nth-child(2)');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            showToast('Opening trip filters...', 'info');
        });
    }
    
    if (calendarBtn) {
        calendarBtn.addEventListener('click', function() {
            showToast('Opening calendar view...', 'info');
        });
    }
    
    // Trip item clicks
    const tripItems = document.querySelectorAll('.trip-item');
    tripItems.forEach(item => {
        item.addEventListener('click', function() {
            const tripId = this.querySelector('h4').textContent;
            showToast(`Opening details for ${tripId}`, 'info');
        });
    });
    
    // Simulate trip status updates
    setInterval(() => {
        updateTripStatuses();
    }, 10000);
}

function updateTripStatuses() {
    // Update in-progress trip
    const inProgressTrip = document.querySelector('.trip-item.in-progress');
    if (inProgressTrip) {
        const timeElement = inProgressTrip.querySelector('.time');
        const metaElements = inProgressTrip.querySelectorAll('.trip-meta span');
        
        // Update time
        const now = new Date();
        const startTime = new Date();
        startTime.setHours(11, 30, 0);
        
        const elapsedMs = now - startTime;
        const elapsedMins = Math.floor(elapsedMs / 60000);
        
        if (elapsedMins < 102) { // Trip duration is 1h 42m = 102 min
            const remainingMins = 102 - elapsedMins;
            const endTime = new Date(startTime.getTime() + 102 * 60000);
            
            if (timeElement) {
                const endTimeStr = endTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                });
                timeElement.textContent = `11:30 - ${endTimeStr}`;
            }
            
            // Update elapsed time in meta
            if (metaElements.length >= 2) {
                metaElements[1].innerHTML = `<i class="fas fa-clock"></i> ${elapsedMins}m`;
            }
            
            // Update score based on driving time (simulated)
            if (metaElements.length >= 3) {
                const baseScore = 92;
                const scoreVariation = Math.sin(elapsedMins / 10) * 3; // Oscillating score
                const currentScore = Math.round(baseScore + scoreVariation);
                metaElements[2].innerHTML = `<i class="fas fa-star"></i> ${currentScore} score (live)`;
            }
        } else {
            // Trip completed
            inProgressTrip.classList.remove('in-progress');
            inProgressTrip.classList.add('completed');
            
            const statusBadge = inProgressTrip.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = 'Completed';
                statusBadge.className = 'status-badge completed';
            }
            
            const tripIcon = inProgressTrip.querySelector('.trip-icon');
            if (tripIcon) {
                tripIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                tripIcon.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                tripIcon.style.color = 'var(--success)';
            }
        }
    }
}

// ===== VEHICLE PAGE =====
function initVehiclePage() {
    console.log('Initializing vehicle page');
    
    // Issue reporting buttons
    const issueCategories = document.querySelectorAll('.issue-category');
    issueCategories.forEach(category => {
        category.addEventListener('click', function() {
            const issueType = this.querySelector('span').textContent;
            showToast(`Reporting ${issueType}... Opening form`, 'info');
            
            // In a real app, this would open a reporting form
            setTimeout(() => {
                showToast(`Issue report for ${issueType} submitted to fleet manager`, 'success');
            }, 1500);
        });
    });
    
    // Emergency call button
    const emergencyBtn = document.querySelector('.btn-emergency');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            if (confirm('Call fleet manager for emergency assistance?')) {
                showToast('Calling fleet manager...', 'info');
                // In a real app, this would initiate a phone call
            }
        });
    }
    
    // Save fuel log button
    const saveFuelBtn = document.querySelector('.fuel-form .btn-primary');
    if (saveFuelBtn) {
        saveFuelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const fuelAmount = document.querySelector('.fuel-form input[type="number"]:nth-child(1)').value;
            const fuelCost = document.querySelector('.fuel-form input[type="number"]:nth-child(2)').value;
            const stationName = document.querySelector('.fuel-form input[type="text"]').value;
            
            if (!fuelAmount || !fuelCost || !stationName) {
                showToast('Please fill all fuel log fields', 'error');
                return;
            }
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                showToast(`Fuel log saved: ${fuelAmount}L at ${stationName} for ${fuelCost} DZD`, 'success');
                
                // Update fuel stats
                const todayUsage = document.querySelector('.fuel-stat:nth-child(1) .stat-value');
                if (todayUsage) {
                    const currentUsage = parseFloat(todayUsage.textContent);
                    todayUsage.textContent = (currentUsage + parseFloat(fuelAmount)).toFixed(1);
                }
                
                // Clear form
                document.querySelector('.fuel-form input[type="number"]:nth-child(1)').value = '';
                document.querySelector('.fuel-form input[type="number"]:nth-child(2)').value = '';
                document.querySelector('.fuel-form input[type="text"]').value = '';
            }, 1500);
        });
    }
    
    // Maintenance schedule buttons
    const scheduleBtns = document.querySelectorAll('.maintenance-actions button');
    scheduleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const maintenanceItem = this.closest('.maintenance-item');
            const maintenanceType = maintenanceItem.querySelector('h4').textContent;
            
            if (this.textContent.includes('Schedule')) {
                showToast(`Scheduling ${maintenanceType}...`, 'info');
                
                // Change button state
                setTimeout(() => {
                    this.textContent = 'Scheduled';
                    this.classList.remove('btn-warning');
                    this.classList.add('btn-outline');
                    
                    // Update maintenance item
                    maintenanceItem.classList.remove('overdue');
                    maintenanceItem.classList.add('scheduled');
                    
                    const icon = maintenanceItem.querySelector('.maintenance-icon');
                    if (icon) {
                        icon.innerHTML = '<i class="fas fa-check-circle"></i>';
                        icon.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                        icon.style.color = 'var(--success)';
                    }
                    
                    showToast(`${maintenanceType} scheduled for next week`, 'success');
                }, 1500);
            }
        });
    });
    
    // Share and history buttons
    const shareBtn = document.querySelector('.nav-btn:nth-child(2)');
    const historyBtn = document.querySelector('.nav-btn:nth-child(1)');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            showToast('Sharing vehicle status...', 'info');
        });
    }
    
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            showToast('Opening vehicle history...', 'info');
        });
    }
    
    // Simulate vehicle diagnostics updates
    setInterval(() => {
        updateVehicleDiagnostics();
    }, 8000);
}

function updateVehicleDiagnostics() {
    // Update fuel level (decrease slowly)
    const fuelDiag = document.querySelector('.diagnostic-item:nth-child(1)');
    if (fuelDiag) {
        const fuelText = fuelDiag.querySelector('p');
        const fuelBar = fuelDiag.querySelector('.status-fill');
        
        if (fuelText && fuelBar) {
            const currentFuel = parseFloat(fuelText.textContent);
            if (currentFuel > 15) {
                const newFuel = currentFuel - 0.2;
                fuelText.textContent = `${newFuel.toFixed(1)}% remaining`;
                fuelBar.style.width = `${newFuel}%`;
                
                // Update warning status if fuel is low
                if (newFuel < 20) {
                    fuelDiag.querySelector('.diag-status').classList.add('warning');
                    fuelDiag.querySelector('.diag-status span').textContent = 'Low';
                    fuelBar.style.backgroundColor = 'var(--warning)';
                }
            }
        }
    }
    
    // Update engine temperature (fluctuate)
    const engineDiag = document.querySelector('.diagnostic-item:nth-child(2)');
    if (engineDiag) {
        const engineText = engineDiag.querySelector('p');
        if (engineText) {
            const currentTemp = parseInt(engineText.textContent);
            const newTemp = Math.max(85, Math.min(95, currentTemp + (Math.random() > 0.5 ? 1 : -1)));
            const newRPM = Math.floor(2850 + Math.random() * 200 - 100);
            engineText.textContent = `${newTemp}°C • ${newRPM} RPM`;
            
            // Update status bar (normalized to 70-100%)
            const tempPercent = ((newTemp - 80) / 20) * 100;
            const bar = engineDiag.querySelector('.status-fill');
            if (bar) {
                bar.style.width = `${Math.min(100, Math.max(70, tempPercent))}%`;
            }
        }
    }
    
    // Update battery (slow decrease)
    const batteryDiag = document.querySelector('.diagnostic-item:nth-child(3)');
    if (batteryDiag) {
        const batteryText = batteryDiag.querySelector('p');
        const batteryBar = batteryDiag.querySelector('.status-fill');
        
        if (batteryText && batteryBar) {
            const batteryMatch = batteryText.textContent.match(/(\d+)%/);
            if (batteryMatch) {
                let batteryPercent = parseInt(batteryMatch[1]);
                if (batteryPercent > 60) {
                    batteryPercent -= 0.1;
                    batteryText.textContent = batteryText.textContent.replace(/\d+%/, `${batteryPercent.toFixed(1)}%`);
                    batteryBar.style.width = `${batteryPercent}%`;
                    
                    // Update voltage based on charge
                    const voltage = 11.8 + (batteryPercent / 100) * 1.4;
                    batteryText.textContent = `${voltage.toFixed(1)}V • ${batteryPercent.toFixed(1)}% charge`;
                }
            }
        }
    }
}

// ===== PROFILE PAGE =====
function initProfilePage() {
    console.log('Initializing profile page');
    
    // Toggle switches
    const switches = document.querySelectorAll('.switch input');
    switches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h4').textContent;
            const isEnabled = this.checked;
            
            showToast(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
            
            // Special handling for dark mode
            if (settingName === 'Dark Mode' && isEnabled) {
                showToast('Dark mode will be applied after app restart', 'info');
            }
        });
    });
    
    // Account actions
    const accountActions = document.querySelectorAll('.account-action');
    accountActions.forEach(action => {
        action.addEventListener('click', function() {
            const actionName = this.querySelector('h4').textContent;
            
            switch(actionName) {
                case 'Change Password':
                    showToast('Opening password change form...', 'info');
                    break;
                case 'Login Activity':
                    showToast('Loading login history...', 'info');
                    break;
                case 'Switch Company':
                    if (confirm('Are you sure you want to switch companies? This will reset your current trips.')) {
                        showToast('Initiating company transfer...', 'info');
                    }
                    break;
                case 'Sign Out':
                    if (confirm('Sign out from all devices?')) {
                        localStorage.removeItem('fleetSyncLoggedIn');
                        showToast('Signing out...', 'info');
                        setTimeout(() => {
                            window.location.href = 'app-index.html';
                        }, 1000);
                    }
                    break;
            }
        });
    });
    
    // Privacy options
    const privacyOptions = document.querySelectorAll('.privacy-option');
    privacyOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionName = this.querySelector('h4').textContent;
            showToast(`Opening ${optionName.toLowerCase()}...`, 'info');
        });
    });
    
    // Support options
    const supportOptions = document.querySelectorAll('.support-option');
    supportOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionName = this.querySelector('span').textContent;
            
            switch(optionName) {
                case 'Contact Support':
                    showToast('Opening support contact form...', 'info');
                    break;
                case 'Rate the App':
                    showToast('Redirecting to app store...', 'info');
                    break;
                case 'Share App':
                    if (navigator.share) {
                        navigator.share({
                            title: 'FleetSync Driver App',
                            text: 'Check out the FleetSync Driver app for fleet management!',
                            url: window.location.href
                        });
                    } else {
                        showToast('App sharing not supported on this device', 'info');
                    }
                    break;
                default:
                    showToast(`Opening ${optionName.toLowerCase()}...`, 'info');
            }
        });
    });
    
    // Edit profile button
    const editProfileBtn = document.querySelector('.nav-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            showToast('Opening profile editor...', 'info');
        });
    }
    
    // Performance report button
    const performanceBtn = document.querySelector('.profile-actions .btn-primary');
    if (performanceBtn) {
        performanceBtn.addEventListener('click', function() {
            showToast('Generating performance report...', 'info');
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                showToast('Performance report ready! Opening PDF...', 'success');
            }, 2000);
        });
    }
}

// ===== COMMON COMPONENTS =====
function initCommonComponents() {
    // Initialize toast notifications
    window.showToast = function(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .notification-toast {
                    position: fixed;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    background-color: var(--dark);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    max-width: 90%;
                    z-index: 1000;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease;
                    font-size: 0.95rem;
                }
                
                .notification-toast.success {
                    background-color: var(--success);
                }
                
                .notification-toast.error {
                    background-color: var(--error);
                }
                
                .notification-toast.warning {
                    background-color: var(--warning);
                }
                
                .notification-toast.info {
                    background-color: var(--info);
                }
                
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-grow: 1;
                }
                
                .toast-content i {
                    font-size: 1.2rem;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .toast-close:hover {
                    color: white;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.transform = 'translateX(-50%) translateY(100px)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 4000);
    };
    
    // Add back button functionality
    const backBtn = document.querySelector('#menuBtn .fa-arrow-left');
    if (backBtn && !document.body.classList.contains('login-page')) {
        backBtn.closest('.nav-btn').addEventListener('click', function() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'app-dashboard.html';
            }
        });
    }
}

// ===== SIMULATION FUNCTIONS =====
function simulateAppLoading() {
    // Simulate network requests
    if (navigator.onLine) {
        // Update connection status
        const connectionBar = document.querySelector('.connection-bar');
        if (connectionBar) {
            // Simulate connection strength changes
            setInterval(() => {
                const bars = connectionBar.querySelectorAll('.bar');
                bars.forEach((bar, i) => {
                    const active = Math.random() > 0.3;
                    bar.style.backgroundColor = active ? 'white' : 'rgba(255, 255, 255, 0.5)';
                });
            }, 3000);
        }
    }
    
    // Simulate background data sync
    if (localStorage.getItem('fleetSyncLoggedIn')) {
        setInterval(() => {
            // Update "last sync" times
            const lastSyncElements = document.querySelectorAll('.last-update, .status-info p');
            lastSyncElements.forEach(el => {
                if (el.textContent.includes('Last update') || el.textContent.includes('Updated:')) {
                    const minutes = Math.floor(Math.random() * 3);
                    const text = minutes === 0 ? 'Just now' : `${minutes} min ago`;
                    el.textContent = el.textContent.replace(/(Last update|Updated:).*/, `$1 ${text}`);
                }
            });
        }, 30000); // Every 30 seconds
    }
}

function initRealTimeData() {
    // Only run if user is logged in
    if (!localStorage.getItem('fleetSyncLoggedIn')) return;
    
    // Simulate GPS position updates
    setInterval(() => {
        // Update GPS status if on dashboard
        const gpsStatus = document.querySelector('.status-info p');
        if (gpsStatus && gpsStatus.textContent.includes('Last update')) {
            const seconds = Math.floor(Math.random() * 30);
            const text = seconds < 10 ? 'Just now' : `${seconds} sec ago`;
            gpsStatus.textContent = gpsStatus.textContent.replace(/Last update:.*/, `Last update: ${text}`);
        }
    }, 5000);
    
    // Simulate notification updates
    setInterval(() => {
        const notificationBadge = document.querySelector('.notification-btn .badge');
        if (notificationBadge) {
            const currentCount = parseInt(notificationBadge.textContent);
            if (currentCount < 5 && Math.random() > 0.7) {
                notificationBadge.textContent = currentCount + 1;
                notificationBadge.style.animation = 'none';
                setTimeout(() => {
                    notificationBadge.style.animation = 'pulse 0.5s';
                }, 10);
            }
        }
    }, 15000);
}

// ===== PWA SUPPORT =====
// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
                console.log('ServiceWorker registration successful');
            },
            function(err) {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}

// Handle offline/online status
window.addEventListener('online', function() {
    showToast('Back online. Syncing data...', 'success');
    
    const connectionBar = document.querySelector('.connection-bar');
    if (connectionBar) {
        connectionBar.classList.add('connected');
        connectionBar.innerHTML = '<i class="fas fa-wifi"></i> <span>Connected • 4G • Syncing data...</span>';
    }
});

window.addEventListener('offline', function() {
    showToast('You are offline. Data will sync when connection returns.', 'warning');
    
    const connectionBar = document.querySelector('.connection-bar');
    if (connectionBar) {
        connectionBar.classList.remove('connected');
        connectionBar.innerHTML = '<i class="fas fa-wifi-slash"></i> <span>Offline • Data will sync when back online</span>';
    }
});

// Prevent pull-to-refresh on mobile
let touchStartY = 0;
document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', function(e) {
    const touchY = e.touches[0].clientY;
    const scrolledToTop = window.scrollY === 0;
    const pulledDown = touchY - touchStartY > 50;
    
    if (scrolledToTop && pulledDown) {
        e.preventDefault();
    }
}, { passive: false });