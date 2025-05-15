import React, { useCallback, useMemo } from "react";
import { BookOpen, Code, Lightbulb, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { isAndroid } from "react-device-detect";

// Moved resources outside the component to avoid recreation on each render
const resources = [
	{
		title: "DSA Fundamentals",
		description:
			"Learn the core concepts of data structures and algorithms with our curated resources.",
		icon: BookOpen,
		color: "bg-blue-500/10 dark:bg-blue-500/20",
		textColor: "text-blue-500",
		gradientFrom: "from-blue-500/10",
		gradientTo: "to-blue-600/20",
	},
	{
		title: "Problem Solving",
		description:
			"Enhance your problem-solving skills with our collection of challenges and exercises.",
		icon: Lightbulb,
		color: "bg-amber-500/10 dark:bg-amber-500/20",
		textColor: "text-amber-500",
		gradientFrom: "from-amber-500/10",
		gradientTo: "to-orange-600/20",
	},
	{
		title: "Coding Contests",
		description:
			"Participate in our regular coding contests to test your skills and learn from peers.",
		icon: Code,
		color: "bg-green-500/10 dark:bg-green-500/20",
		textColor: "text-green-500",
		gradientFrom: "from-green-500/10",
		gradientTo: "to-emerald-600/20",
	},
	{
		title: "Mentorship",
		description:
			"Get guidance from experienced seniors and mentors in the field.",
		icon: UserCheck,
		color: "bg-purple-500/10 dark:bg-purple-500/20",
		textColor: "text-purple-500",
		gradientFrom: "from-purple-500/10",
		gradientTo: "to-fuchsia-600/20",
	},
];

// Memoized animation configs to prevent recreation on each render
const hoverAnimation = !isAndroid ? {
	y: -3,
	scale: 1.02,
	transition: { 
		type: "spring",
		stiffness: 900, // Even higher for faster response
		damping: 8, // Lower for snappier motion
		mass: 0.4, // Lower for faster reaction
	} 
} : {};

const buttonHoverAnimation = !isAndroid ? { scale: 1.05 } : {};
const buttonTapAnimation = !isAndroid ? { scale: 0.95 } : {};

const ResourcesSection = () => {
	const navigate = useNavigate();

	// Memoized wrapper components to avoid recreation on every render
	const MotionWrapper = useCallback(({ children, ...props }) => {
		if (isAndroid) {
			return <div className={props.className}>{children}</div>;
		}
		return <motion.div {...props}>{children}</motion.div>;
	}, []);

	const AnimatedArrow = useCallback(() => {
		if (isAndroid) {
			return <ArrowRight className="h-5 w-5" />;
		}
		return (
			<motion.span
				initial={{ x: 0 }}
				animate={{ x: [0, 5, 0] }}
				transition={{
					duration: 1.5,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			>
				<ArrowRight className="h-5 w-5" />
			</motion.span>
		);
	}, []);

	// Memoize resource cards to prevent re-rendering
	const resourceCards = useMemo(() => 
		resources.map((resource, index) => (
			<MotionWrapper
				key={resource.title}
				whileHover={hoverAnimation}
				initial={!isAndroid && { opacity: 0, y: 20 }}
				whileInView={!isAndroid && { opacity: 1, y: 0 }}
				transition={{ duration: 0.2, delay: index * 0.03 }} // Even faster animation, shorter delay
				viewport={{ once: true }}
				className="glass-card p-6 rounded-xl transition-all relative overflow-hidden group cursor-pointer"
			>
				{/* Card background gradient effect */}
				<div
					className={`absolute inset-0 bg-gradient-to-br ${resource.gradientFrom} ${resource.gradientTo} opacity-0 group-hover:opacity-100 transition-all duration-50 rounded-xl`}
				/>

				<div className="relative z-10">
					<div
						className={`size-12 ${resource.color} rounded-lg flex items-center justify-center mb-4 transform transition-all duration-50 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md will-change-transform`}
					>
						<resource.icon
							className={`h-6 w-6 ${resource.textColor} transition-all duration-50 group-hover:scale-110`}
						/>
					</div>
					<h3 className="text-xl font-semibold mb-2 transition-all duration-50 group-hover:translate-x-1 will-change-transform">
						{resource.title}
					</h3>
					<p className="text-muted-foreground mb-4">
						{resource.description}
					</p>
				</div>
			</MotionWrapper>
		)), [MotionWrapper]);

	// Memoize button component
	const actionButton = useMemo(() => (
		<MotionWrapper
			whileHover={buttonHoverAnimation}
			whileTap={buttonTapAnimation}
		>
			<Button
				size="lg"
				className="relative group bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-all duration-300 px-8 shadow-lg shadow-primary/20"
				onClick={() => navigate("/resources")}
			>
				<span className="relative z-10 flex items-center gap-2">
					View All Resources
					<AnimatedArrow />
				</span>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
			</Button>
		</MotionWrapper>
	), [MotionWrapper, AnimatedArrow, navigate]);

	return (
		<section id="resources" className="py-20 relative overflow-hidden">
			{/* Background elements - these don't change, no need to optimize further */}
			<div className="absolute inset-0 w-full h-full">
				{/* Abstract gradient orbs */}
				<div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-gradient-to-r from-blue-500/10 to-primary/5 blur-[80px]" />
				<div className="absolute bottom-[15%] right-[5%] w-[350px] h-[350px] rounded-full bg-gradient-to-r from-purple-500/10 to-fuchsia-500/5 blur-[100px]" />

				{/* Background grid */}
				<div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />

				{/* Animated dots */}
				{!isAndroid && (
					<>
						<motion.div
							className="absolute top-[20%] right-[20%] w-2 h-2 rounded-full bg-primary/30"
							animate={{
								y: [0, -15, 0],
								opacity: [0.3, 0.8, 0.3],
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
						<motion.div
							className="absolute bottom-[30%] left-[15%] w-3 h-3 rounded-full bg-blue-500/30"
							animate={{
								y: [0, 20, 0],
								opacity: [0.2, 0.7, 0.2],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "easeInOut",
								delay: 1,
							}}
						/>
						<motion.div
							className="absolute top-[40%] left-[25%] w-1.5 h-1.5 rounded-full bg-purple-500/40"
							animate={{
								x: [0, 15, 0],
								opacity: [0.2, 0.6, 0.2],
							}}
							transition={{
								duration: 5,
								repeat: Infinity,
								ease: "easeInOut",
								delay: 0.5,
							}}
						/>
					</>
				)}
			</div>

			<div className="container px-4 mx-auto relative z-10">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">
						<span className="text-gradient">Empowering </span> you with
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Access a wealth of learning materials and opportunities to boost your
						coding journey.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{resourceCards}
				</div>

				<div className="mt-16 text-center">
					{actionButton}
				</div>
			</div>
		</section>
	);
};

// Wrap in React.memo to prevent unnecessary re-renders
export default React.memo(ResourcesSection);
