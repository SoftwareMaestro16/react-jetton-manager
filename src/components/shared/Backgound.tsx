import "../../index.css";

function Background() {
    return (
      <div className="background">
        {Array.from({ length: 19 }).map((_, i) => (
          <span key={i} className={`dot dot-${i}`} />
        ))}
      </div>
    );
}
  
export default Background;