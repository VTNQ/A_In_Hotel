interface SceneElementProps{
    src:string;
    alt?:string;
    className?:string;
    style?:React.CSSProperties;
}
const SceneElement: React.FC<SceneElementProps> = ({ src, alt, className, style }) => (
    <img
      src={src}
      alt={alt}
      className={`absolute select-none ${className ?? ""}`}
      style={style}
      draggable="false"
    />
  );
  
  export default SceneElement;