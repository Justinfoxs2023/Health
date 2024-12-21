import React, { useEffect, useRef, useState } from 'react';

import { ImageService } from '../../services/image';
import { Spin, Skeleton } from 'antd';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** src 的描述 */
  src: string;
  /** alt 的描述 */
  alt: string;
  /** lazy 的描述 */
  lazy?: boolean;
  /** fallback 的描述 */
  fallback?: string;
  /** placeholder 的描述 */
  placeholder?: React.ReactNode;
  /** onLoad 的描述 */
  onLoad?: () => void;
  /** onError 的描述 */
  onError?: (error: Error) => void;
  /** imageService 的描述 */
  imageService?: ImageService;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  lazy = true,
  fallback = '',
  placeholder = <Skeleton.Image />,
  onLoad,
  onError,
  imageService = new ImageService(),
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!lazy) {
      loadImage();
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, lazy]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(null);

      // 预加载图片
      const optimizedSrc = await imageService.preloadImage(src);
      setImageSrc(optimizedSrc);

      onLoad?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load image');
      setError(error);
      onError?.(error);

      if (fallback) {
        setImageSrc(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  if (error && !fallback) {
    return (
      <div className="image-error" style={{ color: '#ff4d4f' }}>
        图片加载失败: {error.message}
      </div>
    );
  }

  return (
    <div className="image-container" style={{ position: 'relative' }}>
      {loading && <div className="image-placeholder">{placeholder || <Spin />}</div>}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        style={{
          display: loading ? 'none' : 'block',
          width: '100%',
          height: 'auto',
        }}
        onLoad={() => setLoading(false)}
        onError={e => {
          const error = new Error('Image failed to load');
          setError(error);
          onError?.(error);
          if (fallback) {
            setImageSrc(fallback);
          }
        }}
        {...props}
      />
    </div>
  );
};
