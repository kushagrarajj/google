import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export class App {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lenis = null;
    this.isInitialized = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.setupThreeJS = this.setupThreeJS.bind(this);
    this.setupSmoothScroll = this.setupSmoothScroll.bind(this);
    this.setupInteractions = this.setupInteractions.bind(this);
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // Initialize components
      await this.setupThreeJS();
      this.setupSmoothScroll();
      this.setupInteractions();
      this.setupPeriodicTable();
      this.setupProjects();
      this.setupContactForm();
      
      // Start animation loop
      this.animate();
      
      // Add event listeners
      window.addEventListener('resize', this.handleResize);
      
      this.isInitialized = true;
      console.log('Digital Alchemist Portfolio initialized successfully');
    } catch (error) {
      console.error('Error initializing portfolio:', error);
    }
  }

  setupThreeJS() {
    return new Promise((resolve) => {
      const canvas = document.getElementById('hero-canvas');
      if (!canvas) {
        resolve();
        return;
      }

      // Scene setup
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ 
        canvas, 
        antialias: true, 
        alpha: true 
      });
      
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setClearColor(0x0a0a0f, 0);

      // Create laboratory environment
      this.createLaboratoryScene();
      
      // Position camera
      this.camera.position.z = 5;
      
      resolve();
    });
  }

  createLaboratoryScene() {
    // Create floating geometric shapes
    const geometries = [
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.ConeGeometry(0.3, 0.8, 8),
      new THREE.OctahedronGeometry(0.4),
    ];

    const materials = [
      new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x00ff88, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
      }),
    ];

    // Create floating objects
    this.floatingObjects = [];
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.x = (Math.random() - 0.5) * 20;
      mesh.position.y = (Math.random() - 0.5) * 20;
      mesh.position.z = (Math.random() - 0.5) * 10;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;
      
      this.scene.add(mesh);
      this.floatingObjects.push({
        mesh,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        floatSpeed: Math.random() * 0.01 + 0.005,
        initialY: mesh.position.y,
      });
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);
  }

  setupSmoothScroll() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  setupInteractions() {
    // Hero buttons
    const enterLabBtn = document.getElementById('enter-lab');
    const viewExperimentsBtn = document.getElementById('view-experiments');

    if (enterLabBtn) {
      enterLabBtn.addEventListener('click', () => {
        this.lenis.scrollTo('#about', { duration: 2 });
      });
    }

    if (viewExperimentsBtn) {
      viewExperimentsBtn.addEventListener('click', () => {
        this.lenis.scrollTo('#experiments', { duration: 2 });
      });
    }

    // Setup scroll-triggered animations
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
      const title = section.querySelector('h2');
      const content = section.querySelectorAll('p, div, form');
      
      if (title) {
        gsap.fromTo(title, 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      content.forEach((element, i) => {
        gsap.fromTo(element,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    });
  }

  setupPeriodicTable() {
    const skills = [
      { symbol: 'Js', name: 'JavaScript', level: 95, description: 'Modern ES6+ JavaScript for interactive web applications' },
      { symbol: 'Ts', name: 'TypeScript', level: 90, description: 'Strongly typed JavaScript for large-scale applications' },
      { symbol: 'Re', name: 'React', level: 92, description: 'Component-based UI library for building user interfaces' },
      { symbol: 'Vu', name: 'Vue.js', level: 88, description: 'Progressive framework for building user interfaces' },
      { symbol: 'Th', name: 'Three.js', level: 85, description: 'JavaScript 3D library for creating WebGL experiences' },
      { symbol: 'Gs', name: 'GSAP', level: 90, description: 'Professional animation library for the modern web' },
      { symbol: 'Cs', name: 'CSS3', level: 93, description: 'Advanced styling with animations and responsive design' },
      { symbol: 'Ht', name: 'HTML5', level: 95, description: 'Semantic markup and modern web standards' },
      { symbol: 'Nd', name: 'Node.js', level: 87, description: 'Server-side JavaScript runtime environment' },
      { symbol: 'Py', name: 'Python', level: 82, description: 'Versatile programming language for various applications' },
      { symbol: 'Gl', name: 'WebGL', level: 80, description: 'Low-level 3D graphics API for the web' },
      { symbol: 'Sh', name: 'Shaders', level: 75, description: 'GLSL programming for custom visual effects' },
    ];

    const periodicTable = document.getElementById('periodic-table');
    const skillDetails = document.getElementById('skill-details');
    const skillName = document.getElementById('skill-name');
    const skillDescription = document.getElementById('skill-description');
    const skillLevel = document.getElementById('skill-level');
    const skillBar = document.getElementById('skill-bar');

    if (!periodicTable) return;

    const tableGrid = periodicTable.querySelector('div');
    
    skills.forEach((skill, index) => {
      const element = document.createElement('div');
      element.className = 'skill-element relative p-4 bg-space-blue/30 border border-electric-cyan/20 rounded-lg cursor-pointer transition-all duration-300 hover:border-electric-cyan hover:bg-electric-cyan/10 hover:scale-105';
      element.innerHTML = `
        <div class="text-2xl font-mono font-bold text-electric-cyan mb-1">${skill.symbol}</div>
        <div class="text-xs font-mono text-warm-white/70">${skill.name}</div>
        <div class="absolute top-1 right-1 w-2 h-2 bg-lab-green rounded-full opacity-${Math.floor(skill.level / 10)}"></div>
      `;

      element.addEventListener('click', () => {
        skillName.textContent = skill.name;
        skillDescription.textContent = skill.description;
        skillLevel.textContent = `${skill.level}%`;
        skillBar.style.width = `${skill.level}%`;
        skillDetails.style.opacity = '1';

        // Animate skill bar
        gsap.fromTo(skillBar, 
          { width: '0%' },
          { width: `${skill.level}%`, duration: 1, ease: 'power2.out' }
        );
      });

      tableGrid.appendChild(element);
    });
  }

  setupProjects() {
    const projects = [
      {
        title: 'Neural Network Visualizer',
        description: 'Interactive 3D visualization of neural network architectures',
        tech: ['Three.js', 'WebGL', 'GSAP'],
        image: '/api/placeholder/400/300',
        link: '#'
      },
      {
        title: 'Quantum Portfolio',
        description: 'Award-winning portfolio with quantum physics animations',
        tech: ['React', 'Framer Motion', 'Canvas'],
        image: '/api/placeholder/400/300',
        link: '#'
      },
      {
        title: 'Holographic Interface',
        description: 'Futuristic UI with holographic effects and shaders',
        tech: ['Vue.js', 'WebGL', 'Shaders'],
        image: '/api/placeholder/400/300',
        link: '#'
      },
      {
        title: 'DNA Sequencer',
        description: 'Bioinformatics tool with interactive 3D molecular structures',
        tech: ['Three.js', 'D3.js', 'Node.js'],
        image: '/api/placeholder/400/300',
        link: '#'
      },
      {
        title: 'Particle Playground',
        description: 'Physics-based particle system with real-time controls',
        tech: ['WebGL', 'Matter.js', 'GSAP'],
        image: '/api/placeholder/400/300',
        link: '#'
      },
      {
        title: 'Cyber Dashboard',
        description: 'Real-time data visualization with cyberpunk aesthetics',
        tech: ['React', 'D3.js', 'WebSocket'],
        image: '/api/placeholder/400/300',
        link: '#'
      }
    ];

    const projectsGrid = document.querySelector('#experiments .grid');
    if (!projectsGrid) return;

    projects.forEach((project, index) => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card group relative bg-space-blue/30 border border-electric-cyan/20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-electric-cyan hover:scale-105';
      projectCard.innerHTML = `
        <div class="aspect-video bg-gradient-to-br from-electric-cyan/20 to-holographic-pink/20 flex items-center justify-center">
          <div class="text-4xl font-mono text-electric-cyan opacity-50">
            ${project.title.split(' ').map(word => word[0]).join('')}
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-mono font-bold text-electric-cyan mb-2">${project.title}</h3>
          <p class="text-warm-white/70 font-sans mb-4">${project.description}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${project.tech.map(tech => `
              <span class="px-2 py-1 bg-lab-green/20 text-lab-green text-xs font-mono rounded">${tech}</span>
            `).join('')}
          </div>
          <div class="flex items-center justify-between">
            <span class="text-holographic-pink font-mono text-sm">View Project</span>
            <svg class="w-5 h-5 text-holographic-pink transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </div>
        </div>
      `;

      projectCard.addEventListener('click', () => {
        console.log(`Opening project: ${project.title}`);
        // Add project navigation logic here
      });

      projectsGrid.appendChild(projectCard);
    });
  }

  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'TRANSMITTING...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = 'MESSAGE TRANSMITTED';
        submitBtn.style.backgroundColor = '#00ff88';
        submitBtn.style.borderColor = '#00ff88';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
          contactForm.reset();
        }, 2000);
      }, 1500);
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    if (this.floatingObjects) {
      this.floatingObjects.forEach((obj, index) => {
        // Rotate objects
        obj.mesh.rotation.x += obj.rotationSpeed.x;
        obj.mesh.rotation.y += obj.rotationSpeed.y;
        obj.mesh.rotation.z += obj.rotationSpeed.z;
        
        // Float objects
        obj.mesh.position.y = obj.initialY + Math.sin(Date.now() * obj.floatSpeed + index) * 2;
      });
    }

    if (this.camera && this.scene) {
      // Mouse-based camera movement
      const mouseX = (window.innerWidth / 2 - (window.mouseX || window.innerWidth / 2)) * 0.0001;
      const mouseY = (window.innerHeight / 2 - (window.mouseY || window.innerHeight / 2)) * 0.0001;
      
      this.camera.position.x += (mouseX - this.camera.position.x) * 0.05;
      this.camera.position.y += (mouseY - this.camera.position.y) * 0.05;
      
      this.camera.lookAt(this.scene.position);
    }

    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  handleResize() {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Track mouse position globally
document.addEventListener('mousemove', (e) => {
  window.mouseX = e.clientX;
  window.mouseY = e.clientY;
});

// Auto-initialize if not already done
if (typeof window !== 'undefined') {
  window.DigitalAlchemistApp = App;
}