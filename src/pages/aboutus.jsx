import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { SideHeader } from "@/components/sidebarhead";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { LucideLinkedin } from "lucide-react";

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
    name: "Abhishek Thormothe",
    role: "Design Head",
    img: "abhiiii.png",
    twitter: "yadneshbamne",
    linkedin: "thormotheabhishek",
  },
  {
    name: "Sarakshi More",
    role: "Community Head",
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
];

export default function AboutUs() {
  const { getToken } = useAuth(); // Get Clerk session token
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = await getToken(); // ✅ Get Clerk token
        const supabase = await supabaseClient(token); // ✅ Pass it to Supabase

        let urls = {};
        for (const member of teamMembers) {
          const { data } = supabase.storage
            .from("team_photos")
            .getPublicUrl(member.img);

          if (data && data.publicUrl) {
            urls[member.img] = data.publicUrl;
          } else {
            console.error(`Failed to fetch URL for ${member.img}`);
          }
        }

        console.log("Fetched Image URLs:", urls);
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [getToken]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-auto flex-col md:flex-row text-white">
        <Sidebar />
        <div className="flex-1">
          <SideHeader />
          <div className="flex flex-col items-center justify-center py-16 px-6 md:px-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-600">
              Coders Club Team
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full max-w-6xl">
              {teamMembers.map(
                ({ name, role, img, twitter, linkedin, github }) => (
                  <div
                    key={name}
                    className="relative white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg flex flex-col items-center text-center border border-white/20 hover:shadow-xl transition"
                  >
                    <img
                      src={imageUrls[img] ?? "/placeholder.jpg"} // ✅ Fallback image
                      alt={name}
                      className="w-32 h-32 rounded-full object-cover border border-white"
                    />
                    <h3 className="text-lg md:text-xl font-bold mt-4">
                      {name}
                    </h3>
                    <p className="text-sm md:text-base opacity-80">{role}</p>
                    <div className="flex gap-4 mt-4">
                      {twitter && (
                        <a
                          href={`https://x.com/${twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon
                            icon={faXTwitter}
                            className="w-6 h-5 text-gray-400 hover:text-white transition"
                          />
                        </a>
                      )}
                      {linkedin && (
                        <a
                          href={`https://www.linkedin.com/in/${linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LucideLinkedin className="w-6 h-5 text-gray-400 hover:text-blue-500 transition" />
                        </a>
                      )}
                      {github && (
                        <a
                          href={`https://github.com/${github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon
                            icon={faGithub}
                            className="w-6 h-5 text-gray-400 hover:text-gray-200 transition"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
