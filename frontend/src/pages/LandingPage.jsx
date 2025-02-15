import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const ModernBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Create bokeh circles with a neon golden theme
    const circles = [];
    const numCircles = 12;
    
    const colors = [
      { r: 255, g: 215, b: 0, a: 0.15 },    // Golden
      { r: 218, g: 165, b: 32, a: 0.12 },   // Golden Rod
      { r: 255, g: 191, b: 0, a: 0.1 },     // Amber
      { r: 255, g: 223, b: 0, a: 0.08 },    // Light Golden
    ];
    
    for(let i = 0; i < numCircles; i++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 50,
        color: colors[colorIndex],
        speed: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2
        },
        pulseSpeed: Math.random() * 0.002 + 0.001,
        pulseOffset: Math.random() * Math.PI * 2,
        maxRadius: Math.random() * 250 + 100,
        initialRadius: Math.random() * 200 + 50
      });
    }
    
    function drawBokeh(circle, time) {
      circle.radius = circle.initialRadius + Math.sin(time * circle.pulseSpeed + circle.pulseOffset) * 20;
      
      const gradient = ctx.createRadialGradient(
        circle.x, circle.y, 0,
        circle.x, circle.y, circle.radius
      );
      
      gradient.addColorStop(0, `rgba(${circle.color.r}, ${circle.color.g}, ${circle.color.b}, ${circle.color.a})`);
      gradient.addColorStop(0.5, `rgba(${circle.color.r}, ${circle.color.g}, ${circle.color.b}, ${circle.color.a * 0.5})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate() {
      ctx.fillStyle = 'rgba(25, 22, 15, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now();
      
      circles.forEach(circle => {
        circle.x += circle.speed.x;
        circle.y += circle.speed.y;
        
        if (circle.x < -circle.radius) circle.x = canvas.width + circle.radius;
        if (circle.x > canvas.width + circle.radius) circle.x = -circle.radius;
        if (circle.y < -circle.radius) circle.y = canvas.height + circle.radius;
        if (circle.y > canvas.height + circle.radius) circle.y = -circle.radius;
        
        drawBokeh(circle, time);
      });
      
      requestAnimationFrame(animate);
    }
    
    ctx.fillStyle = '#19160f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #19160f, #2e2815)' }}
    />
  );
};

const PulsingCard = ({ children, className, gradientClass = "from-yellow-900 via-amber-900 to-yellow-700" }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
  
    useEffect(() => {
      const animate = () => {
        const time = Date.now() / 1000;
        const x = Math.cos(time) * 100;
        const y = Math.sin(time) * 100;
        setPosition({ x, y });
      };
  
      const interval = setInterval(animate, 16);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div 
        ref={cardRef}
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradientClass} p-6 border border-opacity-20 border-yellow-300 ${className}`}
      >
        <div
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0) 70%)',
            transform: `translate(${position.x}%, ${position.y}%)`,
            top: '0',
            left: '0',
            pointerEvents: 'none'
          }}
        />
        {children}
      </div>
    );
};

// Animated Button Component
const AnimatedButton = ({ children, className, onClick, primary = false }) => {
    return (
      <motion.button
        className={`relative px-6 py-2 rounded-lg font-semibold transition-all duration-300 
          ${primary 
            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 hover:from-yellow-600 hover:to-amber-600' 
            : 'bg-transparent border border-yellow-500 text-yellow-400 hover:text-gray-900 hover:bg-yellow-500'} 
          ${className}`}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.button>
    );
};
// Navbar Component
const Navbar = () => {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-80 bg-transparent backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500">
                <NavLink to="/">Themis</NavLink>
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="/docs" className="text-gray-300 hover:text-yellow-400 transition-colors">
                Docs
              </a>
              <AnimatedButton className="relative group">
                <span className="relative z-10">
                  <NavLink to="/Image">Launch App</NavLink>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg opacity-20 group-hover:opacity-30 blur-sm transition-opacity duration-300"></div>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  const ClipText = ({ children, className }) => {
    return (
      <h1 
        className={`bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400 ${className}`}
      >
        {children}
      </h1>
    );
  };
  
  const LandingPage = () => {
    return (
      <div className="min-h-screen relative">
        <ModernBackground />
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-16">
          <header className="text-center mb-12">
            <ClipText className="text-7xl font-bold mb-6">
              AI Vision Creator
            </ClipText>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8">
              Experience the future of autonomous image generation, where AI creates stunning visuals guided by its own creative goals.
            </p>
            <AnimatedButton 
              primary 
              className="text-lg px-8 py-3 shadow-lg"
            >
              <NavLink to="/Image">Get Started</NavLink>
            </AnimatedButton>
          </header>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <PulsingCard 
              className="transform hover:scale-105 transition-transform duration-300"
              gradientClass="from-yellow-900 via-amber-900 to-yellow-800"
            >
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">Autonomous Creation</h3>
              <p className="text-gray-300">Our AI agent independently generates images based on its evolving creative goals and understanding.</p>
            </PulsingCard>
  
            <PulsingCard 
              className="transform hover:scale-105 transition-transform duration-300"
              gradientClass="from-amber-900 to-yellow-900"
            >
              <h3 className="text-xl font-semibold text-amber-400 mb-3">Advanced Technology</h3>
              <p className="text-gray-300">Powered by Venice.AI's cutting-edge image generation API for stunning, high-quality results.</p>
            </PulsingCard>
  
            <PulsingCard 
              className="transform hover:scale-105 transition-transform duration-300"
              gradientClass="from-yellow-800 via-amber-900 to-yellow-900"
            >
              <h3 className="text-xl font-semibold text-yellow-400 mb-3">Real-time Generation</h3>
              <p className="text-gray-300">Watch as unique images are created in real-time, each one reflecting the AI's creative vision.</p>
            </PulsingCard>
          </div>
  
          <section className="mb-16">
            <div className="text-center mb-12">
              <ClipText className="text-4xl font-bold mb-4">
                Unleash Creative Potential
              </ClipText>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Themis combines advanced AI algorithms with creative intelligence to produce unique, inspiring artwork that pushes the boundaries of digital creation.
              </p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PulsingCard 
                className="h-full"
                gradientClass="from-yellow-900 via-amber-900 to-yellow-800"
              >
                <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Intelligent Evolution</h3>
                <p className="text-gray-300 mb-4">Our AI system continuously learns and evolves, developing its artistic style while maintaining coherence with its core creative principles.</p>
                <ul className="text-gray-400 space-y-2">
                  <li>• Adaptive learning algorithms</li>
                  <li>• Style consistency maintenance</li>
                  <li>• Creative pattern recognition</li>
                </ul>
              </PulsingCard>
  
              <PulsingCard 
                className="h-full"
                gradientClass="from-amber-900 via-yellow-900 to-amber-800"
              >
                <h3 className="text-2xl font-semibold text-amber-400 mb-4">Technical Excellence</h3>
                <p className="text-gray-300 mb-4">Built on cutting-edge technology, Themis delivers exceptional image quality and performance while maintaining creative integrity.</p>
                <ul className="text-gray-400 space-y-2">
                  <li>• High-resolution output</li>
                  <li>• Real-time processing</li>
                  <li>• Advanced style transfer</li>
                </ul>
              </PulsingCard>
            </div>
          </section>
  
          <div className="text-center mb-16">
            <motion.button
              className="bg-gradient-to-r from-yellow-600 to-amber-600 text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:from-yellow-700 hover:to-amber-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <NavLink to="/Image">Generate Image</NavLink>
            </motion.button>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default LandingPage;