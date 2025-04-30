import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState } from "react";
import supabase from "@/utils/supabase";
import { deleteDomain, getDomains, updateDomain } from "@/api/api-projects";
import DomainFormModal from "@/components/DomainFormModal";

const DomainCard = ({ domainData, isAdmin }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

  // Animation variants for individual cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -5, transition: { duration: 0.3 } },
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this domain?")) {
      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        await deleteDomain(token, id);
        const updatedDomains = await getDomains(token);
        // Update parent state via callback or context if needed
        window.location.reload(); // Temporary solution; ideally, use state management
      } catch (error) {
        console.error("Error deleting domain:", error);
        alert("Failed to delete domain.");
      }
    }
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
          <div className="relative">
            <Link to={`/projects/domain/${domain.id}`} className="block">
              <div className="bg-card p-6 rounded-lg hover:shadow-md transition-shadow border">
                <h2 className="text-xl font-bold text-primary mb-2">{domain.name}</h2>
                <p className="text-muted-foreground">{domain.description}</p>
              </div>
            </Link>
            {isAdmin && (
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => {
                    setSelectedDomain(domain);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </motion.button>
                <motion.button
                  className="px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 text-sm"
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => handleDelete(domain.id)}
                >
                  Delete
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
      {isAdmin && selectedDomain && (
        <DomainFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDomain(null);
          }}
          onSubmit={async (domain) => {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            await updateDomain(token, selectedDomain.id, domain);
            const updatedDomains = await getDomains(token);
            // Update parent state via callback or context if needed
            window.location.reload(); // Temporary solution
            setIsEditModalOpen(false);
            setSelectedDomain(null);
          }}
          initialData={selectedDomain}
        />
      )}
    </>
  );
};

DomainCard.propTypes = {
  domainData: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool,
};

DomainCard.defaultProps = {
  isAdmin: false,
};

export default DomainCard;