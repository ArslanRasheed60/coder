import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { useToast } from "../../contexts/toast";

type APIProvider = "openai" | "gemini" | "anthropic";

type AIModel = {
  id: string;
  name: string;
  description: string;
  badge?: string;
  isThinking?: boolean;
};

type ModelCategory = {
  key: 'extractionModel' | 'solutionModel' | 'debuggingModel';
  title: string;
  description: string;
  openaiModels: AIModel[];
  geminiModels: AIModel[];
  anthropicModels: AIModel[];
};

// Define available models for each category
const modelCategories: ModelCategory[] = [
  {
    key: 'extractionModel',
    title: 'Problem Extraction',
    description: 'Model used to analyze screenshots and extract problem details (requires Vision)',
    openaiModels: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        description: "Best balance of speed and vision accuracy for extracting problem requirements",
        badge: "Vision • Recommended"
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        description: "Fast, cost-effective vision model for problem extraction",
        badge: "Vision • Fast"
      },
      {
        id: "o1",
        name: "o1",
        description: "Flagship thinking model with vision capabilities for intricate problem diagrams",
        badge: "Thinking • Vision",
        isThinking: true
      },
      {
        id: "gpt-4.5-preview",
        name: "GPT-4.5 Preview",
        description: "OpenAI's largest & most advanced general knowledge model with vision",
        badge: "Vision • Advanced"
      },
      {
        id: "chatgpt-4o-latest",
        name: "ChatGPT-4o Latest",
        description: "Dynamic model continuously updated with ChatGPT's latest vision improvements",
        badge: "Vision • Dynamic"
      },
      {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        description: "Previous-generation high-capability vision model",
        badge: "Vision"
      },
      {
        id: "gpt-4.1",
        name: "GPT-4.1",
        description: "High-intelligence multimodal model for visual analysis",
        badge: "Vision"
      },
      {
        id: "gpt-4.1-mini",
        name: "GPT-4.1 Mini",
        description: "Fast, lightweight multimodal model for visual extraction",
        badge: "Vision • Fast"
      }
    ],
    geminiModels: [
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Best overall performance for problem extraction"
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Faster, more cost-effective option"
      }
    ],
    anthropicModels: [
      {
        id: "claude-3-7-sonnet-20250219",
        name: "Claude 3.7 Sonnet",
        description: "Best overall performance for problem extraction"
      },
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        description: "Balanced performance and speed"
      },
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        description: "Top-level intelligence, fluency, and understanding"
      }
    ]
  },
  {
    key: 'solutionModel',
    title: 'Solution Generation',
    description: 'Model used to generate optimal coding solutions and explanations',
    openaiModels: [
      {
        id: "o3-mini",
        name: "o3-mini",
        description: "State-of-the-art fast reasoning model specialized for coding & algorithms",
        badge: "Thinking • Recommended",
        isThinking: true
      },
      {
        id: "o1",
        name: "o1",
        description: "Flagship deep reasoning model for complex algorithmic puzzles and edge cases",
        badge: "Deep Thinking",
        isThinking: true
      },
      {
        id: "o1-mini",
        name: "o1-mini",
        description: "Fast, cost-effective reasoning model tailored for math and coding",
        badge: "Thinking • Fast",
        isThinking: true
      },
      {
        id: "o1-preview",
        name: "o1-preview",
        description: "Original preview reasoning model",
        badge: "Thinking",
        isThinking: true
      },
      {
        id: "gpt-4.5-preview",
        name: "GPT-4.5 Preview",
        description: "OpenAI's largest model - supreme code quality, explanations, and steerability",
        badge: "Advanced"
      },
      {
        id: "gpt-4o",
        name: "GPT-4o",
        description: "Flagship omni model - fast execution, reliable coding patterns",
        badge: "Fast & Strong"
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        description: "Lightweight and fast option for straightforward coding problems",
        badge: "Fast"
      },
      {
        id: "chatgpt-4o-latest",
        name: "ChatGPT-4o Latest",
        description: "Reflects the latest conversational & coding improvements from ChatGPT",
        badge: "Dynamic"
      },
      {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        description: "High-capacity standard GPT-4 Turbo model",
        badge: "High Capacity"
      },
      {
        id: "gpt-4",
        name: "GPT-4",
        description: "Standard legacy GPT-4 model",
        badge: "Standard"
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        description: "Legacy fast, budget-friendly text model",
        badge: "Legacy"
      },
      {
        id: "gpt-4.1",
        name: "GPT-4.1",
        description: "High intelligence for coding and detailed explanations",
        badge: "Fast & Strong"
      },
      {
        id: "gpt-4.1-mini",
        name: "GPT-4.1 Mini",
        description: "Fast and cost-effective option for code generation",
        badge: "Fast"
      }
    ],
    geminiModels: [
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Strong overall performance for coding tasks"
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Faster, more cost-effective option"
      }
    ],
    anthropicModels: [
      {
        id: "claude-3-7-sonnet-20250219",
        name: "Claude 3.7 Sonnet",
        description: "Strong overall performance for coding tasks"
      },
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        description: "Balanced performance and speed"
      },
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        description: "Top-level intelligence, fluency, and understanding"
      }
    ]
  },
  {
    key: 'debuggingModel',
    title: 'Debugging',
    description: 'Model used to debug and improve solutions from error screenshots (requires Vision)',
    openaiModels: [
      {
        id: "o1",
        name: "o1",
        description: "Flagship reasoning model with vision - deep reasoning to identify elusive bugs & test failures",
        badge: "Thinking • Vision",
        isThinking: true
      },
      {
        id: "gpt-4o",
        name: "GPT-4o",
        description: "Best for rapidly analyzing screenshots of error messages, terminal output, and code",
        badge: "Vision • Recommended"
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        description: "Faster, cost-effective option for analyzing debug screenshots",
        badge: "Vision • Fast"
      },
      {
        id: "gpt-4.5-preview",
        name: "GPT-4.5 Preview",
        description: "Advanced visual code inspection and comprehensive error corrections",
        badge: "Vision • Advanced"
      },
      {
        id: "chatgpt-4o-latest",
        name: "ChatGPT-4o Latest",
        description: "Latest ChatGPT vision model for debugging code and errors",
        badge: "Vision • Dynamic"
      },
      {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        description: "GPT-4 Turbo with Vision for visual code debugging",
        badge: "Vision"
      },
      {
        id: "gpt-4.1",
        name: "GPT-4.1",
        description: "Best for analyzing code and visual error messages",
        badge: "Vision"
      },
      {
        id: "gpt-4.1-mini",
        name: "GPT-4.1 Mini",
        description: "Faster, more cost-effective option for debugging",
        badge: "Vision • Fast"
      }
    ],
    geminiModels: [
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        description: "Best for analyzing code and error messages"
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Faster, more cost-effective option"
      }
    ],
    anthropicModels: [
      {
        id: "claude-3-7-sonnet-20250219",
        name: "Claude 3.7 Sonnet",
        description: "Best for analyzing code and error messages"
      },
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        description: "Balanced performance and speed"
      },
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        description: "Top-level intelligence, fluency, and understanding"
      }
    ]
  }
];

