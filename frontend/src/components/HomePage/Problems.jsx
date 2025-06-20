import React, { useState, useMemo, useEffect } from 'react'
import { useAuthStore } from "../../store/useAuthStore"
import { Link } from "react-router-dom"
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus, Loader2 } from "lucide-react";
import { useAction } from '../../store/useAction';
import { useProblemStore } from '../../store/useProblemStore';
import { useThemeContext } from '../../context/Theme';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import CreatePlaylistModal from '../CreatePlaylistModal';
import AddToPlaylist from '../AddToPlaylist';

function CompanyTagSelect({ allCompanyTags, selectedCompany, setSelectedCompany, isDarkMode }) {
  return (
    <select
      className={`select select-bordered ${isDarkMode ? 'bg-gray-800 text-white border-gray-600 hover:border-gray-500 focus:border-gray-500' : 'bg-white text-black border-gray-300 hover:border-gray-400 focus:border-gray-400'}`}
      value={selectedCompany}
      onChange={(e) => setSelectedCompany(e.target.value)}
    >
      <option value="ALL">All Companies</option>
      {allCompanyTags.map((company) => (
        <option key={company} value={company}>
          {company}
        </option>
      ))}
    </select>
  );
}

const ProblemTable = () => {
  const { mode } = useThemeContext();
  const isDarkMode = mode === 'dark';

  const { authUser } = useAuthStore();
  const { onDeleteProblem, isDeletingProblem } = useAction();
  
  // Get problems from the store
  const { problems, getAllProblems, isLoading } = useProblemStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  // Fetch problems when component mounts
  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  console.log(problems)

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();

    problems.forEach((problem) => {
      problem.tags.forEach((tag) => {
        tagsSet.add(tag);
      });
    });
    return Array.from(tagsSet);
  }, [problems])

  const allCompanyTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();

    problems.forEach((problem) => {
      problem.companyTag.forEach((tag) => {
        tagsSet.add(tag);
      });
    });
    return Array.from(tagsSet);
  }, [problems])

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) => problem.title.toLowerCase().includes(search.toLowerCase()))
      .filter((problem) => difficulty === "ALL" || problem.difficulty === difficulty)
      .filter((problem) => selectedTag === "ALL" || problem.tags.includes(selectedTag))
      .filter((problem) => selectedCompany === "ALL" || problem.companyTag.includes(selectedCompany));
  }, [problems, search, difficulty, selectedTag, selectedCompany]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredProblems, currentPage])

  const difficulties = ["EASY", "MEDIUM", "HARD"]

  const handleDelete = (id) => {
    onDeleteProblem(id);
  }

    const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  }


  const handleCreatePlaylist = async (playlistData) => {
    await createPlaylist(playlistData);
    setIsCreateModalOpen(false);
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`w-full max-w-6xl mx-auto mt-10 flex justify-center items-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading problems...</span>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-6xl mx-auto mt-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      
      {/* Motivational Section */}
      <div className={`mb-8 p-6 rounded-lg text-center ${
        isDarkMode 
          ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-gray-700' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200'
      }`}>
        <div className={`text-2xl font-bold mb-3 ${
          isDarkMode ? 'text-blue-300' : 'text-blue-600'
        }`}>
          🚀 Ready to Level Up Your Skills?
        </div>
        <p className={`text-lg mb-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Every expert was once a beginner. Start your journey today and turn challenges into victories!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
            isDarkMode 
              ? 'bg-green-900/40 text-green-300' 
              : 'bg-green-100 text-green-700'
          }`}>
            <span className="font-semibold">💪</span>
            <span>Build Problem-Solving Skills</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
            isDarkMode 
              ? 'bg-purple-900/40 text-purple-300' 
              : 'bg-purple-100 text-purple-700'
          }`}>
            <span className="font-semibold">🎯</span>
            <span>Practice Makes Perfect</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
            isDarkMode 
              ? 'bg-orange-900/40 text-orange-300' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            <span className="font-semibold">🔥</span>
            <span>Keep Your Streak Going</span>
          </div>
        </div>
        <div className={`mt-4 text-sm italic ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          "The only way to do great work is to love what you do." - Start solving now!
        </div>
      </div>
      
      {/* Header with Create Playlist Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Problems</h2>
        <button
          className="btn btn-primary gap-2"
          onClick={() => { setIsCreateModalOpen(true); }}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button>
      </div>
      {/* Filter Controls */}
      <div className='flex flex-wrap justify-between items-center mb-6 gap-4'>
        <input
          type="text"
          placeholder="Search by title"
          className={`input input-bordered w-full md:w-1/3 ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400 hover:border-gray-500 focus:border-gray-500' 
              : 'bg-white text-black border-gray-300 placeholder-gray-500 hover:border-gray-400 focus:border-gray-400'
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select
          className={`select select-bordered ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-600 hover:border-gray-500 focus:border-gray-500' 
              : 'bg-white text-black border-gray-300 hover:border-gray-400 focus:border-gray-400'
          }`}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <select
          className={`select select-bordered ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-600 hover:border-gray-500 focus:border-gray-500' 
              : 'bg-white text-black border-gray-300 hover:border-gray-400 focus:border-gray-400'
          }`}
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <CompanyTagSelect
          allCompanyTags={allCompanyTags}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-xl shadow-md'>
        <table className={`table table-lg w-full ${
          isDarkMode 
            ? 'bg-gray-900 text-white' 
            : 'bg-white text-black'
        }`}>
          <thead className={`${
            isDarkMode 
              ? 'bg-gray-800 text-gray-300' 
              : 'bg-gray-100 text-gray-900'
          }`}>
            <tr>
              <th className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Solved</th>
              <th className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Title</th>
              <th className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Tags</th>
              <th className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Difficulty</th>
              <th className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              paginatedProblems.length > 0 ? (
                paginatedProblems.map((problem, index) => {
                  const isSolved = problem.solvedBy.some(
                    (user) => user.userId === authUser?.id
                  );
                  return (
                    <tr 
                      key={problem.id} 
                      className={`${
                        isDarkMode 
                          ? `${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} hover:bg-gray-700 border-gray-700` 
                          : `${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 border-gray-200`
                      } border-b`}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={isSolved}
                          readOnly
                          className={`checkbox checkbox-sm ${
                            isDarkMode 
                              ? 'checkbox-success border-gray-600 [--chkbg:theme(colors.green.600)] [--chkfg:white]' 
                              : 'checkbox-success'
                          }`}
                        />
                      </td>
                      <td>
                        <Link 
                          to={`/problem/${problem.id}`} 
                          className={`font-semibold hover:underline ${
                            isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {(problem.tags || []).map((tag, idx) => (
                            <span
                              key={idx}
                              className={`badge badge-outline text-xs font-bold ${
                                isDarkMode 
                                  ? 'badge-warning text-yellow-300 border-yellow-500' 
                                  : 'badge-warning text-yellow-800 border-yellow-500'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge font-semibold text-xs text-white ${
                            problem.difficulty === "EASY"
                              ? "badge-success"
                              : problem.difficulty === "MEDIUM"
                                ? "badge-warning"
                                : "badge-error"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                          {authUser?.role === "ADMIN" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => { handleDelete(problem.id) }}
                                className="btn btn-sm btn-error hover:btn-error"
                              >
                                {
                                  isDeletingProblem ? 
                                    <Loader2 className="w-4 h-4 text-white animate-spin" /> : 
                                    <TrashIcon className="w-4 h-4 text-white" />
                                }
                              </button>
                              <button 
                                disabled 
                                className={`btn btn-sm ${
                                  isDarkMode 
                                    ? 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600 hover:border-yellow-700' 
                                    : 'btn-warning hover:btn-warning'
                                }`}
                              >
                                <PencilIcon className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                              </button>
                            </div>
                          )}
                          <button
                            className={`btn btn-sm btn-outline flex gap-2 items-center ${
                              isDarkMode 
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:text-white' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                            }`}
                            onClick={() => handleAddToPlaylist(problem.id)}
                          >
                            <Bookmark className="w-4 h-4" />
                            <span className="hidden sm:inline">Save to Playlist</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })) : (
                <tr>
                  <td colSpan={5} className={`text-center py-6 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No problems found.
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className={`btn btn-sm ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500' 
              : 'bg-white text-black border-gray-300 hover:bg-gray-100'
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className={`btn btn-ghost btn-sm ${
          isDarkMode ? 'text-white hover:bg-gray-800' : 'text-black'
        }`}>
          {currentPage} / {totalPages}
        </span>
        <button
          className={`btn btn-sm ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500' 
              : 'bg-white text-black border-gray-300 hover:bg-gray-100'
          }`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>


      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AddToPlaylist
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  )
}

export default ProblemTable