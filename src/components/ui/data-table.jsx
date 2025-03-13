// import { useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Star, Award } from 'lucide-react';
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { GenerateCertificates } from '@/components/generate-certifictes';

// const ITEMS_PER_PAGE = 8;

// export function DataTable({ data, onStarClick }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredData = data.filter(
//     (student) =>
//       student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="w-full space-y-4 overflow-x-auto px-2 sm:px-4">
//       <div className="flex flex-col sm:flex-row items-center justify-between p-4 space-y-2 sm:space-y-0">
//         <Input
//           placeholder="Search by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full sm:max-w-sm bg-gray-800 border-gray-700 text-white"
//         />
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//             disabled={currentPage === 1}
//             className="border-gray-700 text-gray-300 hover:bg-gray-800"
//           >
//             Previous
//           </Button>
//           <span className="text-sm text-gray-400">
//             Page {currentPage} of {totalPages}
//           </span>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
//             disabled={currentPage === totalPages}
//             className="border-gray-700 text-gray-300 hover:bg-gray-800"
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       <div className="rounded-md border border-gray-800 overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="border-gray-800 hover:bg-gray-900/50">
//               <TableHead className="text-gray-400">Name</TableHead>
//               <TableHead className="text-gray-400">Email</TableHead>
//               <TableHead className="text-gray-400">Department</TableHead>
//               <TableHead className="text-gray-400">Performance</TableHead>
//               <TableHead className="text-gray-400">Rating</TableHead>
//               <TableHead className="text-gray-400">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedData.map((student) => (
//               <TableRow key={student.id} className="border-gray-800 hover:bg-gray-900/50">
//                 <TableCell className="font-medium text-gray-200">
//                   {student.name}
//                 </TableCell>
//                 <TableCell className="text-gray-300 break-words max-w-[150px] sm:max-w-none">
//                   {student.email}
//                 </TableCell>
//                 <TableCell className="text-gray-300">{student.department}</TableCell>
//                 <TableCell>
//                   <div className="space-y-1 text-sm text-gray-300">
//                     <div>Attendance: {student.performance.attendance}%</div>
//                     <div>Assignments: {student.performance.assignments}%</div>
//                     <div>Exams: {student.performance.exams}%</div>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex space-x-1">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-5 w-5 cursor-pointer transition-all ${
//                           i < student.stars
//                             ? 'fill-yellow-400 text-yellow-400'
//                             : 'fill-gray-800 text-gray-800 hover:text-gray-600'
//                         }`}
//                         onClick={() => onStarClick(student.id, i + 1)}
//                       />
//                     ))}
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="hover:bg-gray-800"
//                       >
//                         <Award className="h-4 w-4 mr-2" />
//                         Certificate
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-[900px]">
//                       <DialogTitle className="text-lg font-semibold mb-4">
//                         Certificate of Excellence - {student.name}
//                       </DialogTitle>
//                       <GenerateCertificates student={student} />
//                     </DialogContent>
//                   </Dialog>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }