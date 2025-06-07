import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import {
  Play, FileText, MessageSquare, Lightbulb, Bookmark,
  Share2, Clock, ChevronRight, BookOpen, Terminal,
  Code2, Users, ThumbsUp, Home, Check, X,
  ChevronUp, ChevronDown, Loader2, Menu
} from "lucide-react";
import { User, Code, LogOut } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import { useProblemStore } from '../store/useProblemStore';
import { useExecutionStore } from '../store/useExecutionStore';
import { getLanguageId } from '../lib/lang';
import { useSubmissionStore } from '../store/useSubmissionStore';
import SubmissionResults from '../components/Submission';
import SubmissionList from '../components/SubmissionList';
import { useAuthStore } from "../store/useAuthStore";
import { Resizable } from 're-resizable';

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const { submission: submissions, isLoading: isSubmissionLoading,
    getSubmissionForProblem, getSubmissionCountForProblem, submissionCount } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [leftPanelWidth, setLeftPanelWidth] = useState('50%');
  const [rightPanelWidth, setRightPanelWidth] = useState('50%');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [isTestCasePanelOpen, setIsTestCasePanelOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showDescription, setShowDescription] = useState(true);
  const [executionResults, setExecutionResults] = useState(null);

  const { runCode, submitCode, submission, isExecuting } = useExecutionStore();
  const { authUser } = useAuthStore();
  const testCasePanelRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
      setTestCases(problem.testcases?.map(tc => ({
        input: tc.input,
        output: tc.output,
      })) || []);
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = async (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map(tc => tc.input);
      const expected_output = problem.testcases.map(tc => tc.output);

      const executionResults = await runCode(code, language_id, stdin, expected_output, id);
      console.log(executionResults);
      setExecutionResults(executionResults);
      setIsTestCasePanelOpen(true);

      // Scroll to test cases panel if it's not fully visible
      setTimeout(() => {
        testCasePanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 300);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

const handleSubmitCode = async (e) => {
  e.preventDefault();
  try {
    const language_id = getLanguageId(selectedLanguage);
    const stdin = problem.testcases.map(tc => tc.input);
    const expected_output = problem.testcases.map(tc => tc.output);

    await submitCode(code, language_id, stdin, expected_output, id);
    setIsTestCasePanelOpen(true);

    // Scroll to test cases panel if it's not fully visible
    setTimeout(() => {
      testCasePanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 300);
  } catch (error) {
    console.log("Error submitting code", error);
  }
};


  const toggleTestCasePanel = () => {
    setIsTestCasePanelOpen(!isTestCasePanelOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleView = () => {
    setShowDescription(!showDescription);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <div className="mt-2">
              <h1 className="text-xl font-bold">{problem.title}</h1>
              <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
                <Clock className="w-4 h-4" />
                <span>
                  Updated{" "}
                  {new Date(problem.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-base-content/30">•</span>
                <Users className="w-4 h-4" />
                <span>{submissionCount} Submissions</span>
                <span className="text-base-content/30">•</span>
                <button className='btn btn-ghost btn-circle'>
                  <ThumbsUp className="w-4 h-4" />
                </button>

                <button
                  className={`btn btn-ghost btn-circle ${isBookmarked ? "text-primary" : ""
                    }`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="btn btn-ghost btn-circle">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-lg mb-6 mt-7">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(([lang, example], idx) => (
                  <div key={lang} className="bg-base-200 p-6 rounded-xl mb-6 font-mono">
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 text-base font-semibold">
                        Input:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                        {example.input}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 text-base font-semibold">
                        Output:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                        {example.output}
                      </span>
                    </div>
                    {example.explanation && (
                      <div>
                        <div className="text-emerald-300 mb-2 text-base font-semibold">
                          Explanation:
                        </div>
                        <p className="text-base-content/70 text-lg font-sem">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return <SubmissionList submissions={submissions} isLoading={isSubmissionLoading} />;
      case "discussion":
        return <div className="p-4 text-center text-base-content/70">No discussions yet</div>;
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">No hints available</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };


  const renderTestCaseResult = (testCase, index) => {
    if (!submission || !submission.testResults || !submission.testResults[index]) {
      return null;
    }

    const result = submission.testResults[index];
    const isPassed = result.passed;

    return (
      <div className={`flex items-center ml-2 ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
        {isPassed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
        <span className="ml-1 text-sm">{isPassed ? 'Passed' : 'Failed'}</span>
      </div>
    );
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 w-full">
      {/* Navbar */}
      <nav className="navbar bg-base-100 shadow-lg px-4 flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost btn-circle md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/homepage" className="btn btn-ghost btn-circle">
            <Home className="w-5 h-5" />
          </Link>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold hidden md:block">INT_PREP</h1>
        </div>

        <div className="flex gap-2">
          {isMobileView && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={toggleView}
            >
              {showDescription ? <Terminal className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </button>
          )}
          <button
            className={`btn btn-primary btn-sm gap-2 ${isExecuting ? "loading" : ""}`}
            onClick={handleRunCode}
            disabled={isExecuting}
          >
            {!isExecuting ? <Play className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
            <span className="hidden sm:inline">Run</span>
          </button>
          <button className="btn btn-success btn-sm gap-2"
          onClick={handleSubmitCode}
          disabled={isExecuting}>
            <span className="hidden sm:inline">Submit</span>
          </button>
        </div>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                alt="User Avatar"
                className="object-cover"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
          >
            <li>
              <p className="text-base font-semibold">{authUser?.name}</p>
              <hr className="border-gray-200/10" />
            </li>
            <li>
              <Link to="/profile" className="hover:bg-primary hover:text-white">
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Link>
            </li>
            {authUser?.role === "ADMIN" && (
              <li>
                <Link to="/add-problem" className="hover:bg-primary hover:text-white">
                  <Code className="w-4 h-4 mr-1" />
                  Add Problem
                </Link>
              </li>
            )}
            <li>
              <LogoutButton className="hover:bg-primary hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </LogoutButton>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg">
          <div className="tabs tabs-boxed bg-base-200">
            <button
              className={`tab gap-2 ${activeTab === "description" ? "tab-active" : ""}`}
              onClick={() => {
                setActiveTab("description");
                setIsMobileMenuOpen(false);
              }}
            >
              <FileText className="w-4 h-4" />
              Description
            </button>
            <button
              className={`tab gap-2 ${activeTab === "submissions" ? "tab-active" : ""}`}
              onClick={() => {
                setActiveTab("submissions");
                setIsMobileMenuOpen(false);
              }}
            >
              <Code2 className="w-4 h-4" />
              Submissions
            </button>
            <button
              className={`tab gap-2 ${activeTab === "discussion" ? "tab-active" : ""}`}
              onClick={() => {
                setActiveTab("discussion");
                setIsMobileMenuOpen(false);
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Discussion
            </button>
            <button
              className={`tab gap-2 ${activeTab === "hints" ? "tab-active" : ""}`}
              onClick={() => {
                setActiveTab("hints");
                setIsMobileMenuOpen(false);
              }}
            >
              <Lightbulb className="w-4 h-4" />
              Hints
            </button>
          </div>
        </div>
      )}

      <div className="w-full mx-auto px-0 flex flex-col h-[calc(100vh-64px)]">
        {isMobileView ? (
          showDescription ? (
            <div className="card bg-base-100 h-full rounded-none overflow-y-auto">
              <div className="card-body p-4">
                {renderTabContent()}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="card bg-base-100 h-full rounded-none flex flex-col">
                <div className="card-body p-0 h-full flex flex-col">
                  <div className="flex justify-between items-center p-2 border-b border-base-300 bg-base-200">
                    <div className="tabs">
                      <button className="tab tab-active gap-2">
                        <Terminal className="w-4 h-4" />
                        Editor
                      </button>
                    </div>
                    <select
                      className="select select-bordered select-sm w-32"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                    >
                      {Object.keys(problem.codeSnippets || {}).map((lang) => (
                        <option key={lang} value={lang}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <Editor
                      height="100%"
                      language={selectedLanguage.toLowerCase()}
                      theme="vs-dark"
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>

                  {/* Test Cases Panel */}
                  <div
                    ref={testCasePanelRef}
                    className={`border-t border-base-300 transition-all duration-300 ease-in-out ${isTestCasePanelOpen ? 'h-64' : 'h-12'}`}
                  >
                    <div
                      className="flex items-center justify-between p-2 bg-base-200 cursor-pointer"
                      onClick={toggleTestCasePanel}
                    >
                      <div className="font-semibold flex items-center">
                        Test Cases
                        {submission && (
                          <span className="ml-2 text-md font-normal">
                            ({submission.testResults.filter(t => t.passed).length}/{submission.testResults.length} passed)
                          </span>
                        )}
                      </div>
                      <button className="btn btn-ghost btn-md">
                        {isTestCasePanelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>

                    {isTestCasePanelOpen && (
                      <div className="p-4 h-[calc(100%-40px)] overflow-auto">
                        {isExecuting ? (
                          <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="ml-2">Running tests...</span>
                          </div>
                        ) : submission ? (
                          <SubmissionResults submission={submission} />
                        ) : (
                          <>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {testCases.map((_, index) => (
                                <button
                                  key={index}
                                  className={`btn btn-sm ${selectedTestCaseIndex === index ? 'btn-primary' : 'btn-ghost'}`}
                                  onClick={() => setSelectedTestCaseIndex(index)}
                                >
                                  Case {index + 1}
                                  {renderTestCaseResult(testCases[index], index)}
                                </button>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <h4 className="font-bold mb-2">Input</h4>
                                <div className="bg-base-200 p-3 rounded-lg font-mono text-sm whitespace-pre-wrap">
                                  {testCases[selectedTestCaseIndex]?.input}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold mb-2">Expected Output</h4>
                                <div className="bg-base-200 p-3 rounded-lg font-mono text-sm whitespace-pre-wrap">
                                  {testCases[selectedTestCaseIndex]?.output}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-1 overflow-hidden w-full gap-1">
            {/* Left Panel - Problem Description */}
            <Resizable
              defaultSize={{ width: '45%', height: '100%' }}
              minWidth="30%"
              maxWidth="70%"
              enable={{ right: true }}
              onResizeStart={() => setIsResizing(true)}
              onResizeStop={(e, direction, ref, d) => {
                setLeftPanelWidth(`${parseInt(leftPanelWidth) + d.width}px`);
                setRightPanelWidth(`${parseInt(rightPanelWidth) - d.width}px`);
                setIsResizing(false);
              }}
              className={`flex flex-col overflow-hidden transition-all ${isResizing ? 'cursor-col-resize' : ''}`}
            >
              <div className="card bg-base-100 h-full rounded-none border-r border-base-300">
                <div className="card-body p-0 h-full flex flex-col overflow-hidden">
                  <div className="tabs tabs-boxed rounded-none bg-base-200">
                    <button
                      className={`tab gap-2 ${activeTab === "description" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("description")}
                    >
                      <FileText className="w-4 h-4" />
                      Description
                    </button>
                    <button
                      className={`tab gap-2 ${activeTab === "submissions" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("submissions")}
                    >
                      <Code2 className="w-4 h-4" />
                      Submissions
                    </button>
                    <button
                      className={`tab gap-2 ${activeTab === "discussion" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("discussion")}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Discussion
                    </button>
                    <button
                      className={`tab gap-2 ${activeTab === "hints" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("hints")}
                    >
                      <Lightbulb className="w-4 h-4" />
                      Hints
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto flex-1">
                    {renderTabContent()}
                  </div>
                </div>
              </div>
            </Resizable>

            {/* Right Panel - Editor */}
            <div className="flex-1 flex flex-col overflow-hidden w-fit" style={{ width: rightPanelWidth }}>
              <div className="card bg-base-100 h-full rounded-none flex flex-col">
                <div className="card-body p-0 h-full flex flex-col">
                  <div className="flex justify-between items-center p-2 border-b border-base-300 bg-base-200">
                    <div className="tabs">
                      <button className="tab tab-active gap-2">
                        <Terminal className="w-4 h-4" />
                        Editor
                      </button>
                    </div>
                    <select
                      className="select select-bordered select-sm w-40"
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                    >
                      {Object.keys(problem.codeSnippets || {}).map((lang) => (
                        <option key={lang} value={lang}>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <Editor
                      height="100%"
                      language={selectedLanguage.toLowerCase()}
                      theme="vs-dark"
                      value={code}
                      onChange={(value) => setCode(value || "")}
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

                  {/* Test Cases Panel */}
                  <div
                    ref={testCasePanelRef}
                    className={`border-t border-base-300 transition-all duration-300 ease-in-out ${isTestCasePanelOpen ? 'h-64' : 'h-12'}`}
                  >
                    <div
                      className="flex items-center justify-between p-2 bg-base-200 cursor-pointer"
                      onClick={toggleTestCasePanel}
                    >
                      <div className="font-semibold flex items-center">
                        Test Cases
                          {submission && Array.isArray(submission.testResults) && (
                            <span className="ml-2 text-sm font-normal">
                              ({submission.testResults.filter(t => t.passed).length}/{submission.testResults.length} passed)
                            </span>
                          )}
                      </div>
                      <button className="btn btn-ghost btn-sm">
                        {isTestCasePanelOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>

                    {isTestCasePanelOpen && (
                      <div className="p-4 h-[calc(100%-40px)] overflow-auto">
                        {isExecuting ? (
                          <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="ml-2">Running tests...</span>
                          </div>
                        ) : submission ? (
                          <SubmissionResults submission={submission} />
                        ) : (
                          <>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {testCases.map((_, index) => (
                                <button
                                  key={index}
                                  className={`btn btn-sm ${selectedTestCaseIndex === index ? 'btn-primary' : 'btn-ghost'}`}
                                  onClick={() => setSelectedTestCaseIndex(index)}
                                >
                                  Case {index + 1}
                                  {renderTestCaseResult(testCases[index], index)}
                                </button>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-bold mb-2">Input</h4>
                                <div className="bg-base-200 p-3 rounded-lg font-mono text-sm whitespace-pre-wrap">
                                  {testCases[selectedTestCaseIndex]?.input}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold mb-2">Expected Output</h4>
                                <div className="bg-base-200 p-3 rounded-lg font-mono text-sm whitespace-pre-wrap">
                                  {testCases[selectedTestCaseIndex]?.output}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold mb-2">Actual Output</h4>
                                <div className="bg-base-200 p-3 rounded-lg font-mono text-sm whitespace-pre-wrap">
                                  
                                        {executionResults?.results?.find(
                                          (result) => result.testCase === selectedTestCaseIndex + 1
                                        )?.stdout || "Not executed yet"}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
