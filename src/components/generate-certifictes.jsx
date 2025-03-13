// // import { useRef } from "react";
// // import { Button } from "@/components/ui/button";
// // import { starMessages } from "@/lib/data";
// // import { Star, Award, Download } from "lucide-react";
// // import html2canvas from "html2canvas";
// // import { jsPDF } from "jspdf";

// // export function GenerateCertificates({ student }) {
// //   const certificateRef = useRef(null);

// //   const downloadAsPDF = async () => {
// //     const canvas = await html2canvas(certificateRef.current);
// //     const imgData = canvas.toDataURL("image/png");
// //     const pdf = new jsPDF("landscape");
// //     const imgProps = pdf.getImageProperties(imgData);
// //     const pdfWidth = pdf.internal.pageSize.getWidth();
// //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
// //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
// //     pdf.save(`${student.name}-certificate.pdf`);
// //   };

// //   const downloadAsImage = async () => {
// //     const canvas = await html2canvas(certificateRef.current);
// //     const link = document.createElement("a");
// //     link.download = `${student.name}-certificate.png`;
// //     link.href = canvas.toDataURL();
// //     link.click();
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Certificate Container */}
// //       <div
// //         ref={certificateRef}
// //         className="relative w-[850px] h-[600px] bg-gradient-to-br from-gray-900 to-black p-12 max-md:w-[90vw] max-md:h-[120vw] max-md:p-6"
// //       >
// //         <div className="absolute inset-[12px] border-[8px] border-double border-gray-700 max-md:inset-[6px] max-md:border-[4px]" />
// //         <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center max-md:p-4">
// //           {/* Award Icon */}
// //           <div className="mb-6 max-md:mb-4">
// //             {/* <Award className="h-20 w-20 text-gray-400 max-md:h-12 max-md:w-12" /> */}
// //           </div>

// //           {/* Certificate Content */}
// //           <div className="space-y-6 max-md:space-y-4">
// //             <div>
// //               <h1 className="text-5xl font-serif text-white max-md:text-3xl">
// //                 Certificate of Excellence
// //               </h1>
// //               <div className="h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4 max-md:w-20 max-md:my-2" />
// //             </div>
// //             <p className="text-xl text-gray-300 font-serif max-md:text-lg">
// //               This is to certify that
// //             </p>
// //             <p className="text-4xl font-bold text-white font-serif tracking-wide max-md:text-2xl">
// //               {student.name}
// //             </p>
// //             <p className="text-xl text-gray-300 max-md:text-lg">
// //               has demonstrated exceptional performance in
// //             </p>
// //             <p className="text-2xl text-white font-semibold max-md:text-xl">
// //               {student.department}
// //             </p>

// //             {/* Stars */}
// //             <div className="flex justify-center space-x-2 my-6 max-md:space-x-1 max-md:my-4">
// //               {Array.from({ length: student.stars }).map((_, i) => (
// //                 <Star
// //                   key={i}
// //                   className="h-8 w-8 fill-yellow-400 text-yellow-400 max-md:h-6 max-md:w-6"
// //                 />
// //               ))}
// //             </div>

// //             {/* Star Message */}
// //             <p className="text-lg text-gray-300 italic max-w-2xl mx-auto font-serif max-md:text-base">
// //               {starMessages[student.stars]}
// //             </p>

// //             {/* Issued Date */}
// //             <div className="mt-8 pt-8 border-t border-gray-700 max-md:mt-6 max-md:pt-6">
// //               <p className="text-sm text-gray-400 max-md:text-xs">
// //                 Issued on{" "}
// //                 {new Date().toLocaleDateString("en-US", {
// //                   year: "numeric",
// //                   month: "long",
// //                   day: "numeric",
// //                 })}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Download Buttons */}
// //       <div className="flex justify-center space-x-4">
// //         <Button
// //           onClick={downloadAsPDF}
// //           variant="outline"
// //           className="border-gray-700 text-gray-300 hover:bg-gray-800"
// //         >
// //           <Download className="h-4 w-4 mr-2" />
// //           Download PDF
// //         </Button>
// //         <Button
// //           onClick={downloadAsImage}
// //           variant="outline"
// //           className="border-gray-700 text-gray-300 hover:bg-gray-800"
// //         >
// //           <Download className="h-4 w-4 mr-2" />
// //           Download Image
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }


