import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import supabaseClient from "@/utils/supabase";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { LucideLinkedin } from "lucide-react";
import { motion } from "framer-motion";
import TeamMemberSkeleton from "@/components/TeamMemberSkeleton";
const teamMembers = [
  {
    name: "Atharva Shelke",
    role: "Founder & Head",
    img: "atharva2.jpg",
    twitter: "_atharva_shelke",
    linkedin: "atharva-shelke-a9a9a9226",
  },
  {
    name: "Avanish Vadke",
    role: "Dev Head",
    img: "avanish.jpeg",
    twitter: "AvanisHCodes_",
    linkedin: "avanishvadke",
    github: "AvanishVadke",
  },
  {
    name: "Parth Das",
    role: "Technical Head",
    img: "Parth.JPG",
    linkedin: "parth-das-675784259",
  },
  {
    name: "Samay Navale",
    role: "Community Head",
    img: "samay.png",
    linkedin: "samay-navale",
  },
  {
    name: "Ovee Dolkar",
    role: "Event Head",
    img: "ovee.jpeg",
    linkedin: "ovee-dolkar-639261346",
  },
  {
    name: "Abhishek Thormothe",
    role: "Design & Publicity Head",
    img: "abhiiii.png",
    twitter: "yadneshbamne",
    linkedin: "thormotheabhishek",
    github: "abhi2k4",
  },
  {
    name: "Nishil Rathod",
    role: "Content Head",
    img: "nishil.jpg",
    linkedin: "nishilrathod",
  },
  {
    name: "Sarakshi More",
    role: "Joint Community Head",
    img: "sarakshi.jpg",
    linkedin: "sarakshi-m-158212211",
    github: "Sarakshimore",
  },
  {
    name: "Yadnesh Bamne",
    role: "Joint Dev Head",
    img: "yadnesh.jpg",
    twitter: "Yadnesh_Bamne",
    linkedin: "yadneshbamne21",
  },
  {
    name: "Aarya Bivalkar",
    role: "Joint Publicity Head",
    img: "aarya.jpg",
    linkedin: "aarya-bivalkar-1a89b928a",
  },
  {
    name: "Vedant Shinde",
    role: "Joint Design Head",
    img: "vedant.jpg",
    // linkedin: "vedant-shinde-0b1a1a1b4",
    github: "Vedants06",
  },
  {
    name: "Durva Waghchaure",
    role: "Joint Event Head",
    img: "durva3.jpg",
    // twitter: "kunal_mehta",
    linkedin: "durva-waghchaure-4793942b9",
    // github: "kunalmehta",
  },
  {
    name: "Abdul Rehman Khan",
    role: "Joint Technical Head",
    img: "abdul.jpg",
    linkedin: "abdul-rehman-khan-68130328b",
  },
  {
    name: "Zahid Hamdule",
    role: "Joint Content Head",
    img: "zahid.jpg",
    // twitter: "rohan_patel",
    linkedin: "zahid-hamdule-5a198a285",
    // github: "rohanpatel",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ImageWithSkeleton = ({ src, alt, className, onLoad }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 rounded-full animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 via-blue-400/10 to-primary/10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
      />
    </div>
  );
};

export default function AboutUs() {
  const { getToken } = useAuth();
  const [imageUrls, setImageUrls] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

 
  // Existing image fetching effect
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = await getToken();
        const supabase = await supabaseClient(token);

        let urls = {};
        for (const member of teamMembers) {
          const { data } = supabase.storage
            .from("team_photos")
            .getPublicUrl(member.img);
          if (data && data.publicUrl) urls[member.img] = data.publicUrl;
        }
        setImageUrls(urls);
      } catch (err) {
        console.error("Image load error:", err);
      }
    };

    fetchImages();
  }, [getToken]);
  
  return (
    <SidebarProvider>
      <div className="flex w-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 bg-gradient-to-b from-background via-background/95 to-background relative">
          <SideHeader />

          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
            <div className="absolute top-0 left-0 size-[500px] rounded-full bg-primary/20 -z-10 blur-[100px]" />
            <div className="absolute bottom-0 right-0 size-[500px] rounded-full bg-blue-500/20 -z-10 blur-[100px]" />
          </div>

          {/* About Section */}
          <motion.div
            className="flex flex-col items-center justify-center py-16 px-6 md:px-12 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-40 h-40 mb-8 relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              <img 
                src="/cc_logo.png" 
                alt="Coders Club Logo" 
                className="relative z-10 w-full h-full object-contain drop-shadow-lg"
              />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              About Coders Club
            </motion.h1>

            <motion.div
              className="max-w-3xl text-center space-y-6 mb-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to <b>Coders Club</b>, a vibrant community at <b>A.P. Shah Institute Of Technology</b> fostering technical excellence and innovation. 
                We are dedicated to helping students master Data Structures, Algorithms, and competitive programming.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="p-6 rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-primary mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">To cultivate a collaborative learning environment where students can enhance their programming skills and grow together.</p>
                </div>
                
                <div className="p-6 rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-primary mb-2">What We Do</h3>
                  <p className="text-muted-foreground">Regular coding contests, workshops, mentorship programs, and hands-on projects to build practical skills.</p>
                </div>
                
                <div className="p-6 rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-primary mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">To create a community of skilled programmers ready to tackle real-world challenges and excel in their careers.</p>
                </div>
              </div>
            </motion.div>

            {/* Existing Team Section */}
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Meet Our Team
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-center max-w-2xl mb-16"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              The passionate individuals behind Coders Club, working together to
              create an amazing learning community.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl"
              variants={containerVariants}
            >
              {teamMembers.map(
                ({ name, role, img, twitter, linkedin, github }) => (
                  <motion.div
                    key={name}
                    variants={cardVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group relative bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                        <ImageWithSkeleton
                          src={imageUrls[img] || "/placeholder.jpg"}
                          alt={name}
                          className="w-full h-full object-cover rounded-full border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-500"
                          onLoad={() =>
                            setLoadedImages((prev) => ({
                              ...prev,
                              [img]: true,
                            }))
                          }
                        />
                      </div>

                      <h3 className="text-xl font-bold mt-4 text-center group-hover:text-primary transition-colors duration-300">
                        {name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 text-center">
                        {role}
                      </p>

                      <div className="flex justify-center gap-4 mt-4">
                        {twitter && (
                          <motion.a
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            href={`https://x.com/${twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors duration-300"
                          >
                            <FontAwesomeIcon
                              icon={faXTwitter}
                              className="w-5 h-5"
                            />
                          </motion.a>
                        )}
                        {linkedin && (
                          <motion.a
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            href={`https://www.linkedin.com/in/${linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors duration-300"
                          >
                            <LucideLinkedin className="w-5 h-5" />
                          </motion.a>
                        )}
                        {github && (
                          <motion.a
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            href={`https://github.com/${github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors duration-300"
                          >
                            <FontAwesomeIcon
                              icon={faGithub}
                              className="w-5 h-5"
                            />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  );
}
