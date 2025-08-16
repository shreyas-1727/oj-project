import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import toast from 'react-hot-toast';
import problemService from '../api/problemService';
import submissionService from '../api/submissionService';
import compilerService from '../api/compilerService';
import aiService from '../api/aiService';
import CodeEditor from '../components/CodeEditor';
import useAuth from '../hooks/useAuth';
import { boilerplate } from '../utils/boilerplate';

const ProblemDetailPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, decrementAiCredits } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(boilerplate.cpp);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customInput, setCustomInput] = useState('');
  const [runOutput, setRunOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const [aiExplanation, setAiExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  const [activeTab, setActiveTab] = useState('input');

  useEffect(() => {
    setCode(boilerplate[language]);
  }, [language]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const data = await problemService.getProblemById(problemId);
        setProblem(data);
      } catch (err) {
        setError('Failed to fetch problem details.');
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    } else {
      setLoading(false);
    }
  }, [problemId]);

  const handleSubmit = async () => {

    if (!isAuthenticated) {
      toast.error("Please log in to submit your solution.");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);
    setRunOutput('');
    setActiveTab('output');

    const submissionPromise = submissionService.createSubmission(problemId, code, language);

    toast.promise(submissionPromise, {
      loading: 'Judging your submission...',
      success: (result) => `Verdict: ${result.status}`,
      error: 'Submission failed!',
    });

    try {
      const submission = await submissionService.createSubmission(problemId, code, language);
      setSubmissionResult(submission);
    } catch (err) {
      setSubmissionResult({
        status: 'Error',
        output: err.response?.data?.message || 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = async () => {

    if (!isAuthenticated) {
      toast.error("Please log in to run your code.");
      navigate('/login');
      return;
    }

    setIsRunning(true);
    setRunOutput('');
    setSubmissionResult(null);
    setActiveTab('output');
    try {
      const result = await compilerService.runCode(language, code, customInput);
      setRunOutput(result.output);
      toast.success("Code executed successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred.';
      setRunOutput(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const handleAiReview = async () => {

    if (!isAuthenticated) {
      toast.error("Please log in to use the AI Code Review.");
      navigate('/login');
      return;
    }

    setIsExplaining(true);
    setAiExplanation('');
    setActiveTab('output');
    try {
      const data = await aiService.explainCode(problem.title, language, code);
      setAiExplanation(data.explanation);
      decrementAiCredits();
    } catch (err) {
      setAiExplanation(err.response?.data?.message || 'Failed to get AI explanation.');
    } finally {
      setIsExplaining(false);
    }
  };

  if (loading) return <div className="text-center mt-10 dark:text-white">Loading problem...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!problem) return null;

  return (
    <PanelGroup direction="horizontal" className="h-[calc(100vh-64px)]">
      {/* Problem Description Panel (Left Side) */}
      <Panel defaultSize={50} minSize={25}>
        <div className="p-4 overflow-y-auto h-full text-gray-700 dark:text-gray-300">

          <button
            onClick={() => navigate('/problems')}
            className="mb-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            &larr; Back to Problems
          </button>

          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{problem.title}</h1>
          <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            }`}>
            {problem.difficulty}
          </div>
          <p className="whitespace-pre-wrap mb-6">{problem.description}</p>

          {problem.inputFormat && (<div className="mb-6"> <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Input Format</h2> <p className="whitespace-pre-wrap">{problem.inputFormat}</p> </div>)}
          {problem.outputFormat && (<div className="mb-6"> <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Output Format</h2> <p className="whitespace-pre-wrap">{problem.outputFormat}</p> </div>)}
          {problem.constraints && (<div className="mb-6"> <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Constraints</h2> <p className="whitespace-pre-wrap">{problem.constraints}</p> </div>)}

          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Examples</h2>
            {problem.testCases.filter((tc) => tc.isSample).map((testCase, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-900 dark:text-white">Example {index + 1}:</p>
                <div className="mt-2 font-mono text-sm text-gray-800 dark:text-gray-400">
                  <p><strong className="font-semibold text-gray-900 dark:text-white">Input:</strong> {testCase.input}</p>
                  <p><strong className="font-semibold text-gray-900 dark:text-white">Output:</strong> {testCase.output}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <PanelResizeHandle className="w-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 active:bg-blue-600" />

      {/* Code Editor and Submission Panel (Right Side) */}
      <Panel defaultSize={50} minSize={25}>
        <PanelGroup direction="vertical">
          <Panel defaultSize={65} minSize={20}>
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code Editor</h3>
                <div className="flex items-center gap-2">
                  <label htmlFor="language-select" className="font-medium text-gray-800 dark:text-gray-200">Language:</label>
                  <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                  </select>
                </div>
              </div>
              <div className="flex-grow min-h-0">
                <CodeEditor language={language} code={code} setCode={setCode} />
              </div>
            </div>
          </Panel>
          <PanelResizeHandle className="h-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 active:bg-blue-600" />
          <Panel defaultSize={35} minSize={10}>
            <div className="p-4 flex flex-col h-full">
              <div className="flex-shrink-0 mb-2 border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => setActiveTab('input')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'input' ? 'border-b-2 border-blue-500 text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  Custom Input
                </button>
                <button onClick={() => setActiveTab('output')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'output' ? 'border-b-2 border-blue-500 text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  Output
                </button>
              </div>
              <div className="flex-grow overflow-y-auto py-2">
                {activeTab === 'input' && (
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter your custom input here..."
                    className="w-full h-full p-2 rounded-md font-mono text-sm bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 resize-none"
                  ></textarea>
                )}
                {activeTab === 'output' && (
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg h-full">
                    {isExplaining && <div className="dark:text-white">Getting AI Code Review...</div>}
                    {aiExplanation && (
                      <div>
                        <h3 className="font-semibold text-lg text-indigo-500 dark:text-indigo-400">🤖 AI Code Review</h3>
                        <div className="prose prose-sm dark:prose-invert mt-2 max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {aiExplanation}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {runOutput && (
                      <div className={aiExplanation ? 'mt-4 border-t border-gray-300 dark:border-gray-600 pt-4' : ''}>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Run Output:</h3>
                        <pre className="bg-gray-800 dark:bg-gray-900 text-white p-2 rounded mt-2 font-mono text-sm whitespace-pre-wrap">{runOutput}</pre>
                      </div>
                    )}
                    {submissionResult && (
                      <div className={runOutput || aiExplanation ? 'mt-4 border-t border-gray-300 dark:border-gray-600 pt-4' : ''}>
                        <h3 className={`font-semibold text-xl mb-2 ${submissionResult.status === 'Accepted' ? 'text-green-500' : 'text-red-500'
                          }`}>
                          {submissionResult.status}
                        </h3>
                        <pre className="bg-gray-800 dark:bg-gray-900 text-white p-2 rounded mt-2 font-mono text-sm whitespace-pre-wrap">
                          {submissionResult.output}
                        </pre>
                      </div>
                    )}
                    {!isRunning && !isSubmitting && !isExplaining && !runOutput && !submissionResult && <div className="text-gray-500">Run code or submit a solution to see output here.</div>}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-4 mt-4 flex-shrink-0">
                <div className="text-right">
                  <button
                    onClick={handleAiReview}
                    disabled={isExplaining || user?.aiCredits <= 0}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    title={user?.aiCredits <= 0 ? "No credits left for today" : `Get AI analysis (${user?.aiCredits} credits left)`}
                  >
                    AI Code Review ({user?.aiCredits})
                  </button>
                  {user?.aiCredits <= 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Resets at {new Date(new Date(user.lastCreditReset).getTime() + 24 * 60 * 60 * 1000).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <button onClick={handleRun} disabled={isRunning} className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400">
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default ProblemDetailPage;