interface SettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ open: externalOpen, onOpenChange }: SettingsDialogProps) {
  const [open, setOpen] = useState(externalOpen || false);
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState<APIProvider>("openai");
  const [extractionModel, setExtractionModel] = useState("gpt-4o");
  const [solutionModel, setSolutionModel] = useState("o3-mini");
  const [debuggingModel, setDebuggingModel] = useState("gpt-4o");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Sync with external open state
  useEffect(() => {
    if (externalOpen !== undefined) {
      setOpen(externalOpen);
    }
  }, [externalOpen]);

  // Handle open state changes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Only call onOpenChange when there's actually a change
    if (onOpenChange && newOpen !== externalOpen) {
      onOpenChange(newOpen);
    }
  };
  
  // Load current config on dialog open
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      interface Config {
        apiKey?: string;
        apiProvider?: APIProvider;
        extractionModel?: string;
        solutionModel?: string;
        debuggingModel?: string;
      }

      window.electronAPI
        .getConfig()
        .then((config: Config) => {
          setApiKey(config.apiKey || "");
          setApiProvider(config.apiProvider || "openai");
          setExtractionModel(config.extractionModel || "gpt-4o");
          setSolutionModel(config.solutionModel || "o3-mini");
          setDebuggingModel(config.debuggingModel || "gpt-4o");
        })
        .catch((error: unknown) => {
          console.error("Failed to load config:", error);
          showToast("Error", "Failed to load settings", "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, showToast]);

  // Handle API provider change
  const handleProviderChange = (provider: APIProvider) => {
    setApiProvider(provider);
    
    // Reset models to defaults when changing provider
    if (provider === "openai") {
      setExtractionModel("gpt-4o");
      setSolutionModel("o3-mini");
      setDebuggingModel("gpt-4o");
    } else if (provider === "gemini") {
      setExtractionModel("gemini-1.5-pro");
      setSolutionModel("gemini-1.5-pro");
      setDebuggingModel("gemini-1.5-pro");
    } else if (provider === "anthropic") {
      setExtractionModel("claude-3-7-sonnet-20250219");
      setSolutionModel("claude-3-7-sonnet-20250219");
      setDebuggingModel("claude-3-7-sonnet-20250219");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.updateConfig({
        apiKey,
        apiProvider,
        extractionModel,
        solutionModel,
        debuggingModel,
      });
      
      if (result) {
        showToast("Success", "Settings saved successfully", "success");
        handleOpenChange(false);
        
        // Force reload the app to apply the API key
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      showToast("Error", "Failed to save settings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Mask API key for display
  const maskApiKey = (key: string) => {
    if (!key || key.length < 10) return "";
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  // Open external link handler
  const openExternalLink = (url: string) => {
    window.electronAPI.openLink(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md bg-black border border-white/10 text-white settings-dialog"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(450px, 90vw)',
          height: 'auto',
          minHeight: '400px',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 9999,
          margin: 0,
          padding: '20px',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          animation: 'fadeIn 0.25s ease forwards',
          opacity: 0.98
        }}
      >        
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription className="text-white/70">
            Configure your API key and model preferences. You'll need your own API key to use this application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* API Provider Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">API Provider</label>
            <div className="flex gap-2">
              <div
                className={`flex-1 p-2 rounded-lg cursor-pointer transition-colors ${
                  apiProvider === "openai"
                    ? "bg-white/10 border border-white/20"
                    : "bg-black/30 border border-white/5 hover:bg-white/5"
                }`}
                onClick={() => handleProviderChange("openai")}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      apiProvider === "openai" ? "bg-white" : "bg-white/20"
                    }`}
                  />
                  <div className="flex flex-col">
                    <p className="font-medium text-white text-sm">OpenAI</p>
                    <p className="text-xs text-white/60">GPT & Reasoning (o1, o3)</p>
                  </div>
                </div>
              </div>
              <div
                className={`flex-1 p-2 rounded-lg cursor-pointer transition-colors ${
                  apiProvider === "gemini"
                    ? "bg-white/10 border border-white/20"
                    : "bg-black/30 border border-white/5 hover:bg-white/5"
                }`}
                onClick={() => handleProviderChange("gemini")}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      apiProvider === "gemini" ? "bg-white" : "bg-white/20"
                    }`}
                  />
                  <div className="flex flex-col">
                    <p className="font-medium text-white text-sm">Gemini</p>
                    <p className="text-xs text-white/60">Gemini 1.5 models</p>
                  </div>
                </div>
              </div>
              <div
                className={`flex-1 p-2 rounded-lg cursor-pointer transition-colors ${
                  apiProvider === "anthropic"
                    ? "bg-white/10 border border-white/20"
                    : "bg-black/30 border border-white/5 hover:bg-white/5"
                }`}
                onClick={() => handleProviderChange("anthropic")}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      apiProvider === "anthropic" ? "bg-white" : "bg-white/20"
                    }`}
                  />
                  <div className="flex flex-col">
                    <p className="font-medium text-white text-sm">Claude</p>
                    <p className="text-xs text-white/60">Claude 3 models</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white" htmlFor="apiKey">
            {apiProvider === "openai" ? "OpenAI API Key" : 
             apiProvider === "gemini" ? "Gemini API Key" : 
             "Anthropic API Key"}
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={
                apiProvider === "openai" ? "sk-..." : 
                apiProvider === "gemini" ? "Enter your Gemini API key" :
                "sk-ant-..."
              }
              className="bg-black/50 border-white/10 text-white"
            />
            {apiKey && (
              <p className="text-xs text-white/50">
                Current: {maskApiKey(apiKey)}
              </p>
            )}
            <p className="text-xs text-white/50">
              Your API key is stored locally and never sent to any server except {apiProvider === "openai" ? "OpenAI" : "Google"}
            </p>
            <div className="mt-2 p-2 rounded-md bg-white/5 border border-white/10">
              <p className="text-xs text-white/80 mb-1">Don't have an API key?</p>
              {apiProvider === "openai" ? (
                <>
                  <p className="text-xs text-white/60 mb-1">1. Create an account at <button 
                    onClick={() => openExternalLink('https://platform.openai.com/signup')} 
                    className="text-blue-400 hover:underline cursor-pointer">OpenAI</button>
                  </p>
                  <p className="text-xs text-white/60 mb-1">2. Go to <button 
                    onClick={() => openExternalLink('https://platform.openai.com/api-keys')} 
                    className="text-blue-400 hover:underline cursor-pointer">API Keys</button> section
                  </p>
                  <p className="text-xs text-white/60">3. Create a new secret key and paste it here</p>
                </>
              ) : apiProvider === "gemini" ?  (
                <>
                  <p className="text-xs text-white/60 mb-1">1. Create an account at <button 
                    onClick={() => openExternalLink('https://aistudio.google.com/')} 
                    className="text-blue-400 hover:underline cursor-pointer">Google AI Studio</button>
                  </p>
                  <p className="text-xs text-white/60 mb-1">2. Go to the <button 
                    onClick={() => openExternalLink('https://aistudio.google.com/app/apikey')} 
                    className="text-blue-400 hover:underline cursor-pointer">API Keys</button> section
                  </p>
                  <p className="text-xs text-white/60">3. Create a new API key and paste it here</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-white/60 mb-1">1. Create an account at <button 
                    onClick={() => openExternalLink('https://console.anthropic.com/signup')} 
                    className="text-blue-400 hover:underline cursor-pointer">Anthropic</button>
                  </p>
                  <p className="text-xs text-white/60 mb-1">2. Go to the <button 
                    onClick={() => openExternalLink('https://console.anthropic.com/settings/keys')} 
                    className="text-blue-400 hover:underline cursor-pointer">API Keys</button> section
                  </p>
                  <p className="text-xs text-white/60">3. Create a new API key and paste it here</p>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-white mb-2 block">Keyboard Shortcuts</label>
            <div className="bg-black/30 border border-white/10 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="text-white/70">Toggle Visibility</div>
                <div className="text-white/90 font-mono">Ctrl+B / Cmd+B</div>
                
                <div className="text-white/70">Take Screenshot</div>
                <div className="text-white/90 font-mono">Ctrl+H / Cmd+H</div>
                
                <div className="text-white/70">Process Screenshots</div>
                <div className="text-white/90 font-mono">Ctrl+Enter / Cmd+Enter</div>
                
                <div className="text-white/70">Delete Last Screenshot</div>
                <div className="text-white/90 font-mono">Ctrl+L / Cmd+L</div>
                
                <div className="text-white/70">Reset View</div>
                <div className="text-white/90 font-mono">Ctrl+R / Cmd+R</div>
                
                <div className="text-white/70">Quit Application</div>
                <div className="text-white/90 font-mono">Ctrl+Q / Cmd+Q</div>
                
                <div className="text-white/70">Move Window</div>
                <div className="text-white/90 font-mono">Ctrl+Arrow Keys</div>
                
                <div className="text-white/70">Decrease Opacity</div>
                <div className="text-white/90 font-mono">Ctrl+[ / Cmd+[</div>
                
                <div className="text-white/70">Increase Opacity</div>
                <div className="text-white/90 font-mono">Ctrl+] / Cmd+]</div>
                
                <div className="text-white/70">Zoom Out</div>
                <div className="text-white/90 font-mono">Ctrl+- / Cmd+-</div>
                
                <div className="text-white/70">Reset Zoom</div>
                <div className="text-white/90 font-mono">Ctrl+0 / Cmd+0</div>
                
                <div className="text-white/70">Zoom In</div>
                <div className="text-white/90 font-mono">Ctrl+= / Cmd+=</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            <label className="text-sm font-medium text-white">AI Model Selection</label>
            <p className="text-xs text-white/60 -mt-3 mb-2">
              Select which models to use for each stage of the process
            </p>
            
            {modelCategories.map((category) => {
              // Get the appropriate model list based on selected provider
              const models = 
                apiProvider === "openai" ? category.openaiModels : 
                apiProvider === "gemini" ? category.geminiModels :
                category.anthropicModels;
              
              // Determine current selected model value
              const currentValue = 
                category.key === 'extractionModel' ? extractionModel :
                category.key === 'solutionModel' ? solutionModel :
                debuggingModel;
              
              // Determine setter function
              const setValue = 
                category.key === 'extractionModel' ? setExtractionModel :
                category.key === 'solutionModel' ? setSolutionModel :
                setDebuggingModel;

              const isPresetModel = models.some(m => m.id === currentValue);
              const isCustomModel = apiProvider === "openai" && !isPresetModel && currentValue.length > 0;
              
              return (
                <div key={category.key} className="mb-4">
                  <label className="text-sm font-medium text-white mb-1 block">
                    {category.title}
                  </label>
                  <p className="text-xs text-white/60 mb-2">{category.description}</p>
                  
                  <div className="space-y-2">
                    {models.map((m) => {
                      const isSelected = currentValue === m.id;
                      return (
                        <div
                          key={m.id}
                          className={`p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-white/10 border border-white/20"
                              : "bg-black/30 border border-white/5 hover:bg-white/5"
                          }`}
                          onClick={() => setValue(m.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                isSelected ? "bg-white" : "bg-white/20"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-white text-xs">{m.name}</p>
                                {m.isThinking && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-purple-500/25 text-purple-300 border border-purple-500/30">
                                    Thinking
                                  </span>
                                )}
                                {m.badge && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-white/10 text-white/70 border border-white/10">
                                    {m.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/60 mt-0.5">{m.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {apiProvider === "openai" && (
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isCustomModel
                            ? "bg-white/10 border border-white/20"
                            : "bg-black/30 border border-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                              isCustomModel ? "bg-white" : "bg-white/20"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white text-xs">Custom Model</p>
                              <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-white/10 text-white/70 border border-white/10">
                                Custom ID
                              </span>
                            </div>
                            <input
                              type="text"
                              placeholder="Enter model ID (e.g. o3, ft:gpt-4o:...)"
                              value={isCustomModel ? currentValue : ""}
                              onChange={(e) => setValue(e.target.value)}
                              className="mt-1 w-full bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="border-white/10 hover:bg-white/5 text-white"
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
            onClick={handleSave}
            disabled={isLoading || !apiKey}
          >
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
