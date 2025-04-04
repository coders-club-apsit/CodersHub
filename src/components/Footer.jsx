import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PrivacyPolicyModal from './PrivacyPolicyModal';

const Footer = () => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      url: 'https://chat.whatsapp.com/GXJ7PDV8ZKhH0KSiVTVK7g',
      icon: <FaWhatsapp className="w-6 h-6" />,
      hoverColor: 'hover:text-green-400',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/codersclub_apsit',
      icon: <FaInstagram className="w-6 h-6" />,
      hoverColor: 'hover:text-pink-400',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/codersclub-apsit',
      icon: <FaLinkedin className="w-6 h-6" />,
      hoverColor: 'hover:text-blue-400',
    }
  ];

  const quickLinks = [
    { name: 'Notes', path: '/notes' },
    { name: 'Resources', path: '/resources' },
    { name: 'Community', path: '/community' },
    { name: 'FAQ', path: '#faq' }
  ];

  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handlePrivacyPolicyClick = (e) => {
    e.preventDefault();
    setShowPrivacyPolicy(true);
    window.location.hash = 'privacy-policy';
  };

  return (
    <footer className="relative mt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/20" />
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.h3 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Coders Club
            </motion.h3>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Coder's Club is a student-run community focused on improving problem-solving skills through Data Structures and Algorithms (DSA).
            </motion.p>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <motion.h3 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Connect with us
            </motion.h3>
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all duration-300 bg-blue-500/10 backdrop-blur-sm border border-blue-500/10 ${link.hoverColor}`}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Quick Links
            </motion.h3>
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
               {quickLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.path}
                  className="text-muted-foreground/80 hover:text-primary transition-all duration-300 hover:bg-blue-500/5 rounded-lg px-3 py-2"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  {link.name}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Copyright Section */}
        <motion.div 
          className="mt-12 pt-8 text-center border-t border-blue-500/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Coders Club. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-muted-foreground/40">•</span>
              <Link
                to="#privacy-policy"
                onClick={handlePrivacyPolicyClick}
                className="text-muted-foreground/80 hover:text-primary transition-all duration-300"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <PrivacyPolicyModal 
        open={showPrivacyPolicy} 
        onOpenChange={setShowPrivacyPolicy}
      />
    </footer>
  );
};

export default Footer;
