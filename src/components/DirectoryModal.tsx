import React, { useState, useEffect } from 'react';
import { X, Search, ChevronDown, Plus, Settings, Sparkles, BookOpen, Link2, HelpCircle, ArrowRight, Play, Check, ArrowLeft, AlertCircle, Target, ShoppingBag, Facebook, BarChart3, ShoppingCart, TrendingUp, Brain, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SkroutzConnect from './SkroutzConnect';
import GoogleAdsConnect from './GoogleAdsConnect';
import GoogleAnalyticsConnect from './GoogleAnalyticsConnect';
import FacebookAdsConnect from './FacebookAdsConnect';
import GoogleTrendsCard from '../pages/GoogleTrendsCard';
import { ChatGPTCommerceCard } from './ChatGPTCommerceCard';
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard';
import { AIInsightsCard } from './profile/AIInsightsCard';
import { AIShoppingWidgetCard } from './AIShoppingWidgetCard';

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'el' | 'en';
  profile: any;
  hasGoogleAds: boolean;
  onConnectClick: (connector: string) => void;
  userId?: string;
  advancedAnalytics?: any;
  initialConnectorId?: string;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  isOpen,
  onClose,
  language = 'el',
  profile,
  hasGoogleAds,
  onConnectClick,
  userId = 'demo-user',
  advancedAnalytics,
  initialConnectorId
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'connectors' | 'skills' | 'plugins'>('connectors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Checks connection statuses dynamically
  const isWooConnected = !!(profile?.woocommerce_sk && profile?.woocommerce_ck);
  const isShopifyConnected = !!(profile?.shopify_store_url && profile?.shopify_access_token);
  const isSkroutzConnected = !!profile?.has_skroutz;
  const isGoogleAdsConnected = !!profile?.google_ads_pipeboard_token;
  const isFbConnected = !!profile?.google_ads_pipeboard_token;
  
  // List of Connectors
  const connectors = [
    {
      id: 'google-ads',
      name: 'Google Ads',
      tag: language === 'el' ? '#1 δημοφιλές' : '#1 popular',
      tagColor: 'text-neutral-400',
      icon: <Target className="w-5 h-5 text-neutral-400" />,
      description: language === 'el' 
        ? 'Ανάλυση απόδοσης καμπανιών Google Ads και βελτιστοποίηση ROAS με AI.' 
        : 'Analyze Google Ads campaign performance and optimize ROAS using AI.',
      connected: isGoogleAdsConnected
    },
    {
      id: 'skroutz',
      name: 'Skroutz Smart Cart',
      tag: language === 'el' ? '#2 δημοφιλές' : '#2 popular',
      tagColor: 'text-neutral-400',
      icon: <ShoppingBag className="w-5 h-5 text-neutral-400" />,
      description: language === 'el' 
        ? 'Αυτόματη ανάκτηση και ανάλυση παραγγελιών από το Skroutz Marketplace.' 
        : 'Automatically retrieve and analyze orders from the Skroutz Marketplace.',
      connected: !!isSkroutzConnected
    },
    {
      id: 'facebook-ads',
      name: 'Facebook Ads',
      tag: language === 'el' ? 'Νέο' : 'New',
      tagColor: 'text-neutral-400',
      icon: <Facebook className="w-5 h-5 text-neutral-400" />,
      description: language === 'el' 
        ? 'Παρακολούθηση διαφημιστικών δαπανών και metrics στο Facebook & Instagram.' 
        : 'Track Facebook & Instagram ad spends, conversion rates and reach metrics.',
      connected: isFbConnected
    }
  ];

  // List of Plugins / Addons
  const plugins = [
    {
      id: 'ai-shopping-widget',
      name: language === 'el' ? 'AI Shopping Widget' : 'AI Shopping Widget',
      tag: language === 'el' ? 'Πρόσθετο' : 'Addon',
      tagColor: 'text-neutral-400',
      icon: <MessageSquare className="w-5 h-5 text-neutral-400" />,
      description: language === 'el'
        ? 'AI Agent ο οποίος αναλαμβάνει την εξυπηρέτηση πελατών, προτείνει στους πελάτες σας και πουλάει προϊόντα 24/7.'
        : 'AI Agent that handles customer support, recommends products to your customers, and sells 24/7.',
      connected: true
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      tag: language === 'el' ? 'Πρόσθετο' : 'Addon',
      tagColor: 'text-neutral-400',
      icon: <TrendingUp className="w-5 h-5 text-neutral-400" />,
      description: language === 'el'
        ? 'Πλήρης οικονομική ανάλυση, διαχείριση αποθεμάτων, retention cohorts και πρόβλεψη churn.'
        : 'Full financial analysis, inventory management, retention cohorts and churn predictions.',
      connected: true
    },
    {
      id: 'ai-memory',
      name: 'AI Memory',
      tag: language === 'el' ? 'Πρόσθετο' : 'Addon',
      tagColor: 'text-neutral-400',
      icon: <Brain className="w-5 h-5 text-neutral-400" />,
      description: language === 'el'
        ? 'Η μνήμη του AI σας. Καταγράφει αυτόματα στόχους, προβλήματα, SKUs και facts που μαθαίνει για την επιχείρησή σας.'
        : 'Your AI\'s memory. Automatically tracks goals, problems, SKUs and facts it learns about your business.',
      connected: true
    },
    {
      id: 'google-trends',
      name: 'Google Trends AI Agent',
      tag: language === 'el' ? 'Πρόσθετο' : 'Addon',
      tagColor: 'text-neutral-400',
      icon: <BarChart3 className="w-5 h-5 text-neutral-400" />,
      description: language === 'el'
        ? 'Δημοτικότητα προϊόντων στην αγορά και έξυπνη ανάλυση τάσεων.'
        : 'Product popularity in the market and smart trend analysis.',
      connected: true
    },
    {
      id: 'chatgpt-discovery',
      name: 'ChatGPT Product Discovery',
      tag: language === 'el' ? 'Πρόσθετο' : 'Addon',
      tagColor: 'text-neutral-400',
      icon: <ShoppingCart className="w-5 h-5 text-neutral-400" />,
      description: language === 'el'
        ? 'Τα προϊόντα σας θα είναι διαθέσιμα σε όλα τα LLMs (Claude, ChatGPT, κτλπ.) μέσω των servers μας και του αρχείου llms.txt.'
        : 'Your products will be available in all LLMs (Claude, ChatGPT, etc.) through our servers and the llms.txt file.',
      connected: true
    }
  ];

  // List of Skills
  const skills: any[] = [];

  // Auto-select connector when initialConnectorId is provided
  useEffect(() => {
    if (isOpen && initialConnectorId) {
      const allItems = [...connectors, ...plugins];
      const found = allItems.find(item => item.id === initialConnectorId);
      if (found) {
        // Switch to correct tab
        if (connectors.find(c => c.id === initialConnectorId)) {
          setActiveTab('connectors');
        } else {
          setActiveTab('plugins');
        }
        setSelectedItem(found);
      }
    }
    if (!isOpen) {
      setSelectedItem(null);
    }
  }, [isOpen, initialConnectorId]);

  if (!isOpen) return null;

  const getActiveList = () => {
    switch (activeTab) {
      case 'connectors': return connectors;
      case 'plugins': return plugins;
      case 'skills': return skills;
    }
  };

  const filteredItems = getActiveList().filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[80vh] min-h-[500px] bg-[#1F1F1E] border border-neutral-800/80 rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in scale-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/60">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-semibold text-white tracking-wide">
              {language === 'el' ? 'Κατάλογος' : 'Directory'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-450 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Inner Content Grid */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar Category Navigation */}
          <div className="w-48 border-r border-neutral-800/60 p-4 space-y-1.5 flex flex-col bg-[#1D1D1B]">
            <button
              onClick={() => { setActiveTab('connectors'); setSelectedItem(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer text-left ${
                activeTab === 'connectors' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/30'
              }`}
            >
              <Link2 className="w-4.5 h-4.5" />
              <span>{language === 'el' ? 'Συνδέσεις' : 'Connectors'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('plugins'); setSelectedItem(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer text-left ${
                activeTab === 'plugins' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/30'
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>{language === 'el' ? 'Πρόσθετα' : 'Plugins'}</span>
            </button>
          </div>

          {/* Right Main Grid Area */}
          <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-5 bg-[#1F1F1E]">
            
            {selectedItem ? (
              /* 🆕 Details View! */
              <div className="flex-1 flex flex-col overflow-y-auto pr-1 select-none" style={{ scrollbarWidth: 'thin' }}>
                {/* Back Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex items-center gap-1.5 text-xs text-neutral-405 hover:text-white transition-all cursor-pointer mb-6 self-start bg-neutral-800/40 border border-neutral-800/80 px-3 py-1.5 rounded-lg"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'el' ? 'Πίσω' : 'Back'}</span>
                </button>

                {/* Header Section: Icon + Title + Status */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-neutral-800/60">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-850/50 border border-neutral-800/60 flex items-center justify-center shadow-lg">
                      {selectedItem.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="font-serif text-2xl font-semibold text-white tracking-wide">
                          {selectedItem.name}
                        </h2>
                        <span className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded bg-neutral-800/50 ${selectedItem.tagColor}`}>
                          {selectedItem.tag}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400 mt-1 max-w-xl font-sans leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator badge on details header */}
                  <div className="text-right">
                    {selectedItem.connected ? (
                      <span className="text-emerald-400 text-xs font-bold bg-emerald-950/20 border border-emerald-800/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> {language === 'el' ? 'Συνδεδεμένο' : 'Connected'}
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-xs font-bold bg-neutral-850 border border-neutral-800 px-3 py-1 rounded-full">
                        {language === 'el' ? 'Διαθέσιμο' : 'Available'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Embedded Connector Content Card */}
                <div className="space-y-6">
                  <div>
                    {selectedItem.id !== 'google-trends' && selectedItem.id !== 'chatgpt-discovery' && selectedItem.id !== 'advanced-analytics' && selectedItem.id !== 'ai-memory' && selectedItem.id !== 'ai-shopping-widget' && (
                      <h3 className="text-xs font-bold text-neutral-500 tracking-wider mb-3">
                        {language === 'el' ? 'Ρύθμιση Σύνδεσης' : 'Connection Settings'}
                      </h3>
                    )}
                    
                    {/* Render corresponding card */}
                    {selectedItem.id === 'google-trends' ? (
                      <div className="p-0">
                        <GoogleTrendsCard
                          marketingData={profile?.marketing_data}
                          language={language}
                          defaultExpanded={true}
                          hideHeader={true}
                        />
                      </div>
                    ) : selectedItem.id === 'ai-shopping-widget' ? (
                      <div className="p-0">
                        <AIShoppingWidgetCard
                          userId={userId}
                          profileData={profile}
                          hideHeader={true}
                        />
                      </div>
                    ) : selectedItem.id === 'chatgpt-discovery' ? (
                      <div className="p-0">
                        <ChatGPTCommerceCard
                          userId={userId}
                          profileData={profile}
                          hideHeader={true}
                        />
                      </div>
                    ) : selectedItem.id === 'advanced-analytics' ? (
                      <div className="p-0">
                        <AdvancedAnalyticsDashboard
                          analytics={advancedAnalytics}
                          embedInCatalog={true}
                        />
                      </div>
                    ) : selectedItem.id === 'ai-memory' ? (
                      <div className="p-0 select-none">
                        <AIInsightsCard userId={userId} />
                      </div>
                    ) : (
                      <div className="bg-[#121212] border border-neutral-805/85 rounded-xl p-2 shadow-inner">
                        {selectedItem.id === 'skroutz' && (
                          <SkroutzConnect userId={userId} />
                        )}
                        
                        {selectedItem.id === 'google-ads' && (
                          <GoogleAdsConnect userId={userId} />
                        )}
                        
                        {selectedItem.id === 'facebook-ads' && (
                          <FacebookAdsConnect userId={userId} />
                        )}

                        {/* Fallback or non-connectors (skills / plugins) */}
                        {selectedItem.id !== 'skroutz' && selectedItem.id !== 'google-ads' && selectedItem.id !== 'facebook-ads' && (
                          <div className="p-6 text-center text-neutral-450 space-y-3 font-sans">
                            <Check className="w-10 h-10 mx-auto text-neutral-400" />
                            <h4 className="font-bold text-white text-base">{selectedItem.name} Active</h4>
                            <p className="text-xs max-w-md mx-auto leading-relaxed">
                              {language === 'el'
                                ? 'Αυτό το εργαλείο είναι πλήρως ενσωματωμένο και ενεργό στον Mr Sigma AI Assistant σας.'
                                : 'This module is fully integrated and active inside your Mr Sigma AI Assistant.'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                  {/* Claude-style Details list at the bottom */}
                  <div className="border-t border-neutral-800/60 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-neutral-500 block mb-1">Developer</span>
                        <a href="https://sigmalabs.ai" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-neutral-400 hover:underline flex items-center gap-1">
                          SigmaLabs AI <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-500 block mb-1">Category</span>
                        <span className="text-sm text-white font-medium">
                          {selectedItem.id === 'llm-seo' || selectedItem.id === 'chatgpt-discovery' || (selectedItem.id === 'google-trends' && activeTab === 'plugins')
                            ? 'Plugins & Addons'
                            : selectedItem.id === 'sales-analysis' || (selectedItem.id === 'google-trends' && activeTab === 'skills')
                            ? 'AI Skills'
                            : 'Data Connectors'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-neutral-500 block mb-1">Documentation & Resources</span>
                        <div className="flex flex-col gap-1.5">
                          <a href="https://sigmalabs.ai/docs" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-neutral-450 hover:text-white transition-all flex items-center gap-1">
                            {language === 'el' ? 'Οδηγός Χρήσης' : 'User Guide'} <ArrowRight className="w-2.5 h-2.5" />
                          </a>
                          <a href="https://sigmalabs.ai/support" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-neutral-450 hover:text-white transition-all flex items-center gap-1">
                            {language === 'el' ? 'Κέντρο Υποστήριξης' : 'Support Center'} <ArrowRight className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
              // Original Grid View (search + grid)
              <>
                {/* Search and Filters row */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-450" />
                    <input
                      type="text"
                      placeholder={language === 'el' ? 'Αναζήτηση συνδέσεων...' : 'Search connectors...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1D1D1B] border border-neutral-800/80 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700/30 transition-all font-sans"
                    />
                  </div>

                  {/* Pills & Dropdowns */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-neutral-800/50 border border-neutral-800 text-xs font-semibold rounded-lg text-neutral-350">
                      SigmaLabs & Partners
                    </span>
                    
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/30 border border-neutral-800/50 text-xs rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-all cursor-default">
                      <span>{language === 'el' ? 'Φιλτράρισμα' : 'Filter by'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800/30 border border-neutral-800/50 text-xs rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-all cursor-default">
                      <span>{language === 'el' ? 'Ταξινόμηση' : 'Sort by'}</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Grid of Items */}
                <div className="flex-1 overflow-y-auto pr-1 select-none" style={{ scrollbarWidth: 'thin' }}>
                  {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-neutral-500 space-y-2">
                      <HelpCircle className="w-8 h-8 opacity-40 animate-pulse" />
                      <p className="text-sm font-medium">{language === 'el' ? 'Δεν βρέθηκαν αποτελέσματα' : 'No connectors found'}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="group flex flex-col p-5 bg-[#121212] border border-neutral-800/80 rounded-xl hover:border-neutral-700 hover:bg-[#1a1a1a] transition-all duration-300 shadow-md relative cursor-pointer"
                        >
                          {/* Top Row: Icon + Title + Action */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-neutral-850/50 border border-neutral-800/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
                                {item.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-white group-hover:text-neutral-300 transition-colors">
                                    {item.name}
                                  </span>
                                  <span className={`text-[10px] font-bold tracking-wide ${item.tagColor}`}>
                                    {item.tag}
                                  </span>
                                </div>
                                <span className="text-[11px] text-neutral-500 font-medium font-sans">
                                  {item.connected ? (
                                    <span className="text-emerald-500 flex items-center gap-1 mt-0.5 font-semibold">
                                      <Check className="w-3 h-3 text-emerald-500" /> {language === 'el' ? 'Συνδεδεμένο' : 'Connected'}
                                    </span>
                                  ) : (
                                    <span>{language === 'el' ? 'Διαθέσιμο' : 'Available'}</span>
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Action Icon on Right */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                item.connected
                                  ? 'bg-neutral-800/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
                                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white shadow-md'
                              }`}
                              title={item.connected ? 'Configure' : 'Connect'}
                            >
                              {item.connected ? (
                                <Settings className="w-4 h-4 animate-spin-hover" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {/* Bottom Description */}
                          <p className="text-xs text-neutral-400 mt-3 leading-relaxed font-sans flex-1">
                            {item.description}
                          </p>

                          {/* Call to action arrow on hover */}
                          {!item.connected && (
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer self-start"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setSelectedItem(item);
                                 }}>
                              <span>{language === 'el' ? 'Σύνδεση τώρα' : 'Connect now'}</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
