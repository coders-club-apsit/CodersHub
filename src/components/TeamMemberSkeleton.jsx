import { motion } from "framer-motion";

const TeamMemberSkeleton = () => (
  <div className="group relative bg-black/20 backdrop-blur-xl p-6 rounded-xl border border-primary/10">
    <div className="relative z-10">
      <div className="relative">
        <div className="w-32 h-32 mx-auto rounded-full bg-gray-700/50 animate-pulse" />
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="h-6 w-32 bg-gray-700/50 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-5 h-5 bg-gray-700/50 rounded animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

export default TeamMemberSkeleton;