import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import supabaseClient from "@/utils/supabase";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faWhatsapp, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { LucideLinkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PLACEHOLDER_IMAGE = "/placeholder.png";

const educatorsByYear = {
  "2024-2025": [
    {
      name: "Atharva Shelke",
      img: "atharva2.jpg",
      linkedin: "atharva-shelke-a9a9a9226",
      whatsapp: "917045649828",
      twitter: "_atharva_shelke", 
      expertise: ["Leadership", "Team Management", "Data Structures"]
    },
    {
      name: "Avanish Vadke",
      img: "avanish.jpeg",
      linkedin: "avanishvadke",
      github: "AvanishVadke",
      whatsapp: "919920938235",
      twitter: "AvanisHCodes_", 
      expertise: ["MERN", "Android Dev", "Backend (SQL/PostgreSQL/Firebase)"]
    },
    {
      name: "Parth Das",
      img: "Parth.JPG",
      linkedin: "parth-das-675784259",
      whatsapp: "919819722550",
      expertise: ["Algorithms", "Problem Solving", "Java"]
    },
    {
      name: "Samay Navale",
      img: "samay.png",
      linkedin: "samay-navale",
      whatsapp: "919172229750",
      expertise: ["Community Management", "App Development", "Networking"]
    },
    {
      name: "Ovee Dolkar",
      img: "ovee.jpeg",
      linkedin: "ovee-dolkar-639261346",
      whatsapp: "918928641168",
      expertise: ["Event Management", "Public Speaking", "Team Building"]
    },
    {
      name: "Nishil",
      img: "nishil.jpg",
      linkedin: "nishil-profile",
      whatsapp: "917654321098",
      expertise: ["Problem Solving", "DSA Expert", "Java"]
    },
    {
      name: "Nayan Gaikwad",
      img: "nayan1.jpg",
      linkedin: "nayan-gaikwad-96b63726b",
      whatsapp: "918828469293",
      expertise: ["Mentorship", "Python", "Data Analysis"]
    },
    {
      name: "Nikhil Bhosale",
      img: "nikhil1.jpg",
      whatsapp: "917248997996",
      expertise: ["DSA", "Web Development", "Python"]
    },
    {
      name: "Sarakshi More",
      img: "sarakshi.jpg",
      linkedin: "sarakshi-m-158212211",
      github: "Sarakshimore",
      whatsapp: "917506628036",
      expertise: ["Web Development", "Native Android Development", "Java"]
    },
    {
      name: "Yadnesh Bamne",
      img: "yadnesh.jpg",
      linkedin: "yadneshbamne21",
      twitter: "Yadnesh_Bamne",
      whatsapp: "919136747743",
      expertise: ["React", "React-Native", "Flutter"]
    },
    {
      name: "Durva Waghchaure",
      img: "durva3.jpg",
      linkedin: "durva-waghchaure-4793942b9",
      twitter: "durva1102",
      whatsapp: "919029223696",
      expertise: ["Java", "Mentorship", "Problem Solving"]
    },
    {
      name: "Vedant Shinde",
      img: "vedant.jpg",
      github: "Vedants06",
      whatsapp: "918355927151",
      expertise: ["Web Development", "DSA", "UI/UX"]
    },
    {
      name: "Zahid Hamdule",
      img: "zahid.jpg",
      linkedin: "zahid-hamdule-5a198a285",
      whatsapp: "918928989023",
      expertise: ["Content Strategy", "Technical Writing", "Documentation"]
    },
    {
      name: "Abdul Rehman Khan",
      img: "abdul.jpg",
      linkedin: "abdul-rehman-khan-68130328b",
      github: "Abdul-113",
      whatsapp: "917208666971",
      expertise: ["Problem Solving", "DSA"]
    }
  ],
  "2025-2026": [
    {
      name: "Durva Waghchaure",
      img: "durva3.jpg",
      linkedin: "durva-waghchaure-4793942b9",
      twitter: "durva1102",
      whatsapp: "919029223696",
      expertise: ["Java", "Mentorship", "Problem Solving"]
    },
    {
      name: "Sarakshi More",
      img: "sarakshi.jpg",
      linkedin: "sarakshi-m-158212211",
      github: "Sarakshimore",
      whatsapp: "917506628036",
      expertise: ["Web Development", "Native Android Development", "Java"]
    },
    {
      name: "Zahid Hamdule",
      img: "zahid.jpg",
      linkedin: "zahid-hamdule-5a198a285",
      whatsapp: "918928989023",
      expertise: ["Content Strategy", "Technical Writing", "Documentation"]
    },
    {
      name: "Om Date",
      img: "om3.jpeg",
      linkedin: "om-date-552755282",
      whatsapp: "919004003973",
      expertise: ["Mobile Development", "Flutter", "iOS Development"]
    },
    {
      name: "Prakyat Shetty",
      img: "prakhyat3.jpeg",
      linkedin: "prakyat-shetty-50875b365",
      github: "Prakyatshetty-1",
      whatsapp: "919152675401",
      expertise: ["DevOps", "Cloud Computing", "Docker"]
    },
    {
      name: "Saad Ansari",
      img: "saad.jpg",
      whatsapp: "919819392080",
      expertise: ["Data Analysis", "Business Intelligence", "SQL"]
    },
  ]
};

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
    <div className="relative w-full">
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
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
      />
    </div>
  );
};

