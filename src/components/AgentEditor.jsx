import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { 
  CodeBracketIcon, 
  DocumentCheckIcon,
  InformationCircleIcon,
  CommandLineIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AGENT_TYPES = {
  embeddings: {
    name: "Embeddings",
    description: "Create and search text embeddings",
    template: {
      type: "txtai.pipeline.Embeddings",
      params: {
        path: "sentence-transformers/all-MiniLM-L6-v2"
      }
    }
  },
  extractor: {
    name: "Extractor",
    description: "Extract answers from text",
    template: {
      type: "txtai.pipeline.Extractor",
      params: {
        embeddings: "embeddings"
      }
    }
  },
  segmentation: {
    name: "Segmentation",
    description: "Split text into segments",
    template: {
      type: "txtai.pipeline.Segmentation",
      params: {
        sentences: true
      }
    }
  },
  similarity: {
    name: "Similarity",
    description: "Calculate text similarity scores",
    template: {
      type: "txtai.pipeline.Similarity",
      params: {
        embeddings: "embeddings"
      }
    }
  }
};

const MODEL_OPTIONS = [
  { value: "sentence-transformers/all-MiniLM-L6-v2", label: "MiniLM-L6 (Default)" },
  { value: "sentence-transformers/all-mpnet-base-v2", label: "MPNet Base" },
  { value: "sentence-transformers/multi-qa-mpnet-base-dot-v1", label: "Multi-QA MPNet" }
];

export function AgentEditor({ onSave }) {
  const [activeTab, setActiveTab] = useState('visual');
  const [agentType, setAgentType] = useState('embeddings');
  const [name, setName] = useState('');
  const [model, setModel] = useState(MODEL_OPTIONS[0].value);
  const [config, setConfig] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!agentType) newErrors.type = 'Agent type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (activeTab === 'visual') {
      if (!validateForm()) return;

      const agentConfig = {
        name,
        ...AGENT_TYPES[agentType].template,
        params: {
          ...AGENT_TYPES[agentType].template.params,
          ...(agentType === 'embeddings' && { path: model })
        }
      };
      onSave(agentConfig);
    } else {
      try {
        const parsedConfig = JSON.parse(config);
        onSave(parsedConfig);
      } catch (err) {
        setErrors({ json: 'Invalid JSON configuration' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button 
          className={`btn ${activeTab === 'visual' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('visual')}
        >
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Visual Editor</span>
          </div>
        </button>
        <button 
          className={`btn ${activeTab === 'json' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('json')}
        >
          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="h-5 w-5" />
            <span>JSON Editor</span>
          </div>
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CommandLineIcon className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create Agent</h2>
          </div>
          <button 
            onClick={handleSave}
            className="btn btn-primary flex items-center space-x-2"
          >
            <DocumentCheckIcon className="h-5 w-5" />
            <span>Save Agent</span>
          </button>
        </div>

        {activeTab === 'visual' ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="My Custom Agent"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(AGENT_TYPES).map(([type, info]) => (
                  <div
                    key={type}
                    className={`
                      relative rounded-lg border p-4 cursor-pointer
                      ${agentType === type ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'}
                    `}
                    onClick={() => setAgentType(type)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {info.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {agentType === 'embeddings' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="input"
                >
                  {MODEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <InformationCircleIcon className="h-5 w-5" />
                <p>
                  This will create a {AGENT_TYPES[agentType].name.toLowerCase()} agent
                  using the {agentType === 'embeddings' ? 'selected model' : 'default configuration'}.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="400px"
                defaultLanguage="json"
                value={config}
                onChange={(value) => setConfig(value)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16 }
                }}
              />
            </div>
            {errors.json && (
              <p className="mt-2 text-sm text-red-600">{errors.json}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
