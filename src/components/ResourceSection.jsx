import { BookOpen, Code, Lightbulb, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const resources = [
  {
    title: "DSA Fundamentals",
    description: "Learn the core concepts of data structures and algorithms with our curated resources.",
    icon: BookOpen,
    color: "bg-blue-500/10 dark:bg-blue-500/20",
    textColor: "text-blue-500",
  },
  {
    title: "Problem Solving",
    description: "Enhance your problem-solving skills with our collection of challenges and exercises.",
    icon: Lightbulb,
    color: "bg-amber-500/10 dark:bg-amber-500/20",
    textColor: "text-amber-500",
  },
  {
    title: "Coding Contests",
    description: "Participate in our regular coding contests to test your skills and learn from peers.",
    icon: Code,
    color: "bg-green-500/10 dark:bg-green-500/20",
    textColor: "text-green-500",
  },
  {
    title: "Mentorship",
    description: "Get guidance from experienced seniors and mentors in the field.",
    icon: UserCheck,
    color: "bg-purple-500/10 dark:bg-purple-500/20",
    textColor: "text-purple-500",
  },
];

const ResourcesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="resources" className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 size-[400px] rounded-full bg-transparent" />
      
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-gradient">Empowering </span> you with
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access a wealth of learning materials and opportunities to boost your coding journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <div 
              key={index}
              className="glass-card p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`size-12 ${resource.color} rounded-lg flex items-center justify-center mb-4`}>
                <resource.icon className={`h-6 w-6 ${resource.textColor}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
              <p className="text-muted-foreground mb-4">{resource.description}</p>
              {/* <Button variant="outline" className="w-full">Explore</Button> */}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="relative group bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-all duration-300 px-8"
              onClick={() => navigate('/resources')}
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Resources
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;