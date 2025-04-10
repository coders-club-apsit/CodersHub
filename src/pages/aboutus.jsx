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
import Preloader from "@/components/Preloader";

const teamMembers = [
  {
    name: "Atharva Shelke",
    role: "Founder & Head",
    img: "atharva.jpg",
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
    // twitter: "kunal_mehta",
    linkedin: "ovee-dolkar-639261346",
    // github: "kunalmehta",
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
    name: "Sarakshi More",
    role: "Joint Community Head",
    img: "sarakshi.jpg",
    linkedin: "sarakshi-m-158212211",
  },
  {
    name: "Yadnesh Bamne",
    role: "Joint Dev Head",
    img: "yadnesh.jpg",
    twitter: "Yadnesh_Bamne",
    linkedin: "yadneshbamne21",
  },
  {
    name: "Aarya Bivalakr",
    role: "Joint Publicity Head",
    img: "aarya.jpg",
    // twitter: "riya_sharma",
    linkedin: "aarya-bivalkar-1a89b928a",
  },
  {
    name: "Durva Waghchaure",
    role: "Joint Event Head",
    img: "durva1.jpg",
    // twitter: "kunal_mehta",
    linkedin: "durva-waghchaure-4793942b9",
    // github: "kunalmehta",
  },
  {
    name: "Abdul Khan",
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

export default function AboutUs() {
  const { getToken } = useAuth();
  const [imageUrls, setImageUrls] = useState({});
  const [loadedImages, setLoadedImages] = useState({});
  const [showPreloader, setShowPreloader] = useState(true);

  // Add preloader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 3000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []);

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

  // Show preloader
  if (showPreloader) {
    return <Preloader />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 bg-gradient-to-b from-background via-background/95 to-background relative">
          <SideHeader />

          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
            <div className="absolute top-0 left-0 size-[500px] rounded-full bg-primary/20 -z-10 blur-[100px]" />
            <div className="absolute bottom-0 right-0 size-[500px] rounded-full bg-blue-500/20 -z-10 blur-[100px]" />
          </div>

          <motion.div
            className="flex flex-col items-center justify-center py-16 px-6 md:px-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
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
                        <img
                          src={imageUrls[img] || "/placeholder.jpg"}
                          alt={name}
                          align="top"
                          className={`w-full h-full object-cover rounded-full border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-500 ${
                            loadedImages[img] ? "opacity-100" : "opacity-0"
                          }`}
                          onLoad={() =>
                            setLoadedImages((prev) => ({
                              ...prev,
                              [img]: true,
                            }))
                          }
                          onError={() =>
                            setLoadedImages((prev) => ({
                              ...prev,
                              [img]: true,
                            }))
                          }
                        />
                        {!loadedImages[img] && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-blue-400/10 animate-pulse" />
                        )}
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
