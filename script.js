// Enhanced Video and Interactive Elements Handler
class CampusStoryHandler {
    constructor() {
        this.video = document.getElementById('campusVideo');
        this.playButton = document.getElementById('playButton');
        this.videoContainer = document.getElementById('videoContainer');
        this.videoControls = document.getElementById('videoControls');
        this.progressFill = document.getElementById('progressFill');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.volumeBtn = document.getElementById('volumeBtn');
        
        this.isPlaying = false;
        this.isMuted = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
    }
    
    setupEventListeners() {
        // Play button click
        this.playButton.addEventListener('click', () => this.togglePlay());
        
        // Video events
        this.video.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('ended', () => this.videoEnded());
        this.video.addEventListener('play', () => this.onVideoPlay());
        this.video.addEventListener('pause', () => this.onVideoPause());
        
        // Control buttons
        this.pauseBtn.addEventListener('click', () => this.togglePlay());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        
        // Progress bar click
        const progressBar = document.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => this.seekVideo(e));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    togglePlay() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }
    
    onVideoPlay() {
        this.isPlaying = true;
        this.playButton.style.opacity = '0';
        this.videoControls.style.display = 'block';
        this.videoContainer.querySelector('.video-overlay').style.opacity = '0';
        
        // Update pause button icon to play icon
        this.pauseBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="4" width="4" height="16" fill="white"/>
                <rect x="14" y="4" width="4" height="16" fill="white"/>
            </svg>
        `;
    }
    
    onVideoPause() {
        this.isPlaying = false;
        this.playButton.style.opacity = '1';
        this.videoContainer.querySelector('.video-overlay').style.opacity = '1';
        
        // Update pause button icon to pause icon
        this.pauseBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7z" fill="white"/>
            </svg>
        `;
    }
    
    videoEnded() {
        this.isPlaying = false;
        this.playButton.style.opacity = '1';
        this.videoControls.style.display = 'none';
        this.videoContainer.querySelector('.video-overlay').style.opacity = '1';
        this.video.currentTime = 0;
        this.updateProgress();
    }
    
    updateProgress() {
        if (this.video.duration) {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            this.progressFill.style.width = `${progress}%`;
            this.updateTimeDisplay();
        }
    }
    
    updateTimeDisplay() {
        const current = this.formatTime(this.video.currentTime);
        const duration = this.formatTime(this.video.duration || 90); // Default to 90 seconds
        this.timeDisplay.textContent = `${current} / ${duration}`;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    seekVideo(e) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        
        if (this.video.duration) {
            this.video.currentTime = percentage * this.video.duration;
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.video.muted = this.isMuted;
        
        // Update volume icon
        if (this.isMuted) {
            this.volumeBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="white" stroke-width="2" fill="none"/>
                    <line x1="23" y1="9" x2="17" y2="15" stroke="white" stroke-width="2"/>
                    <line x1="17" y1="9" x2="23" y2="15" stroke="white" stroke-width="2"/>
                </svg>
            `;
        } else {
            this.volumeBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="white" stroke-width="2" fill="none"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="white" stroke-width="2" fill="none"/>
                </svg>
            `;
        }
    }
    
    handleKeyboard(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'KeyM':
                    this.toggleMute();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.video.currentTime = Math.max(0, this.video.currentTime - 10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
                    break;
            }
        }
    }
    
    handleResize() {
        // Handle responsive adjustments if needed
        if (window.innerWidth < 768 && this.isPlaying) {
            // Adjust video controls for mobile
            this.videoControls.style.padding = '10px';
        }
    }
    
    setupIntersectionObserver() {
        // Animate story items when they come into view
        const storyItems = document.querySelectorAll('.story-item');
        const featureCards = document.querySelectorAll('.feature');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Initially hide elements for animation
        [...storyItems, ...featureCards].forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(item);
        });
    }
    
    setupSmoothScrolling() {
        // Enhanced smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Parallax and scroll effects
class ScrollEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffect();
    }
    
    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Parallax effect for hero background
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${rate * 0.3}px)`;
            }
            
            // Fade navigation background based on scroll
            const nav = document.querySelector('.nav');
            if (nav) {
                const opacity = Math.min(scrolled / 100, 0.95);
                nav.style.background = `rgba(10, 10, 10, ${opacity})`;
            }
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate);
    }
    
    setupParallaxEffect() {
        // Add subtle parallax to video container
        const videoContainer = document.querySelector('.video-container');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            
            if (videoContainer) {
                videoContainer.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CampusStoryHandler();
    new ScrollEffects();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility changes (pause video when tab is not active)
document.addEventListener('visibilitychange', () => {
    const video = document.getElementById('campusVideo');
    if (document.hidden && video && !video.paused) {
        video.pause();
    }
}); 