// import { useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { starMessages } from "@/lib/data";
// import { Star, Download } from "lucide-react";
// import html2canvas from "html2canvas";

// export function GenerateCertificates({ student }) {
//   const certificateRef = useRef(null);

//   const downloadAsPDF = async () => {
//     // Capture the certificate as a canvas
//     const canvas = await html2canvas(certificateRef.current);
//     const imgData = canvas.toDataURL("image/png");

//     // Dynamically import jsPDF to help avoid build-time issues
//     const { jsPDF } = await import("jspdf");
//     const pdf = new jsPDF("landscape");
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`${student.name}-certificate.pdf`);
//   };

//   const downloadAsImage = async () => {
//     const canvas = await html2canvas(certificateRef.current);
//     const link = document.createElement("a");
//     link.download = `${student.name}-certificate.png`;
//     link.href = canvas.toDataURL();
//     link.click();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Certificate Container */}
//       <div
//         ref={certificateRef}
//         className="relative w-[850px] h-[600px] bg-gradient-to-br from-gray-900 to-black p-12 max-md:w-[90vw] max-md:h-[120vw] max-md:p-6"
//       >
//         <div className="absolute inset-[12px] border-[8px] border-double border-gray-700 max-md:inset-[6px] max-md:border-[4px]" />
//         <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center max-md:p-4">
//           {/* Award Icon */}
//           <div className="mb-6 max-md:mb-4">
//             {/* Uncomment if needed:
//             <Award className="h-20 w-20 text-gray-400 max-md:h-12 max-md:w-12" /> */}
//           </div>

//           {/* Certificate Content */}
//           <div className="space-y-6 max-md:space-y-4">
//             <div>
//               <h1 className="text-5xl font-serif text-white max-md:text-3xl">
//                 Certificate of Excellence
//               </h1>
//               <div className="h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-gray-500 to-transparent my-4 max-md:w-20 max-md:my-2" />
//             </div>
//             <p className="text-xl text-gray-300 font-serif max-md:text-lg">
//               This is to certify that
//             </p>
//             <p className="text-4xl font-bold text-white font-serif tracking-wide max-md:text-2xl">
//               {student.name}
//             </p>
//             <p className="text-xl text-gray-300 max-md:text-lg">
//               has demonstrated exceptional performance in
//             </p>
//             <p className="text-2xl text-white font-semibold max-md:text-xl">
//               {student.department}
//             </p>

//             {/* Stars */}
//             <div className="flex justify-center space-x-2 my-6 max-md:space-x-1 max-md:my-4">
//               {Array.from({ length: student.stars }).map((_, i) => (
//                 <Star
//                   key={i}
//                   className="h-8 w-8 fill-yellow-400 text-yellow-400 max-md:h-6 max-md:w-6"
//                 />
//               ))}
//             </div>

//             {/* Star Message */}
//             <p className="text-lg text-gray-300 italic max-w-2xl mx-auto font-serif max-md:text-base">
//               {starMessages[student.stars]}
//             </p>

//             {/* Issued Date */}
//             <div className="mt-8 pt-8 border-t border-gray-700 max-md:mt-6 max-md:pt-6">
//               <p className="text-sm text-gray-400 max-md:text-xs">
//                 Issued on{" "}
//                 {new Date().toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Download Buttons */}
//       <div className="flex justify-center space-x-4">
//         <Button
//           onClick={downloadAsPDF}
//           variant="outline"
//           className="border-gray-700 text-gray-300 hover:bg-gray-800"
//         >
//           <Download className="h-4 w-4 mr-2" />
//           Download PDF
//         </Button>
//         <Button
//           onClick={downloadAsImage}
//           variant="outline"
//           className="border-gray-700 text-gray-300 hover:bg-gray-800"
//         >
//           <Download className="h-4 w-4 mr-2" />
//           Download Image
//         </Button>
//       </div>
//     </div>
//   );
// }
