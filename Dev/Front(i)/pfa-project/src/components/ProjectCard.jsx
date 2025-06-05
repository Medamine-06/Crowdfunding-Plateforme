import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
const ProjectCard = ({ id, title, image, description }) => {
  return (
    <Link to={`/project/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="campaign-card">
        <img src={image} alt={title} />
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );
};

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ProjectCard;
