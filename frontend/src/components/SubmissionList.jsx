// import React from 'react'
// import {
//   CheckCircle2,
//   XCircle,
//   Clock,
//   MemoryStick as Memory,
//   Calendar,
// } from "lucide-react";

// const SubmissionList = ({submissions , isLoading}) => {
//     const safeParse = (data)=>{
//         try {
//             return JSON.parse(data);
//         } catch (error) {
//             console.log("Error parsing data", error);
//             return []
//         }
//     }
//     const calculateAverageMemory = (memoryData) =>{
//         const memoryArray = safeParse(memoryData).map((m)=>parseFloat(m.split(" ")[0]));
//         if (memoryArray.length === 0) return 0;
//         return (
//             memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
//         );
//     }

//     // Helper function to calculate average runtime
//     const calculateAverageTime = (timeData) => {
//         const timeArray = safeParse(timeData).map((t) =>
//         parseFloat(t.split(" ")[0])
//         );
//         if (timeArray.length === 0) return 0;
//         return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
//     };

//     // Loading state
//     if (isLoading) {
//         return (
//         <div className="flex justify-center items-center p-8">
//             <span className="loading loading-spinner loading-lg text-primary"></span>
//         </div>
//         );
//     }

//     // No submissions state
//     if (!submissions?.length) {
//         return (
//         <div className="text-center p-8">
//             <div className="text-base-content/70">No submissions yet</div>
//         </div>
//         );
//     }

//   return (
//     <div className="space-y-4">
//       {submissions.map((submission) => {
//         const avgMemory = calculateAverageMemory(submission.memory);
//         const avgTime = calculateAverageTime(submission.time);

//         return (
//           <div
//             key={submission.id}
//             className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow rounded-lg"
//           >
//             <div className="card-body p-4">
//               <div className="flex items-center justify-between">
//                 {/* Left Section: Status and Language */}
//                 <div className="flex items-center gap-4">
//                   {submission.status === "Accepted" ? (
//                     <div className="flex items-center gap-2 text-success">
//                       <CheckCircle2 className="w-6 h-6" />
//                       <span className="font-semibold">Accepted</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2 text-error">
//                       <XCircle className="w-6 h-6" />
//                       <span className="font-semibold">{submission.status}</span>
//                     </div>
//                   )}
//                   <div className="badge badge-neutral">{submission.language}</div>
//                 </div>

//                 {/* Right Section: Runtime, Memory, and Date */}
//                 <div className="flex items-center gap-4 text-base-content/70">
//                   <div className="flex items-center gap-1">
//                     <Clock className="w-4 h-4" />
//                     <span>{avgTime.toFixed(3)} s</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Memory className="w-4 h-4" />
//                     <span>{avgMemory.toFixed(0)} KB</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Calendar className="w-4 h-4" />
//                     <span>
//                       {new Date(submission.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default SubmissionList

import React, { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
  Eye,
} from "lucide-react";
import { useSubmissionStore } from '../store/useSubmissionStore';
import MonacoEditor from "@monaco-editor/react";


const SubmissionList = ({ submissions, isLoading }) => {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const { uniqueSubmission, getSubmissionById } = useSubmissionStore();

  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.log("Error parsing data", error);
      return [];
    }
  };

  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) => parseFloat(m.split(" ")[0]));
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  // Modal open handler
  const handleViewClick = async (submissionId) => {
    setModalLoading(true);
    setShowModal(true);
    try {
      // Get the submission directly from the API call
      const submission = await getSubmissionById(submissionId);
      
      if (!submission) {
        console.error("No submission found");
        handleCloseModal();
        return;
      }

      setSelectedSubmission(submission);
      console.log("Fetched submission:", submission); // Verify the data
      
    } catch (error) {
      console.error("Error in handleViewClick:", error);
      handleCloseModal();
    } finally {
      setModalLoading(false);
    }
  };

  // Modal close handler
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // No submissions state
  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow rounded-lg"
        >
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              {/* Left Section: Status and Language */}
              <div className="flex items-center gap-4">
                {submission.status === "Accepted" ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-semibold">Accepted</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-error">
                    <XCircle className="w-6 h-6" />
                    <span className="font-semibold">{submission.status}</span>
                  </div>
                )}
                <div className="badge badge-neutral">{submission.language}</div>
              </div>

              {/* Right Section: Date and View Button */}
              <div className="flex items-center gap-4 text-base-content/70">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="btn btn-outline btn-sm flex items-center gap-1"
                  onClick={() => handleViewClick(submission.id)}
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-base-100 rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Submitted Code</h2>
            {modalLoading || !selectedSubmission ? (
              <div className="flex justify-center items-center h-40">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <>
                {/* Stats Section */}
                <div className="flex gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-info">
                    <Clock className="w-4 h-4" />
                    <span>
                      Avg. Time: {calculateAverageTime(selectedSubmission.time).toFixed(3)}s
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-info">
                    <Memory className="w-4 h-4" />
                    <span>
                      Avg. Memory: {calculateAverageMemory(selectedSubmission.memory).toFixed(0)}KB
                    </span>
                  </div>
                </div>
                <div className="rounded overflow-hidden max-h-[60vh]">
                  <MonacoEditor
                    height="50vh"
                    defaultLanguage={selectedSubmission.language?.toLowerCase() || "javascript"}
                    value={selectedSubmission.sourceCode}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 16,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;


