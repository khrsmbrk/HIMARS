import React, { useState, useEffect } from 'react';
import { generateImage } from '../utils/aiImageGenerator';
import { motion } from 'motion/react';

interface AIGeneratedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  prompt: string;
  fallbackSrc?: string;
}

export const AIGeneratedImage: React.FC<AIGeneratedImageProps> = ({ prompt, fallbackSrc, className, alt, ...props }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      setLoading(true);
      try {
        const generatedSrc = await generateImage(prompt);
        if (isMounted) {
          setSrc(generatedSrc);
        }
      } catch (error) {
        if (isMounted) {
          setSrc(fallbackSrc || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [prompt, fallbackSrc]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-slate-200 ${className}`} />
    );
  }

  return (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      src={src || fallbackSrc || undefined}
      alt={alt || prompt}
      className={className}
      {...props}
    />
  );
};
