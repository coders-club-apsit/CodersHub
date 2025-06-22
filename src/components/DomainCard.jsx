import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const DomainCard = ({ domainData }) => {
  // Animation variants for individual cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -5, transition: { duration: 0.3 } },
  };

  return (
    <>
      {domainData.map((domain) => (
        <motion.div
          key={domain.id}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Link to={`/projects/domain/${domain.id}`} className="block">
            <div className="bg-card p-6 rounded-lg hover:shadow-md transition-shadow border">
              <h2 className="text-xl font-bold text-primary mb-2">{domain.name}</h2>
              <p className="text-muted-foreground">{domain.description}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </>
  );
};

DomainCard.propTypes = {
  domainData: PropTypes.array.isRequired,
};

export default DomainCard;