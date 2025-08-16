import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, code, setCode }) => {
  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <Editor
      height="60vh"
      language={language || "javascript"}
      theme="vs-dark"
      value={code}
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;