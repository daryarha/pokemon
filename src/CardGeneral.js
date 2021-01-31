import { Link } from 'react-router-dom';

  const CardGeneral = ({ header, name, image, description }) => {
    return (
        <div className="card">
            <Link to={`/pokemon/${name}`}>
            <div className="card-header">
            {header}
            </div>
            <amp-img layout="responsive" height="200" width="200" src={image} alt={name}></amp-img>
            <div className="overlay">
            <button className="btn-detail">Detail</button>
            </div>
            </Link>
            <div className="card-description">
            {description}
            </div>
        </div>
    );
  }

  export default CardGeneral