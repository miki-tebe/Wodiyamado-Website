import { Button } from "@/components/ui/button";
import { JoinDialog } from "@/components/JoinDialogComponent";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface HeroSectionProps {
  openModal: boolean;
}

// Custom hook for counting animation
function useCountAnimation(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isInView, end, duration]);

  return { count, ref };
}

export default function HeroSection({ openModal }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/30 to-primary/90">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main heading */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Welcome to Rotaract Club of <span className="text-primary">Wodiyamado</span>
            </h1>

            <p
              className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            >
              We are a group of young leaders dedicated to improving our communities through service.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="#" data-astro-reload>
              <JoinDialog openModal={openModal} />
            </a>
            <a href="/donate">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 hover:hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-200 backdrop-blur-sm"
              >
                Support Our Mission
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <div className="text-sm">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedCounter end={100} suffix="+" />
              </div>
              <div className="text-sm">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedCounter end={7} suffix="+" />
              </div>
              <div className="text-sm">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <AnimatedCounter end={1000} suffix="+" />
              </div>
              <div className="text-sm">Hours of Service</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center animate-bounce"
        >
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse">
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const { count, ref } = useCountAnimation(end, 2);

  return (
    <motion.span
      ref={ref}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {count}{suffix}
    </motion.span>
  );
}
