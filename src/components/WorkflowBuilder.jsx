import React, { useState } from 'react';
import { 
  PlusIcon, 
  PlayIcon, 
  TrashIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

export function WorkflowBuilder({ agents, onExecute }) {
  const [steps, setSteps] = useState([]);

  const addStep = (agentId) => {
    setSteps([...steps, { agentId, params: {} }]);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Agents</h2>
        <div className="flex flex-wrap gap-2">
          {agents.map(agent => (
            <button 
              key={agent.id}
              onClick={() => addStep(agent.id)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{agent.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Workflow Steps</h2>
          {steps.length > 0 && (
            <button 
              onClick={() => onExecute({ steps })}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlayIcon className="h-5 w-5" />
              <span>Execute Workflow</span>
            </button>
          )}
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ArrowPathIcon className="h-12 w-12 mx-auto mb-4" />
            <p>Add agents to create a workflow</p>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, index) => {
              const agent = agents.find(a => a.id === step.agentId);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{agent?.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      const newSteps = [...steps];
                      newSteps.splice(index, 1);
                      setSteps(newSteps);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
