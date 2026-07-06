export default function ImageCard({ src, alt = '', caption, onClick }) {
  return (
    <figure
      onClick={onClick}
      className={`glass-panel rounded-2xl overflow-hidden max-w-xs ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      }`}
    >
      <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      {caption && (
        <figcaption className="px-3 py-2 text-xs text-muted border-t border-border">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}