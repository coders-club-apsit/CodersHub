

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Expand, PanelLeftClose, BookOpen, Clock, Calendar, Share2, Bookmark } from "lucide-react"
import { motion } from "framer-motion"
import { isAndroid } from "react-device-detect"
import Header from "./header"

const blogData = {
  1: {
    title: "SQL Basics",
    content1: `Dive into the fundamentals of Database Management Systems (DBMS) with this beginner-friendly and visually enriched SQL Basics Cheat Sheet. This guide covers everything from what a database is, why DBMS is important, the complete architecture, ER diagrams, keys, relational models, normalization, and much more — all without diving into SQL code or queries. `,
    content2: `Dive into the fundamentals of Database Management Systems (DBMS) with this beginner-friendly and visually enriched SQL Basics Cheat Sheet. This guide covers everything from what a database is, why DBMS is important, the complete architecture, ER diagrams, keys, relational models, normalization, and much more — all without diving into SQL code or queries. `,
    content3: `Dive into the fundamentals of Database Management Systems (DBMS) with this beginner-friendly and visually enriched SQL Basics Cheat Sheet. This guide covers everything from what a database is, why DBMS is important, the complete architecture, ER diagrams, keys, relational models, normalization, and much more — all without diving into SQL code or queries. `,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-cuPjYe2buqNPyPPi3j_8-P72Fbc8KiE1KA&s",
    author: "Ravi Sharma",
    date: "May 4, 2025",
    readTime: "8 min read",
    useCase: `Modern web applications like e-commerce platforms use DBMS to store and manage user data, product catalogs, order history, and inventory in a structured way, allowing efficient queries and scalability.`,
  },
  2: {
    title: "Java OOPs Concepts",
    content1: `Understand the core of Object-Oriented Programming in Java including inheritance, encapsulation, polymorphism, and abstraction with easy-to-follow examples and diagrams.`,
    content2: `Java's OOP principles provide a foundation for building robust, maintainable software systems. By organizing code into objects that model real-world entities, developers can create more intuitive and flexible applications.`,
    content3: `Java's OOP principles provide a foundation for building robust, maintainable software systems. By organizing code into objects that model real-world entities, developers can create more intuitive and flexible applications.`,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-cuPjYe2buqNPyPPi3j_8-P72Fbc8KiE1KA&s",
    author: "Aditi Verma",
    date: "May 2, 2025",
    readTime: "10 min read",
    useCase: `Banking systems use Java's OOP concepts to model accounts, users, transactions, and services as objects—helping them scale securely while promoting maintainability and modular design.`,
  },
}

const MainBlog = () => {
  const { id } = useParams()
  const blog = blogData[id]

  const [mode, setMode] = useState(() => localStorage.getItem("readingMode") || "compact")
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    localStorage.setItem("readingMode", mode)
  }, [mode])

  const toggleMode = () => {
    setMode((prev) => (prev === "compact" ? "expanded" : "compact"))
  }

  if (!blog) {
    return <div className="p-6 text-red-500">Blog not found</div>
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f13] to-[#121218] text-white px-4 md:px-20 py-10 mt-24">
        <div
          className={`w-full mx-auto transition-all duration-500 ease-in-out ${
            mode === "compact" ? "max-w-3xl" : "max-w-7xl"
          }`}
        >
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={!isAndroid && { opacity: 0, x: -20 }}
              animate={!isAndroid && { opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4"
            >
              <Link
                to="/Blog"
                className="group flex items-center gap-2 text-blue-300 hover:text-blue-400 transition-all"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Blog</span>
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center gap-3">
              <motion.div
                whileTap={!isAndroid && { scale: 0.95 }}
                whileHover={!isAndroid && { scale: 1.05 }}
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-white/70"}`} />
              </motion.div>

              <motion.div
                whileTap={!isAndroid && { scale: 0.95 }}
                whileHover={!isAndroid && { scale: 1.05 }}
                className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
              >
                <Share2 className="w-4 h-4 text-white/70" />
              </motion.div>

              <motion.div
                whileTap={!isAndroid && { scale: 0.95 }}
                whileHover={!isAndroid && { scale: 1.05 }}
                onClick={toggleMode}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border transition-all duration-300
                ${
                  mode === "compact"
                    ? "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30"
                    : "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/30"
                }`}
              >
                {mode === "compact" ? <Expand className="w-4 h-4 rotate-90" /> : <PanelLeftClose className="w-4 h-4" />}
                <span className="text-sm font-medium">{mode === "compact" ? "Full Width" : "Compact"}</span>
              </motion.div>
            </div>
          </div>

          {/* Title & Meta */}
          <motion.div
            initial={!isAndroid && { opacity: 0, y: 20 }}
            animate={!isAndroid && { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                  <div className="h-full w-full rounded-full bg-[#0a0a12] flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-300" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">By {blog.author}</p>
                  <p className="text-xs text-white/50">Author</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{blog.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </motion.div>

          {/* About this Blog Section with content1, separator, and content2 */}
          <motion.div
            initial={!isAndroid && { opacity: 0, y: 20 }}
            animate={!isAndroid && { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-gradient-to-br from-[#1c1c24] to-[#252532] p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2a2a3a] mb-8 overflow-hidden"
          >
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6 ">
              About this Blog
            </h2>

            {/* First section - content1 with image on right */}
            <div className="text-lg leading-relaxed text-gray-300 mb-6 clearfix">
              <img
                src={blog.icon || "/placeholder.svg"}
                alt="Blog Visual"
                className="float-right ml-6 mb-4 w-1/3 max-h-[200px] object-cover rounded-xl border border-[#2a2a3a] shadow-lg"
              />
              <p>
                {blog.content1}
              </p>
            </div>

            {/* Second section - content2 with image on left */}
            <div className="text-lg leading-relaxed text-gray-300 mb-6 clearfix">
              <img
                src={blog.icon || "/placeholder.svg"}
                alt="Blog Visual"
                className="float-left mr-6 mb-4 w-1/3 max-h-[200px] object-cover rounded-xl border border-[#2a2a3a] shadow-lg"
              />
              <p>{blog.content2}</p>
            </div>
            <div className="text-lg leading-relaxed text-gray-300 mb-6 clearfix">
              <img
                src={blog.icon || "/placeholder.svg"}
                alt="Blog Visual"
                className="float-right ml-6 mb-4 w-1/3 max-h-[200px] object-cover rounded-xl border border-[#2a2a3a] shadow-lg"
              />
              <p>
                {blog.content3}
              </p>
            </div>
          </motion.div>

          {/* Use Case */}
          {blog.useCase && (
            <motion.div
              initial={!isAndroid && { opacity: 0, y: 20 }}
              animate={!isAndroid && { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative bg-gradient-to-br from-[#1a1a24] to-[#222230] p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2a2a3a] overflow-hidden"
            >
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-6 relative">
                Real-World Use Case
              </h2>
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-teal-500 rounded-full"></div>
                <p className="text-gray-200 leading-relaxed text-lg pl-4 italic">{blog.useCase}</p>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={!isAndroid && { opacity: 0, y: 20 }}
            animate={!isAndroid && { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
              <span className="text-sm text-white/70">Thanks for reading</span>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default MainBlog
