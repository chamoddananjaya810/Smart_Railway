function showAdvancedAlert(type, title, message, options = {}) {
    const defaults = {
        duration: 5000,
        position: 'top-right',
        allowHtml: false,
        showProgress: true,
        pauseOnHover: true,
        sound: false
    };

    const config = {...defaults, ...options};

    const types = {
        success: {
            class: "alert-success",
            icon: "fa-check-circle",
            color: "#28a745",
            bgColor: "rgba(40, 167, 69, 0.1)",
            borderColor: "#28a745"
        },
        error: {
            class: "alert-danger",
            icon: "fa-times-circle",
            color: "#dc3545",
            bgColor: "rgba(220, 53, 69, 0.1)",
            borderColor: "#dc3545"
        },
        warning: {
            class: "alert-warning",
            icon: "fa-exclamation-triangle",
            color: "#ffc107",
            bgColor: "rgba(255, 193, 7, 0.1)",
            borderColor: "#ffc107"
        },
        info: {
            class: "alert-info",
            icon: "fa-info-circle",
            color: "#17a2b8",
            bgColor: "rgba(23, 162, 184, 0.1)",
            borderColor: "#17a2b8"
        }
    };

    const alertInfo = types[type] || types.info;
    const alertId = 'alert-' + Date.now() + Math.random().toString(36).substr(2, 9);

    // Create alert container if it doesn't exist
    let alertArea = document.getElementById("alertArea");
    if (!alertArea) {
        alertArea = document.createElement('div');
        alertArea.id = 'alertArea';
        alertArea.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            z-index: 9999;
            max-height: 80vh;
            overflow-y: auto;
            pointer-events: none;
        `;
        document.body.appendChild(alertArea);
    }

    const progressBar = config.showProgress ? `
        <div class="alert-progress" style="
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: ${alertInfo.color};
            width: 100%;
            transform-origin: left;
            animation: alertProgress ${config.duration}ms linear forwards;
        "></div>
    ` : '';

    const alertBox = `
        <div id="${alertId}" class="enhanced-alert alert ${alertInfo.class} alert-dismissible fade show" 
             style="
                 border: none;
                 border-radius: 12px;
                 padding: 20px;
                 margin-bottom: 15px;
                 position: relative;
                 overflow: hidden;
                 backdrop-filter: blur(10px);
                 background: ${alertInfo.bgColor};
                 border-left: 4px solid ${alertInfo.borderColor};
                 box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                 pointer-events: auto;
                 transform: translateX(420px);
                 opacity: 0;
                 animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
             " 
             role="alert">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <i class="fas ${alertInfo.icon}" style="
                    color: ${alertInfo.color};
                    font-size: 1.5rem;
                    margin-top: 2px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                "></i>
                <div style="flex: 1; min-width: 0;">
                    <div style="
                        font-weight: 600;
                        font-size: 1.1rem;
                        color: #2c3e50;
                        margin-bottom: 4px;
                        line-height: 1.3;
                    ">${config.allowHtml ? title : escapeHtml(title)}</div>
                    <div style="
                        color: #5a6c7d;
                        font-size: 0.95rem;
                        line-height: 1.4;
                        word-wrap: break-word;
                    ">${config.allowHtml ? message : escapeHtml(message)}</div>
                </div>
                <button type="button" class="btn-close" onclick="closeAlert('${alertId}')" 
                        aria-label="Close" style="
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: all 0.2s ease;
                    padding: 4px;
                    border-radius: 4px;
                " onmouseover="this.style.opacity='1'; this.style.backgroundColor='rgba(0,0,0,0.1)'"
                   onmouseout="this.style.opacity='0.6'; this.style.backgroundColor='transparent'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${progressBar}
        </div>
    `;

    alertArea.insertAdjacentHTML('afterbegin', alertBox);

    const alertElement = document.getElementById(alertId);

    // Add hover pause functionality
    if (config.pauseOnHover) {
        let timeoutId;
        let remainingTime = config.duration;
        let startTime = Date.now();

        const startTimer = () => {
            startTime = Date.now();
            timeoutId = setTimeout(() => closeAlert(alertId), remainingTime);
        };

        const pauseTimer = () => {
            clearTimeout(timeoutId);
            remainingTime -= Date.now() - startTime;
            const progressBar = alertElement.querySelector('.alert-progress');
            if (progressBar) {
                progressBar.style.animationPlayState = 'paused';
            }
        };

        const resumeTimer = () => {
            startTimer();
            const progressBar = alertElement.querySelector('.alert-progress');
            if (progressBar) {
                progressBar.style.animationPlayState = 'running';
            }
        };

        alertElement.addEventListener('mouseenter', pauseTimer);
        alertElement.addEventListener('mouseleave', resumeTimer);

        startTimer();
    } else if (config.duration > 0) {
        setTimeout(() => closeAlert(alertId), config.duration);
    }

    // Play sound if enabled
    if (config.sound && typeof config.sound === 'string') {
        try {
            const audio = new Audio(config.sound);
            audio.volume = 0.3;
            audio.play().catch(() => {
            }); // Ignore errors if sound can't play
        } catch (e) {
        }
    }

    return alertId;
}

// Enhanced close function with animation
function closeAlert(alertId) {
    const alertElement = document.getElementById(alertId);
    if (!alertElement)
        return;

    alertElement.style.animation = 'slideOutRight 0.3s ease-in forwards';
    setTimeout(() => {
        if (alertElement && alertElement.parentNode) {
            alertElement.parentNode.removeChild(alertElement);
        }
    }, 300);
}

// Utility function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// Add required CSS animations
function addAlertStyles() {
    if (document.getElementById('enhanced-alert-styles'))
        return;

    const styles = document.createElement('style');
    styles.id = 'enhanced-alert-styles';
    styles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(420px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(420px);
                opacity: 0;
            }
        }
        
        @keyframes alertProgress {
            from {
                transform: scaleX(1);
            }
            to {
                transform: scaleX(0);
            }
        }
        
        .enhanced-alert:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        #alertArea {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        
        #alertArea::-webkit-scrollbar {
            display: none;
        }
    `;
    document.head.appendChild(styles);
}

// Initialize styles when script loads
addAlertStyles();

// Convenience methods for different alert types
const Alert = {
    success: (title, message, options) => showAdvancedAlert('success', title, message, options),
    error: (title, message, options) => showAdvancedAlert('error', title, message, options),
    warning: (title, message, options) => showAdvancedAlert('warning', title, message, options),
    info: (title, message, options) => showAdvancedAlert('info', title, message, options),

    // Batch operations
    clear: () => {
        const alertArea = document.getElementById('alertArea');
        if (alertArea)
            alertArea.innerHTML = '';
    },

    // Quick messages
    quick: {
        success: (message) => showAdvancedAlert('success', 'Success!', message, {duration: 3000}),
        error: (message) => showAdvancedAlert('error', 'Error!', message, {duration: 4000}),
        warning: (message) => showAdvancedAlert('warning', 'Warning!', message, {duration: 4000}),
        info: (message) => showAdvancedAlert('info', 'Info', message, {duration: 3000})
    }
};