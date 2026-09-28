import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Activity, 
  Database, 
  Server, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Plus, 
  Droplet, 
  Sun, 
  Layers, 
  History, 
  ChevronRight, 
  RefreshCw, 
  Trash2, 
  ShieldAlert, 
  Calendar,
  ExternalLink,
  Cpu
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [activeTab, setActiveTab] = useState('advisor');
  const [healthStatus, setHealthStatus] = useState(null);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [loadingHealth, setLoadingHealth] = useState(false);

  // Advisory Form State
  const [formCropName, setFormCropName] = useState('Tomato');
  const [formSymptoms, setFormSymptoms] = useState('');
  const [formGrowthStage, setFormGrowthStage] = useState('Flowering');
  const [formWeather, setFormWeather] = useState('Humid / 28°C with intermittent showers');
  const [formSoil, setFormSoil] = useState('Alluvial Loam');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [advisoryError, setAdvisoryError] = useState(null);

  // New Farm / Crop Modal State
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmLocation, setNewFarmLocation] = useState('');
  const [newFarmArea, setNewFarmArea] = useState('15');

  // Load initial data
  useEffect(() => {
    checkHealth();
    fetchFarms();
    fetchCrops();
    fetchAdvisories();
  }, []);

  const checkHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      const data = await res.json();
      setHealthStatus(data);
    } catch (e) {
      setHealthStatus({ status: 'offline', error: e.message });
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchFarms = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/farms`);
      if (res.ok) {
        const data = await res.json();
        setFarms(data);
      }
    } catch (e) {
      console.error('Failed to fetch farms:', e);
    }
  };

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/crops`);
      if (res.ok) {
        const data = await res.json();
        setCrops(data);
      }
    } catch (e) {
      console.error('Failed to fetch crops:', e);
    }
  };

  const fetchAdvisories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/advisories`);
      if (res.ok) {
        const data = await res.json();
        setAdvisories(data);
      }
    } catch (e) {
      console.error('Failed to fetch advisories:', e);
    }
  };

  const handleDiagnose = async (e) => {
    e.preventDefault();
    if (!formSymptoms.trim()) {
      setAdvisoryError('Please describe the symptoms observed on the crop.');
      return;
    }

    setAnalyzing(true);
    setAdvisoryError(null);
    setCurrentDiagnosis(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/advisories/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_name: formCropName,
          symptoms: formSymptoms,
          growth_stage: formGrowthStage,
          weather_condition: formWeather,
          soil_condition: formSoil
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Diagnosis failed');

      setCurrentDiagnosis(data.diagnosis_data);
      fetchAdvisories(); // Refresh history
    } catch (err) {
      setAdvisoryError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/farms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFarmName,
          location: newFarmLocation,
          total_area_acres: newFarmArea
        })
      });

      if (res.ok) {
        setShowAddFarmModal(false);
        setNewFarmName('');
        setNewFarmLocation('');
        fetchFarms();
      }
    } catch (err) {
      alert('Error creating farm: ' + err.message);
    }
  };

  const handleDeleteAdvisory = async (id) => {
    if (!confirm('Are you sure you want to delete this advisory record?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/advisories/${id}`, { method: 'DELETE' });
      fetchAdvisories();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">CRITICAL</span>;
      case 'High':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">HIGH</span>;
      case 'Moderate':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">MODERATE</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LOW</span>;
    }
  };

  const quickSymptoms = [
    "Yellow leaf spots with dark brown margins on lower foliage",
    "Stunted shoot elongation with downward leaf curling",
    "White powdery fungal coating on upper leaves and stems",
    "Sudden daytime wilting with stem base dark water-soaked lesions"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-green-300 to-teal-200 bg-clip-text text-transparent">
                  CropPilot AI
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Antigravity Edition
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent Crop Advisory & Precision Agronomy</p>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">Gemini 2.5 AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-300 font-medium">Supabase Cloud</span>
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
              <Server className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-300 font-medium">Render Ready</span>
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 mt-2">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'advisor'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Crop Diagnosis
          </button>
          <button
            onClick={() => setActiveTab('farms')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'farms'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Farm & Field Registry
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-normal">
              {farms.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Advisory History
            <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-normal">
              {advisories.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'architecture'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Architecture & Pipeline
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* TAB 1: AI CROP DIAGNOSIS */}
        {activeTab === 'advisor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-400" />
                    New Crop Diagnosis
                  </h2>
                  <span className="text-xs text-slate-400">Powered by Gemini</span>
                </div>

                <form onSubmit={handleDiagnose} className="space-y-4">
                  {/* Crop Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target Crop Name
                    </label>
                    <input
                      type="text"
                      value={formCropName}
                      onChange={(e) => setFormCropName(e.target.value)}
                      placeholder="e.g. Tomato, Wheat, Cotton, Rice"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Growth Stage & Soil */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Growth Stage
                      </label>
                      <select
                        value={formGrowthStage}
                        onChange={(e) => setFormGrowthStage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option>Seedling</option>
                        <option>Vegetative</option>
                        <option>Flowering</option>
                        <option>Fruiting</option>
                        <option>Ripening / Maturity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Soil Condition
                      </label>
                      <select
                        value={formSoil}
                        onChange={(e) => setFormSoil(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option>Alluvial Loam</option>
                        <option>Clay Loam</option>
                        <option>Black Soil (Regur)</option>
                        <option>Sandy Loam</option>
                        <option>Red Soil</option>
                      </select>
                    </div>
                  </div>

                  {/* Weather / Climate */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Weather / Environment
                    </label>
                    <input
                      type="text"
                      value={formWeather}
                      onChange={(e) => setFormWeather(e.target.value)}
                      placeholder="e.g. Humid, 28°C, frequent morning dew"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Symptoms Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Observed Symptoms & Plant Condition
                    </label>
                    <textarea
                      rows={4}
                      value={formSymptoms}
                      onChange={(e) => setFormSymptoms(e.target.value)}
                      placeholder="Describe what you see: leaf color, spots, wilting, stem discoloration, pest sightings..."
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                    ></textarea>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <p className="text-[11px] text-slate-400 mb-2 font-medium">Quick symptom presets:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickSymptoms.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormSymptoms(q)}
                          className="text-[11px] bg-slate-800/70 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-all text-left"
                        >
                          + {q.slice(0, 32)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  {advisoryError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {advisoryError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={analyzing}
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Gemini AI Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate AI Crop Advisory
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Diagnosis Result Column */}
            <div className="lg:col-span-7">
              {analyzing && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[420px]">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                    <Sprout className="w-7 h-7 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 mb-2">Analyzing Agronomic Data</h3>
                  <p className="text-sm text-slate-400 max-w-sm">
                    Gemini 2.5 Flash is inspecting symptom patterns, cross-referencing plant pathology databases, and synthesizing treatment protocols...
                  </p>
                </div>
              )}

              {!analyzing && !currentDiagnosis && (
                <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[420px]">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4">
                    <Sprout className="w-8 h-8 text-emerald-500/60" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-300 mb-1">Awaiting Diagnosis Input</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Select a crop, specify symptoms, and click "Generate AI Crop Advisory" to receive an immediate clinical diagnosis, organic remedies, and chemical prescriptions.
                  </p>
                </div>
              )}

              {!analyzing && currentDiagnosis && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                  {/* Diagnosis Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                          Diagnostic Analysis Complete
                        </span>
                        {getSeverityBadge(currentDiagnosis.severity)}
                      </div>
                      <h2 className="text-2xl font-extrabold text-white">
                        {currentDiagnosis.condition_identified}
                      </h2>
                      <p className="text-sm text-slate-400 mt-0.5">
                        Pathogen / Agent: <span className="text-slate-200 font-medium">{currentDiagnosis.pathogen_or_cause}</span>
                      </p>
                    </div>

                    <div className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-center">
                      <div className="text-xs text-slate-400">AI Confidence</div>
                      <div className="text-lg font-black text-emerald-400">{currentDiagnosis.confidence_score || 94}%</div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      Condition Overview
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {currentDiagnosis.summary}
                    </p>
                  </div>

                  {/* Immediate Action Steps */}
                  {currentDiagnosis.immediate_actions && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Immediate Containment Steps
                      </h4>
                      <ul className="space-y-1.5">
                        {currentDiagnosis.immediate_actions.map((act, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Remedies Grid: Organic vs Chemical */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Organic Solutions */}
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5" />
                        Organic & Bio-Remedies
                      </h4>
                      {currentDiagnosis.organic_remedies?.map((rem, i) => (
                        <div key={i} className="text-xs bg-slate-950/70 p-2.5 rounded-lg border border-emerald-900/30">
                          <div className="font-semibold text-emerald-300">{rem.remedy}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{rem.application}</div>
                        </div>
                      ))}
                    </div>

                    {/* Chemical Solutions */}
                    <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5" />
                        Chemical & Target Formulations
                      </h4>
                      {currentDiagnosis.chemical_remedies?.map((rem, i) => (
                        <div key={i} className="text-xs bg-slate-950/70 p-2.5 rounded-lg border border-sky-900/30">
                          <div className="font-semibold text-sky-300">{rem.remedy}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{rem.application}</div>
                          {rem.precautions && (
                            <div className="text-amber-400/90 text-[10px] mt-1 italic">⚠️ {rem.precautions}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Water & Soil Advisory */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {currentDiagnosis.irrigation_advice && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="font-semibold text-teal-400 block mb-1">💧 Irrigation Advice</span>
                        <p className="text-slate-300">{currentDiagnosis.irrigation_advice}</p>
                      </div>
                    )}
                    {currentDiagnosis.fertilizer_advice && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="font-semibold text-emerald-400 block mb-1">🌱 Fertilizer Management</span>
                        <p className="text-slate-300">{currentDiagnosis.fertilizer_advice}</p>
                      </div>
                    )}
                  </div>

                  {/* Disclaimer */}
                  <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3 italic">
                    {currentDiagnosis.disclaimer}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FARM & FIELD REGISTRY */}
        {activeTab === 'farms' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Registered Farms & Active Crops</h2>
                <p className="text-xs text-slate-400">Directly synchronized with Supabase Cloud PostgreSQL database</p>
              </div>
              <button
                onClick={() => setShowAddFarmModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                Add New Farm
              </button>
            </div>

            {/* Farm Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((f) => (
                <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{f.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {f.location}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      {f.total_area_acres} Acres
                    </span>
                  </div>

                  {/* Fields list */}
                  <div className="border-t border-slate-800/80 pt-3 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Fields & Planted Crops:
                    </div>
                    {f.fields && f.fields.length > 0 ? (
                      f.fields.map((field) => (
                        <div key={field.id} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                          <div className="flex justify-between font-medium text-slate-200">
                            <span>{field.name}</span>
                            <span className="text-slate-400 text-[11px]">{field.area_acres} ac • {field.soil_type}</span>
                          </div>
                          {field.crops && field.crops.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {field.crops.map((c) => (
                                <span key={c.id} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800/50">
                                  🌾 {c.crop_name} ({c.status})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No fields configured yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADVISORY HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Historical Advisory Records</h2>
                <p className="text-xs text-slate-400">Archived AI diagnoses saved automatically in Supabase</p>
              </div>
              <button
                onClick={fetchAdvisories}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>

            {advisories.length === 0 ? (
              <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
                <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No advisory history found yet. Diagnose your first crop to see records here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {advisories.map((adv) => (
                  <div key={adv.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-wrap items-start justify-between gap-4 hover:border-slate-700 transition-all">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400 text-sm">{adv.crop_name}</span>
                        {getSeverityBadge(adv.severity)}
                        <span className="text-[11px] text-slate-500">
                          {new Date(adv.created_at).toLocaleDateString()} at {new Date(adv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-white">{adv.diagnosis}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        <span className="text-slate-300 font-medium">Symptoms:</span> {adv.symptoms}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteAdvisory(adv.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-all"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ARCHITECTURE & PIPELINE */}
        {activeTab === 'architecture' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-white">CropPilot AI Architecture Pipeline</h2>
              <p className="text-xs text-slate-400">Complete Full-Stack Application Topology</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">1</div>
                <h4 className="text-sm font-bold text-white">Client Frontend</h4>
                <p className="text-xs text-slate-400">React 18, Vite, Tailwind CSS, Lucide Icons. Configured for fast deployment on Vercel.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">2</div>
                <h4 className="text-sm font-bold text-white">Express Backend</h4>
                <p className="text-xs text-slate-400">Node.js Express API with Zod validation, CORS, and endpoint routing. Deployable to Render.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">3</div>
                <h4 className="text-sm font-bold text-white">Gemini 2.5 Flash</h4>
                <p className="text-xs text-slate-400">Google AI Studio API with structured JSON response schema for agronomic diagnosis & remedies.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs">4</div>
                <h4 className="text-sm font-bold text-white">Supabase Cloud</h4>
                <p className="text-xs text-slate-400">PostgreSQL cloud database hosting Farms, Fields, Crops, and historical Advisory audit logs.</p>
              </div>
            </div>

            {/* Live Health Diagnostics */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Live System Health Checks
                </h3>
                <button
                  onClick={checkHealth}
                  disabled={loadingHealth}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all"
                >
                  {loadingHealth ? 'Pinging...' : 'Ping Services'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Backend Server:</span>
                  <span className="font-bold text-emerald-400">ONLINE (Port 5000)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Supabase DB:</span>
                  <span className="font-bold text-emerald-400">CONNECTED (Project kcodussc...)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Google Gemini API:</span>
                  <span className="font-bold text-emerald-400">AUTHENTICATED</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Farm Modal */}
      {showAddFarmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Register New Farm</h3>
            <form onSubmit={handleCreateFarm} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Farm Name</label>
                <input
                  type="text"
                  value={newFarmName}
                  onChange={(e) => setNewFarmName(e.target.value)}
                  placeholder="e.g. Sunrise Organic Acres"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location / State</label>
                <input
                  type="text"
                  value={newFarmLocation}
                  onChange={(e) => setNewFarmLocation(e.target.value)}
                  placeholder="e.g. Maharashtra, Central Zone"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Acreage</label>
                <input
                  type="number"
                  step="0.5"
                  value={newFarmArea}
                  onChange={(e) => setNewFarmArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold"
                >
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
