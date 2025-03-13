// // import { useState } from "react";
// // import { DataTable } from "@/components/ui/data-table";
// // import { generateStudents } from "@/lib/data";
// // import { GraduationCap } from "lucide-react";
// // import Header from "@/components/header";

// // function Certificates() {
// //   const [students, setStudents] = useState(generateStudents());

// //   const handleStarClick = (studentId, stars) => {
// //     setStudents((prev) =>
// //       prev.map((student) =>
// //         student.id === studentId ? { ...student, stars } : student
// //       )
// //     );
// //   };

// //   return (
// //     <div className="h-auto w-full">
// //         <Header/>
// //       <div className="min-h-screen px-4 sm:px-6 lg:px-8">
// //         <div className="w-full py-8 space-y-8">
// //           <header className="text-center space-y-4 py-8 max-w-4xl mx-auto">
// //             <div className="flex justify-center mb-4">
// //               <GraduationCap className="h-16 w-16 text-white/80" />
// //             </div>
// //             <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
// //               Student Performance Management
// //             </h1>
// //             <p className="text-base sm:text-lg text-gray-400">
// //               Track, evaluate, and recognize student achievements
// //             </p>
// //           </header>

// //           <div className="rounded-lg bg-gray-900/50 border border-gray-800 shadow-2xl overflow-x-auto">
// //             <DataTable data={students} onStarClick={handleStarClick} />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Certificates;


// import { useState } from "react";
// import { DataTable } from "@/components/ui/data-table";
// import { generateStudents } from "@/lib/data";
// import { GraduationCap } from "lucide-react";
// import Header from "@/components/header";
// import { GenerateCertificates } from "@/components/generate-certifictes";// Adjust the import path as needed

// function Certificates() {
//   const [students, setStudents] = useState(generateStudents());

//   const handleStarClick = (studentId, stars) => {
//     setStudents((prev) =>
//       prev.map((student) =>
//         student.id === studentId ? { ...student, stars } : student
//       )
//     );
//   };

//   return (
//     <div className="h-auto w-full">
//       <Header />
//       <div className="min-h-screen px-4 sm:px-6 lg:px-8">
//         <div className="w-full py-8 space-y-8">
//           <header className="text-center space-y-4 py-8 max-w-4xl mx-auto">
//             <div className="flex justify-center mb-4">
//               <GraduationCap className="h-16 w-16 text-white/80" />
//             </div>
//             <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
//               Student Performance Management
//             </h1>
//             <p className="text-base sm:text-lg text-gray-400">
//               Track, evaluate, and recognize student achievements
//             </p>
//           </header>

//           <div className="rounded-lg bg-gray-900/50 border border-gray-800 shadow-2xl overflow-x-auto">
//             <DataTable data={students} onStarClick={handleStarClick} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Certificates;
