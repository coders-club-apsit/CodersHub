import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { isAndroid } from 'react-device-detect';
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
    { name: 'Community', path: 'https://chat.whatsapp.com/GXJ7PDV8ZKhH0KSiVTVK7g', external: true },
    { name: 'FAQ', path: '#faq' }
  ];

  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const handlePrivacyPolicyClick = (e) => {
    e.preventDefault();
    setShowPrivacyPolicy(true);
    window.location.hash = 'privacy-policy';
  };

  // Helper function to conditionally wrap with motion
  const MotionWrapper = ({ children, ...props }) => {
    if (isAndroid) {
      return <div className={props.className}>{children}</div>;
    }
    return <motion.div {...props}>{children}</motion.div>;
  };

  const MotionLink = ({ children, ...props }) => {
    if (isAndroid) {
      return <a className={props.className} href={props.href}>{children}</a>;
    }
    return <motion.a {...props}>{children}</motion.a>;
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Top Shadow Gradient */}
      <div className="absolute inset-x-0 -top-20 h-20 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 max-h-4xl overflow-hidden -z-10">
        {/* Base gradient with darker start */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-primary/10" />

        {/* Colored gradients with adjusted opacity */}
        <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-pink-500/20 blur-[100px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[120px] opacity-40" />
        <div className="absolute top-1/2 right-1/4 w-[150px] h-[150px] rounded-full bg-cyan-400/20 blur-[100px] opacity-40" />
        
        {/* Enhanced Grid overlay */}
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <MotionWrapper 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Coders Club
            </MotionWrapper>
            <MotionWrapper 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Coder's Club is a student-run community focused on improving problem-solving skills through Data Structures and Algorithms (DSA).
            </MotionWrapper>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <MotionWrapper 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Connect with us
            </MotionWrapper>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <MotionLink
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all duration-300 bg-blue-500/10 backdrop-blur-sm border border-blue-500/10 ${link.hoverColor}`}
                  whileHover={!isAndroid && { 
                    scale: 1.1,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                  }}
                  whileTap={!isAndroid && { scale: 0.95 }}
                >
                  {link.icon}
                </MotionLink>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <MotionWrapper 
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Quick Links
            </MotionWrapper>
            <MotionWrapper 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {quickLinks.map((link, index) => (
                link.external ? (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground/80 hover:text-primary transition-all duration-300 hover:bg-blue-500/5 rounded-lg px-3 py-2"
                  >
                    {link.name}
                  </a>
                ) : (
                  <MotionLink
                    key={link.name}
                    href={link.path}
                    className="text-muted-foreground/80 hover:text-primary transition-all duration-300 hover:bg-blue-500/5 rounded-lg px-3 py-2"
                    whileHover={!isAndroid && { x: 5 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {link.name}
                  </MotionLink>
                )
              ))}
            </MotionWrapper>
          </div>
        </div>

        {/* Copyright Section */}
        <MotionWrapper 
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
        </MotionWrapper>
      </div>

      <PrivacyPolicyModal 
        open={showPrivacyPolicy} 
        onOpenChange={setShowPrivacyPolicy}
      />
    </footer>
  );
};

export default Footer;
