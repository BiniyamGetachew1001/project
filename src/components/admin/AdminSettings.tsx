import React, { useState } from 'react';
import { 
  Save, 
  Check, 
  X, 
  AlertCircle,
  Globe,
  DollarSign,
  Settings as SettingsIcon,
  Mail,
  Phone,
  User
} from 'lucide-react';

interface AdminSettingsProps {
  language: 'english' | 'amharic' | 'afaan-oromo';
  setLanguage: (language: 'english' | 'amharic' | 'afaan-oromo') => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ language, setLanguage }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'localization' | 'pricing'>('general');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'TILkTBEB',
    adminEmail: 'admin@tilktbeb.com',
    adminPhone: '+251912345678',
    adminName: 'Admin User',
    supportEmail: 'support@tilktbeb.com'
  });

  // Pricing settings state
  const [pricingSettings, setPricingSettings] = useState({
    fullAccessPrice: 1200,
    individualBookPrice: 150,
    smallBusinessIdeaPrice: 200,
    middleBusinessIdeaPrice: 250,
    largeBusinessIdeaPrice: 300
  });

  // Localization settings state
  const [localizationSettings, setLocalizationSettings] = useState({
    defaultLanguage: 'english',
    enableAmharic: true,
    enableAfaanOromo: true,
    rtlSupport: true
  });

  // Handle general settings change
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };

  // Handle pricing settings change
  const handlePricingSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPricingSettings({
      ...pricingSettings,
      [name]: parseInt(value) || 0
    });
  };

  // Handle localization settings change
  const handleLocalizationSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setLocalizationSettings({
      ...localizationSettings,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  // Handle save settings
  const handleSaveSettings = () => {
    try {
      // In a real app, you would save the settings to the database here
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to save settings. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
          <Check size={18} className="mr-2" />
          <span>{successMessage}</span>
          <button 
            onClick={() => setSuccessMessage(null)}
            className="ml-4 text-green-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center shadow-md">
          <AlertCircle size={18} className="mr-2" />
          <span>{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)}
            className="ml-4 text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your platform settings.</p>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'general', label: 'General', icon: <SettingsIcon size={16} /> },
              { id: 'localization', label: 'Localization', icon: <Globe size={16} /> },
              { id: 'pricing', label: 'Pricing', icon: <DollarSign size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-6 font-medium flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SettingsIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="adminEmail"
                      value={generalSettings.adminEmail}
                      onChange={handleGeneralSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="adminPhone"
                      value={generalSettings.adminPhone}
                      onChange={handleGeneralSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="adminName"
                      value={generalSettings.adminName}
                      onChange={handleGeneralSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="supportEmail"
                      value={generalSettings.supportEmail}
                      onChange={handleGeneralSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Localization Settings */}
          {activeTab === 'localization' && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Localization Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Language
                  </label>
                  <select
                    name="defaultLanguage"
                    value={localizationSettings.defaultLanguage}
                    onChange={handleLocalizationSettingsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="english">English</option>
                    <option value="amharic">Amharic (አማርኛ)</option>
                    <option value="afaan-oromo">Afaan Oromo</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableAmharic"
                    name="enableAmharic"
                    checked={localizationSettings.enableAmharic}
                    onChange={handleLocalizationSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableAmharic" className="ml-2 block text-sm text-gray-900">
                    Enable Amharic (አማርኛ)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableAfaanOromo"
                    name="enableAfaanOromo"
                    checked={localizationSettings.enableAfaanOromo}
                    onChange={handleLocalizationSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableAfaanOromo" className="ml-2 block text-sm text-gray-900">
                    Enable Afaan Oromo
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rtlSupport"
                    name="rtlSupport"
                    checked={localizationSettings.rtlSupport}
                    onChange={handleLocalizationSettingsChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rtlSupport" className="ml-2 block text-sm text-gray-900">
                    Enable RTL Support
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">English</h4>
                    <p className="text-sm text-gray-600">Welcome to TILkTBEB</p>
                    <p className="text-sm text-gray-600">Book Summaries</p>
                    <p className="text-sm text-gray-600">Business Ideas</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Amharic (አማርኛ)</h4>
                    <p className="text-sm text-gray-600">እንኳን ደህና መጡ ወደ TILkTBEB</p>
                    <p className="text-sm text-gray-600">የመጽሐፍ ማጠቃለያዎች</p>
                    <p className="text-sm text-gray-600">የንግድ ሀሳቦች</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Afaan Oromo</h4>
                    <p className="text-sm text-gray-600">Baga nagaan dhuftan TILkTBEB</p>
                    <p className="text-sm text-gray-600">Cuunfaa Kitaabaa</p>
                    <p className="text-sm text-gray-600">Yaada Daldalaa</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3">Language Selector</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setLanguage('english')}
                    className={`px-4 py-2 rounded-lg ${
                      language === 'english'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('amharic')}
                    className={`px-4 py-2 rounded-lg ${
                      language === 'amharic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    አማርኛ
                  </button>
                  <button
                    onClick={() => setLanguage('afaan-oromo')}
                    className={`px-4 py-2 rounded-lg ${
                      language === 'afaan-oromo'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Afaan Oromo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Settings */}
          {activeTab === 'pricing' && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Pricing Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Access Subscription (ETB)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="fullAccessPrice"
                      value={pricingSettings.fullAccessPrice}
                      onChange={handlePricingSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Individual Book Price (ETB)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="individualBookPrice"
                      value={pricingSettings.individualBookPrice}
                      onChange={handlePricingSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Small Business Idea Price (ETB)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="smallBusinessIdeaPrice"
                      value={pricingSettings.smallBusinessIdeaPrice}
                      onChange={handlePricingSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Business Idea Price (ETB)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="middleBusinessIdeaPrice"
                      value={pricingSettings.middleBusinessIdeaPrice}
                      onChange={handlePricingSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Large Business Idea Price (ETB)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="largeBusinessIdeaPrice"
                      value={pricingSettings.largeBusinessIdeaPrice}
                      onChange={handlePricingSettingsChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">Pricing Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-lg mb-2">Full Access</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{pricingSettings.fullAccessPrice} <span className="text-sm font-normal text-gray-500">ETB</span></p>
                    <p className="text-sm text-gray-600">Access to all books and business ideas</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-lg mb-2">Individual Book</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{pricingSettings.individualBookPrice} <span className="text-sm font-normal text-gray-500">ETB</span></p>
                    <p className="text-sm text-gray-600">Access to a single book summary</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-lg mb-2">Business Ideas</h4>
                    <p className="text-xl font-bold text-blue-600 mb-1">Small: {pricingSettings.smallBusinessIdeaPrice} <span className="text-xs font-normal text-gray-500">ETB</span></p>
                    <p className="text-xl font-bold text-blue-600 mb-1">Middle: {pricingSettings.middleBusinessIdeaPrice} <span className="text-xs font-normal text-gray-500">ETB</span></p>
                    <p className="text-xl font-bold text-blue-600 mb-1">Large: {pricingSettings.largeBusinessIdeaPrice} <span className="text-xs font-normal text-gray-500">ETB</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