export default function Educators() {
  const { getToken } = useAuth();
  const [imageUrls, setImageUrls] = useState({});
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedYear, setSelectedYear] = useState("2025-2026");

  const availableYears = Object.keys(educatorsByYear);
  const currentEducators = educatorsByYear[selectedYear];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = await getToken();
        const supabase = await supabaseClient(token);

        let urls = {};
        // Get all unique image names from all years
        const allEducators = Object.values(educatorsByYear).flat();
        for (const educator of allEducators) {
          const { data } = supabase.storage
            .from("team_photos")
            .getPublicUrl(educator.img);
          if (data && data.publicUrl) urls[educator.img] = data.publicUrl;
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

          {/* Year Dropdown */}
          <div className="absolute top-20 right-4 z-20">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[130px] bg-black/20 backdrop-blur-xl border border-primary/20 text-foreground rounded-lg hover:border-primary/40 transition-all duration-300">
                <SelectValue placeholder="Select Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
            <div className="absolute top-0 left-0 size-[500px] rounded-full bg-primary/20 -z-10 blur-[100px]" />
            <div className="absolute bottom-0 right-0 size-[500px] rounded-full bg-blue-500/20 -z-10 blur-[100px]" />
          </div>

          <motion.div
            className="flex flex-col items-center justify-center py-16 px-6 md:px-12 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r mt-16 from-primary to-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Our Educators
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground text-center max-w-2xl mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Meet and connect with our expert educators who are passionate
              about teaching and helping students grow.
            </motion.p>

            <motion.p
              className="text-sm text-muted-foreground/80 text-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Showing educators for Academic Year {selectedYear}
            </motion.p>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={selectedYear} // This ensures re-animation when year changes
            >
              {currentEducators.map(
                ({
                  name,
                  role,
                  img,
                  whatsapp,
                  linkedin,
                  github,
                  twitter,
                  expertise = [],
                }) => (
                  <motion.div
                    key={`${selectedYear}-${name}`}
                    variants={cardVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group relative bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                        <ImageWithSkeleton
                          src={
                            imageUrls[img] ? imageUrls[img] : PLACEHOLDER_IMAGE
                          }
                          alt={name}
                          className="w-full h-full object-cover rounded-full border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-500"
                          onLoad={() =>
                            setLoadedImages((prev) => ({
                              ...prev,
                              [img]: true,
                            }))
                          }
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE;
                            console.log(
                              `Failed to load image for ${name}, using placeholder`
                            );
                          }}
                        />
                      </div>

                      <h3 className="text-xl font-bold mt-4 text-center group-hover:text-primary transition-colors duration-300">
                        {name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 text-center">
                        {role}
                      </p>

                      {/* Expertise Tags */}
                      {expertise && expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center mt-3">
                          {expertise.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-center gap-4 mt-4">
                        {whatsapp && (
                          <motion.a
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            href={`https://wa.me/${whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-500 transition-colors duration-300"
                          >
                            <FontAwesomeIcon
                              icon={faWhatsapp}
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
                            className="transition-colors duration-300"
                          >
                            <FontAwesomeIcon
                              icon={faGithub}
                              className="w-5 h-5"
                            />
                          </motion.a>
                        )}
                        {twitter && (
                          <motion.a
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            href={`https://x.com/${twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-300"
                          >
                            <FontAwesomeIcon
                              icon={faXTwitter}
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