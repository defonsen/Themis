import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

// Modern Background Component
const ModernBackground = () => {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

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
            <a 
              href="/architecture" 
              className="text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Architecture
            </a>
            <a 
              href="/docs" 
              className="text-gray-300 hover:text-yellow-400 transition-colors"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Image Generator Component
function Image() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt before generating");
      return;
    }

    setLoading(true);
    setError("");
    setImage(null);

    try {
      console.log("Sending prompt:", prompt);
      const response = await fetch("http://localhost:3001/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();

      if (!response.ok) {
        console.error("Error details:", data);
        throw new Error(
          data.error + (data.details ? `: ${JSON.stringify(data.details)}` : "")
        );
      }

      setImage(data.image);
    } catch (err) {
      console.error("Frontend error:", err);
      setError(err.message || "Error generating image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ModernBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400">
            Venice AI Image Generator
          </h1>
          
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-lg blur opacity-20"></div>
            <div className="relative bg-gray-900 rounded-lg p-6 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <motion.input
                  type="text"
                  placeholder="Enter your prompt..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 outline-none border border-gray-700 focus:border-yellow-500 transition-colors"
                  whileFocus={{ scale: 1.01 }}
                />
                <motion.button
                  onClick={handleGenerateImage}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-gray-900 rounded-lg font-semibold relative group overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">
                    {loading ? "Generating..." : "Generate"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </motion.button>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-8"
            >
              {error}
            </motion.div>
          )}

          {image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 rounded-lg blur opacity-20"></div>
              <div className="relative bg-gray-900 rounded-lg p-6 shadow-xl">
                <img
                  src={image}
                  alt="Generated"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Image;