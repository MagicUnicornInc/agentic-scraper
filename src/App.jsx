import React, { useState, useEffect } from 'react';
import { AgentEditor } from './components/AgentEditor';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { api } from './api';
import { 
  BeakerIcon, 
  CommandLineIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

function App() {
  const [agents, setAgents] = useState([]);
  const [activeTab, setActiveTab] = useState('agents');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await api.getAgents();
      setAgents(response.data);
    } catch (err) {
      setError('Failed to load agents');
    }
  };

  const handleCreateAgent = async (config) => {
    try {
      await api.createAgent(config);
      await loadAgents();
    } catch (err) {
      setError('Failed to create agent');
    }
  };

  const handleExecuteWorkflow = async (workflow) => {
    try {
      const response = await api.executeWorkflow(workflow);
      setResults(response.data);
    } catch (err) {
      setError('Failed to execute workflow');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-8">
          <BeakerIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">txtai Agent Manager</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center space-x-2 text-red-700">
            <ExclamationCircleIcon className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button 
            className={`btn ${activeTab === 'agents' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('agents')}
          >
            <div className="flex items-center space-x-2">
              <CommandLineIcon className="h-5 w-5" />
              <span>Agents</span>
            </div>
          </button>
          <button 
            className={`btn ${activeTab === 'workflows' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('workflows')}
          >
            <div className="flex items-center space-x-2">
              <BeakerIcon className="h-5 w-5" />
              <span>Workflows</span>
            </div>
          </button>
        </div>

        {activeTab === 'agents' && (
          <div className="space-y-6">
            <AgentEditor onSave={handleCreateAgent} />
            
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Agents</h2>
              <div className="space-y-4">
                {agents.map(agent => (
                  <div key={agent.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{agent.name}</h3>
                    <pre className="text-sm bg-white p-4 rounded-md overflow-x-auto">
                      {JSON.stringify(agent.config, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <WorkflowBuilder 
              agents={agents}
              onExecute={handleExecuteWorkflow}
            />
            
            {results && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflow Results</h2>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
