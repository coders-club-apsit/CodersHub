import React from 'react';
import { FaGithub, FaLinkedin, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    {
      name: 'WhatsApp',
      url: 'https://chat.whatsapp.com/GXJ7PDV8ZKhH0KSiVTVK7g', // Replace with your WhatsApp number
      icon: <FaWhatsapp className="w-6 h-6" />,
      hoverColor: 'hover:text-green-500',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/codersclub_apsit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', // Replace with your Instagram username
      icon: <FaInstagram className="w-6 h-6" />,
      hoverColor: 'hover:text-pink-500',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Coders Club</h3>
            <p className="text-gray-400">
            Coder's Club is a student-run community focused on improving problem-solving skills through Data Structures and Algorithms (DSA). 
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Connect with us on</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-transform duration-200 transform ${link.hoverColor} hover:scale-110`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Coders Club All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
