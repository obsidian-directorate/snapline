// SnapLine client interface
class SnapLineClient {
    constructor() {
        this.serverStatus = 'unknown';
        this.initializeEventListeners();
        this.log('Client interface loaded');
    }

    initializeEventListeners() {
        document.getElementById('checkStatus').addEventListener('click', () => {
            this.checkServerStatus();
        });
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

    log(message) {
        const logWindow = document.getElementById('commLog');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${timestamp}] ${message}`;

        logWindow.appendChild(logEntry);
        logWindow.scrollTop = logWindow.scrollHeight;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.snapline = new SnapLineClient();
    window.snapline.checkServerStatus();    // Auto-check on load
});