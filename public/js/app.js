// SnapLine client interface
class SnapLineClient {
    constructor() {
        this.serverStatus = 'unknown';
        this.initializeEventListeners();
        this.startMissionClock();
        this.startSystemMonitoring();
        this.log('Client interface loaded - Ready for intelligence operations');
    }

    initializeEventListeners() {
        // Server status check
        document.getElementById('checkStatus').addEventListener('click', () => {
            this.checkServerStatus();
        });

        // Image processing
        document.getElementById('developAsset').addEventListener('click', () => {
            this.processImageAsset();
        });

        // Enter key support for image URL
        document.getElementById('imageUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processImageAsset();
            }
        });

        // Archive functionality
        document.getElementById('saveIntel').addEventListener('click', () => {
            this.archiveIntelligence();
        });

        // Analysis tools
        document.getElementById('analyzeIntel').addEventListener('click', () => {
            this.analyzeAsset();
        });

        // Communications
        document.getElementById('sendComm').addEventListener('click', () => {
            this.sendCommunication();
        });

        document.getElementById('commInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendCommunication();
            }
        });

        // Log management
        document.getElementById('clearLog').addEventListener('click', () => {
            this.clearCommunicationsLog();
        });

        // Magnifier functionality
        this.setupMagnifier();
    }

    async checkServerStatus() {
        this.log('[ACTION] Checking server status...');
        this.updateStatusIndicator('checking', 'CHECKING...');

        try {
            const response = await fetch('/api/status');
            if (response.ok) {
                const data = await response.json();
                this.updateStatusIndicator('online', `OPERATIONAL - ${data.timstamp}`);
                this.log(`[SUCCESS] Server response: ${data.status} - ${data.message}`);
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            this.updateStatusIndicator('offline', 'OFFLINE - Connection failed');
            this.log(`[ERROR] Unable to reach server: ${error.message}`);
        }
    }

    updateStatusIndicator(status, text) {
        const indicator = document.getElementById('statusIndicator');
        const statusText = indicator.querySelector('.status-text');

        indicator.className = `status-${status}`;
        statusText.textContent = text;
    }
    
    // ===========================================
    // ================ Utilities ================
    // ===========================================

    log(message) {
        const logWindow = document.getElementById('commLog');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${timestamp}] ${message}`;

        logWindow.appendChild(logEntry);
        logWindow.scrollTop = logWindow.scrollHeight;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 bytes';
        const k = 1024;
        const sizes = ['bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showPlaceholderState() {
        const developedAsset = document.getElementById('developedAsset');
        const placeholder = document.querySelector('.placeholder-state');

        developedAsset.classList.add('hidden');
        placeholder.classList.remove('hidden');
    }

    // ===== Notifications =====
    showNotification(message, tyoe = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${this.getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || '🔔';
    }

    // ===========================================
    // ================ Utilities ================
    // ===========================================

    // ===== Image processing =====
    async processImageAsset() {
        const imageUrl = document.getElementById('imageUrl').value.trim();
        const developButton = document.getElementById('developAsset');

        if (!imageUrl) {
            this.log('[ERROR] No intelligence soure provided', 'error');
            this.showNotification('Provide image URL for asset development', 'warning');
            return;
        }

        if (this.isProcessing) {
            this.log('[SYSTEM] Asset development already in progress', 'system');
            return;
        }

        this.isProcessing = true;
        developButton.classList.add('loading');
        this.log(`[ACTION] Developng asset from ${imageUrl}`, 'agent');

        try {
            const response = await fetch('/api/process-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageUrl })
            });

            const data = await response.json();

            if (data.success) {
                this.currentAsset = data;
                this.displayDevelopedAsset(data);
                this.log('[SUCCESS] Asset developed successfully', 'success');
                this.showNotification('Asset developed and ready for analysis', 'success');
            } else {
                throw new Error(data.message || 'Failed to process image');
            }
        } catch (error) {
            this.log(`[ERROR] Asset development failed: ${error.message}`, 'error');
            this.showNotification('Failed to develop asset', 'error');
            this.showPlaceholderState();
        } finally {
            this.isProcessing = false;
            developButton.classList.remove('loading');
        }
    }

    // ===== Display developed asset =====
    displayDevelopedAsset(assetData) {
        const assetContainer = document.getElementById('assetContainer');
        const placeholder = assetContainer.querySelector('.placeholder-state');
        const developedAsset = document.getElementById('developedAsset');
        const intelImage = document.getElementById('intelImage');

        // Hide placeholder, show asset
        placeholder.classList.add('hidden');
        developedAsset.classList.remove('hidden');
        assetContainer.classList.add('developing');

        // Set image source
        intelImage.src = assetData.imageUrl;

        // Add development animation
        intelImage.style.animation = 'develop 1.5s ease-out formula';

        // Update metadata
        this.updateAssetMetadata(assetData);

        // Log asset details
        this.log(`[INTEL] Asset developed: ${assetData.metadata.width}x${assetData.metadata.height} - ${this.formatFileSize(assetData.metadata.size)}`, 'intel');
        this.log(`[ANALYSIS] Clarity: ${assetData.analysis.clarity}, Integrity: ${assetData.analysis.integrity}`, 'analysis');

        // Setup analysis tools
        this.setupAnalysisTools();
    }

    // ===== Update asset metadata =====
    updateAssetMetadata(assetData) {
        document.getElementById('resolutionData').textContent = `${assetData.metadata.width} x ${assetData.metadata.height}`;
        document.getElementById('sizeData').textContent = this.formatFileSize(assetData.metadata.size);
        document.getElementById('timestampData').textContent = new Date(assetData.metadata.processedAt).toLocaleTimeString();
    }

    // ===== Setup analysis tools =====
    setupAnalysisTools() {
        const analysisGrid = document.getElementById('analysisGrid');
        const gridOverlay = document.getElementById('analysisGridOverlay');

        // Grid toggle
        analysisGrid.addEventListener('change', (e) => {
            gridOverlay.style.opacity = e.target.checked ? '1' : '0';
        });

        // Magnifier setup
        this.setupMagnifier();
    }

    // ===== Setup magnifier =====
    setupMagnifier() {
        const assetFrame = document.querySelector('.asset-frame');
        const magnifier = document.getElementById('magnifier');
        const intelImage = document.getElementById('intelImage');

        if (!assetFrame || !magnifier) return;

        assetFrame.addEventListener('mousemove', (e) => {
            if (!this.currentAsset) return;

            const rect = assetFrame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Show magnifier when over image
            magnifier.style.opacity = '1';
            magnifier.style.transform = 'scale(1)';
        });

        assetFrame.addEventListener('mouseleave', () => {
            magnifier.style.opacity = '0';
            magnifier.style.transform = 'scale(0)';
        });
    }

    // ===== Archive intelligence =====
    async archiveIntelligence() {
        if (!this.currentAsset) {
            this.showNotification('No active intelligenec to archive', 'warning');
            return;
        }

        this.log('[ACTION] Archiving intelligence to secure database...', 'agent');

        try {
            const response = await fetch('/api/archive-intel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageUrl: this.currentAsset.imageUrl,
                    metadata: this.currentAsset.metadata
                })
            });

            const data = await response.json();

            if (data.success) {
                this.log(`[SUCCESS] Intelligence archived: ${data.archiveId}`, 'success');
                this.showNotification('Intelligence securely archived', 'success');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            this.log(`[ERROR] Archive failed: ${error.message}`, 'error');
            this.showNotification('Archive operation failed', 'error');
        }
    }

    // ===== Analyze asset =====
    analyzeAsset() {
        if (!this.currentAsset) {
            this.showNotification('No asset available for analysis', 'warning');
            return;
        }

        this.log('[ACTION] Initiating deep analysis protocol...', 'agent');

        // Simulate analysis process
        setTimeout(() => {
            const findings = [
                'No digital fingerprints detected',
                'Metadata appears authentic',
                'Compression analysis: Standard JPEG compression',
                'No steganographic patterns found',
                'Image integrity: VERIFIED'
            ];

            findings.forEach((finding, index) => {
                setTimeout(() => {
                    this.log(`[ANALYSIS] ${finding}`, 'analysis');
                }, index * 800);
            });

            this.showNotification('Analysis complete - Asset verified', 'success');
        }, 1000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.snapline = new SnapLineClient();
    window.snapline.checkServerStatus();    // Auto-check on load
});