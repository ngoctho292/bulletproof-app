'use client';

import { useState } from 'react';

export function ApiConfigTester() {
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState<any>(null);

  const testParsing = () => {
    try {
      const parsedHeaders = JSON.parse(headers);
      const parsedBody = JSON.parse(body);
      
      setResult({
        success: true,
        headers: parsedHeaders,
        body: parsedBody,
        stringified: JSON.stringify(parsedBody, null, 2),
      });
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border shadow-lg rounded-lg p-4 z-50">
      <h3 className="font-bold mb-3">API Config Tester</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium">Headers JSON:</label>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="w-full px-2 py-1 border rounded text-xs font-mono"
            rows={3}
            placeholder='{"Authorization": "Bearer XXX"}'
          />
        </div>

        <div>
          <label className="text-xs font-medium">Body JSON:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-2 py-1 border rounded text-xs font-mono"
            rows={5}
            placeholder='{"personalizations": [...]}'
          />
        </div>

        <button
          onClick={testParsing}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Test Parsing
        </button>

        {result && (
          <div className={`p-3 rounded text-xs ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            {result.success ? (
              <pre className="whitespace-pre-wrap overflow-auto max-h-64">
                {result.stringified}
              </pre>
            ) : (
              <div className="text-red-600">{result.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}