import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";

const Notfound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist.</p>
        
        <div className="not-found-actions">
          <Link to="/" className="not-found-button home">
            <FaHome /> Back to Home
          </Link>
          <Link to="/search" className="not-found-button search">
            <FaSearch /> Search Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
