import React from 'react';

type FitMode = 'cover' | 'contain';

interface MediaFrameProps {
  className?: string;
  children: React.ReactNode;
}

interface BaseMediaProps {
  src: string;
  alt: string;
  className?: string;
  fit?: FitMode;
  focalPoint?: string;
  overlayClassName?: string;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({ className = '', children }) => (
  <div className={`media-frame ${className}`}>{children}</div>
);

const MediaImage: React.FC<BaseMediaProps & { variantClass: string }> = ({
  src,
  alt,
  className = '',
  fit = 'cover',
  focalPoint = '50% 50%',
  overlayClassName,
  variantClass,
}) => (
  <MediaFrame className={variantClass}>
    <img
      src={src}
      alt={alt}
      className={`media-image media-image-${fit} ${className}`}
      style={{ objectPosition: focalPoint }}
    />
    {overlayClassName ? <div className={`media-overlay ${overlayClassName}`} /> : null}
  </MediaFrame>
);

export const HeroBackgroundMedia: React.FC<BaseMediaProps> = (props) => (
  <MediaImage {...props} variantClass="media-hero" />
);

export const FeatureCardMedia: React.FC<BaseMediaProps> = (props) => (
  <MediaImage {...props} variantClass="media-feature" />
);

export const AthletePortraitMedia: React.FC<BaseMediaProps> = (props) => (
  <MediaImage {...props} variantClass="media-athlete-portrait" />
);

export const ThumbnailMedia: React.FC<BaseMediaProps> = (props) => (
  <MediaImage {...props} variantClass="media-thumbnail" />
);
