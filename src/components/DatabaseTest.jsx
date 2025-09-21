import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient.js';

const DatabaseTest = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [tables, setTables] = useState([]);
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Check connection
      const { data, error } = await supabase.from('assessments').select('count', { count: 'exact', head: true });
      
      if (error) {
        if (error.message.includes('relation "assessments" does not exist')) {
          setStatus('❌ Tables not created yet. Run: supabase db push');
          return;
        }
        throw error;
      }

      setStatus('✅ Connected to Supabase successfully!');
      
      // Test 2: List all tables
      const { data: tableData } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tableData) {
        setTables(tableData.map(t => t.table_name));
      }

      // Test 3: Try to insert test data
      await testInsert();

    } catch (error) {
      console.error('Database test error:', error);
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const testInsert = async () => {
    try {
      // Create a proper UUID for test user
      const testUserId = crypto.randomUUID();
      
      // Test assessment insert
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          user_id: testUserId,
          assessment_data: {
            name: 'Test User',
            age: 22,
            education: 'Bachelor\'s',
            fieldOfStudy: 'Computer Science',
            test: true
          }
        })
        .select();

      if (assessmentError) throw assessmentError;

      setTestData({
        assessment: assessmentData[0],
        message: 'Test data inserted successfully!'
      });

      // Clean up test data
      await supabase
        .from('assessments')
        .delete()
        .eq('user_id', testUserId);

    } catch (error) {
      console.error('Insert test error:', error);
      setTestData({
        error: error.message
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Connection Status:</h3>
          <p className="text-sm">{status}</p>
        </div>

        {tables.length > 0 && (
          <div>
            <h3 className="font-semibold">Available Tables:</h3>
            <ul className="text-sm list-disc list-inside">
              {tables.map(table => (
                <li key={table}>{table}</li>
              ))}
            </ul>
          </div>
        )}

        {testData && (
          <div>
            <h3 className="font-semibold">Insert Test:</h3>
            {testData.error ? (
              <p className="text-red-600 text-sm">❌ {testData.error}</p>
            ) : (
              <div className="text-sm">
                <p className="text-green-600">✅ {testData.message}</p>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
                  {JSON.stringify(testData.assessment, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-800">Setup Instructions:</h3>
          <ol className="text-sm text-blue-700 list-decimal list-inside mt-2 space-y-1">
            <li>Make sure you have Supabase CLI installed: <code>npm install -g supabase</code></li>
            <li>Link your project: <code>supabase link --project-ref vigvurhcoyhtccysuumo</code></li>
            <li>Push the database schema: <code>supabase db push</code></li>
            <li>Refresh this page to test again</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;