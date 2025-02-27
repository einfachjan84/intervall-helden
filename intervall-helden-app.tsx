import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Moon, Sun, User, UserPlus, Lock, Unlock, Save, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const IntervallHelden = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  
  // Benutzerstatusverwaltung
  const [users, setUsers] = useState([
    { id: 1, name: 'Benutzer 1', active: true, startWeight: null, measurements: [], privateCode: '' },
    { id: 2, name: 'Benutzer 2', active: false, startWeight: null, measurements: [], privateCode: '' }
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [activeUser, setActiveUser] = useState(users[0]);
  
  // Sichtbarkeitseinstellungen
  const [showActualWeights, setShowActualWeights] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [privateCode, setPrivateCode] = useState('');
  const [codeMessage, setCodeMessage] = useState('');

  // UI state
  const [showAddUser, setShowAddUser] = useState(false);

  // Benutzer wechseln
  const switchUser = (userId) => {
    setShowActualWeights(false);
    setEnteredCode('');
    setCodeMessage('');
    
    const updatedUsers = users.map(user => ({
      ...user,
      active: user.id === userId
    }));
    setUsers(updatedUsers);
    setActiveUser(updatedUsers.find(user => user.id === userId));
  };

  // Neuen Benutzer hinzufügen
  const addUser = () => {
    if (newUserName.trim() === '') return;
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
      name: newUserName,
      active: false,
      startWeight: null,
      measurements: [],
      privateCode: ''
    };
    
    setUsers([...users, newUser]);
    setNewUserName('');
    setShowAddUser(false);
  };

  // Startgewicht und Privat-Code festlegen
  const setStartWeight = (weight) => {
    if (isNaN(weight) || weight <= 0) return;
    if (privateCode.trim() === '') {
      setCodeMessage('Bitte erstelle einen privaten Code');
      return;
    }
    
    const updatedUsers = users.map(user => {
      if (user.id === activeUser.id) {
        return {
          ...user,
          startWeight: parseFloat(weight),
          privateCode: privateCode,
          measurements: user.startWeight ? user.measurements : [
            { date: new Date().toISOString().split('T')[0], weight: parseFloat(weight) }
          ]
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setActiveUser(updatedUsers.find(user => user.id === activeUser.id));
    setCodeMessage('Startgewicht und Code gespeichert!');
  };

  // Neue Messung hinzufügen
  const addMeasurement = () => {
    if (isNaN(currentWeight) || currentWeight <= 0 || !activeUser.startWeight) return;
    
    const weight = parseFloat(currentWeight);
    const date = new Date().toISOString().split('T')[0];
    
    const updatedUsers = users.map(user => {
      if (user.id === activeUser.id) {
        const newMeasurements = [...user.measurements, { date, weight }];
        return {
          ...user,
          measurements: newMeasurements
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setActiveUser(updatedUsers.find(user => user.id === activeUser.id));
    setCurrentWeight('');
  };

  // Überprüfen des eingegebenen Codes
  const checkCode = () => {
    if (enteredCode === activeUser.privateCode) {
      setShowActualWeights(true);
      setCodeMessage('Code korrekt! Gewichtsdaten werden angezeigt.');
    } else {
      setShowActualWeights(false);
      setCodeMessage('Falscher Code. Gewichtsdaten bleiben versteckt.');
    }
  };

  // Verstecken der Gewichtsdaten
  const hideWeights = () => {
    setShowActualWeights(false);
    setEnteredCode('');
    setCodeMessage('');
  };

  // Berechnet die prozentuale Veränderung zum vorherigen Gewicht und zum Startgewicht
  const processedData = () => {
    if (!activeUser || !activeUser.measurements || activeUser.measurements.length === 0) {
      return [];
    }

    return activeUser.measurements.map((measurement, index) => {
      const prevWeight = index > 0 ? activeUser.measurements[index - 1].weight : measurement.weight;
      const startWeight = activeUser.startWeight;
      
      const changeFromPrev = index > 0 ? ((measurement.weight - prevWeight) / prevWeight * 100) : 0;
      const changeFromStart = ((measurement.weight - startWeight) / startWeight * 100);
      
      return {
        ...measurement,
        changeFromPrev: parseFloat(changeFromPrev.toFixed(2)),
        changeFromStart: parseFloat(changeFromStart.toFixed(2)),
        // Für Diagramm-Anzeige ohne tatsächliches Gewicht
        displayWeight: showActualWeights ? measurement.weight : null
      };
    });
  };

  // Aktualisieren des aktiven Benutzers, wenn sich die Benutzerliste ändert
  useEffect(() => {
    const newActiveUser = users.find(user => user.active);
    if (newActiveUser) {
      setActiveUser(newActiveUser);
      setShowActualWeights(false);
      setEnteredCode('');
      setCodeMessage('');
    }
  }, [users]);

  // Theme-basierte Styles
  const themeClass = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const buttonPrimaryClass = darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white';
  const buttonSecondaryClass = darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
  const tableHeadClass = darkMode ? 'bg-gray-700' : 'bg-gray-100';
  const tableRowEvenClass = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const tableRowOddClass = darkMode ? 'bg-gray-750' : 'bg-white';
  const chartColors = darkMode ? 
    { grid: '#374151', weight: '#818CF8', prevChange: '#A78BFA', startChange: '#34D399' } :
    { grid: '#E5E7EB', weight: '#4F46E5', prevChange: '#8B5CF6', startChange: '#10B981' };

  const chartData = processedData();

  // Logo component
  const Logo = () => (
    <div className="flex items-center justify-center mb-6">
      <svg width="50" height="50" viewBox="0 0 50 50" className="mr-3">
        <circle cx="25" cy="25" r="23" fill={darkMode ? "#4F46E5" : "#6366F1"} />
        <path d="M25 10 L40 25 L25 40 L10 25 Z" fill={darkMode ? "#A5B4FC" : "#C7D2FE"} />
        <circle cx="25" cy="25" r="8" fill={darkMode ? "#1F2937" : "white"} />
        <path d="M25 15 L28 25 L25 35 L22 25 Z" fill={darkMode ? "#4F46E5" : "#6366F1"} />
      </svg>
      <div>
        <h1 className="text-3xl font-bold text-indigo-500">Intervall-Helden</h1>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dein persönlicher Fortschritt-Tracker</p>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col p-6 min-h-screen transition-colors duration-200 ${themeClass}`}>
      <div className="max-w-6xl mx-auto w-full">
        {/* Header mit Logo und Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <Logo />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-indigo-100 text-indigo-700'}`}
            aria-label={darkMode ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        
        {/* Benutzerauswahl */}
        <div className={`mb-8 ${cardClass} p-5 rounded-lg border shadow-sm`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <User size={20} className="mr-2" />
              Profile
            </h2>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className={`${buttonSecondaryClass} p-2 rounded-full flex items-center`}
              aria-label="Neuen Benutzer hinzufügen"
            >
              <UserPlus size={20} />
            </button>
          </div>
          
          {/* Benutzerliste */}
          <div className="flex flex-wrap gap-2 mb-4">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => switchUser(user.id)}
                className={`px-4 py-2 rounded-full ${
                  user.active 
                    ? buttonPrimaryClass
                    : buttonSecondaryClass
                }`}
              >
                {user.name}
              </button>
            ))}
          </div>
          
          {/* Neuen Benutzer hinzufügen */}
          {showAddUser && (
            <div className="mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <UserPlus size={18} className="mr-2" />
                Neuer Benutzer
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Name eingeben"
                  className={`flex-1 px-4 py-2 border rounded ${inputClass}`}
                />
                <button
                  onClick={addUser}
                  className={`px-4 py-2 rounded ${buttonPrimaryClass}`}
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Aktiver Benutzer */}
        {activeUser && (
          <div className={`mb-8 ${cardClass} p-5 rounded-lg border shadow-sm`}>
            <h2 className="text-xl font-semibold mb-4">{activeUser.name}</h2>
            
            {!activeUser.startWeight ? (
              <div>
                <div className="mb-4">
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center">
                      <span>Startgewicht eintragen (kg):</span>
                    </div>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="z.B. 80.5"
                      className={`flex-1 px-4 py-2 border rounded ${inputClass}`}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center">
                      <Lock size={16} className="mr-2" />
                      <span>Privater Code zum Anzeigen der Gewichtsdaten:</span>
                    </div>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={privateCode}
                      onChange={(e) => setPrivateCode(e.target.value)}
                      placeholder="Geheimer Code"
                      className={`flex-1 px-4 py-2 border rounded ${inputClass}`}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setStartWeight(currentWeight)}
                  className={`px-4 py-2 rounded flex items-center ${buttonPrimaryClass}`}
                >
                  <Save size={18} className="mr-2" />
                  Speichern
                </button>
                
                {codeMessage && (
                  <p className={`mt-2 text-sm ${codeMessage.includes('Bitte') ? 'text-yellow-500' : 'text-green-500'}`}>
                    {codeMessage}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>Neues Gewicht eintragen (kg):</span>
                    </div>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="z.B. 79.5"
                      className={`flex-1 px-4 py-2 border rounded ${inputClass}`}
                    />
                    <button
                      onClick={addMeasurement}
                      className={`px-4 py-2 rounded flex items-center ${buttonPrimaryClass}`}
                    >
                      <Save size={18} className="mr-2" />
                      Speichern
                    </button>
                  </div>
                </div>
                
                {/* Code zum Anzeigen der tatsächlichen Gewichtswerte */}
                {!showActualWeights ? (
                  <div className={`mt-4 p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="font-medium mb-2 flex items-center">
                      <Lock size={16} className="mr-2" />
                      Gewichtsdaten anzeigen
                    </h3>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="password"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        placeholder="Privaten Code eingeben"
                        className={`flex-1 px-4 py-2 border rounded ${inputClass}`}
                      />
                      <button
                        onClick={checkCode}
                        className={`px-4 py-2 rounded ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                      >
                        Prüfen
                      </button>
                    </div>
                    {codeMessage && (
                      <p className={`text-sm ${codeMessage.includes('korrekt') ? 'text-green-500' : 'text-red-500'}`}>
                        {codeMessage}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <Unlock size={16} className="mr-2 text-green-500" />
                      <span className="text-green-500 font-medium">Gewichtsdaten sind sichtbar</span>
                      <button
                        onClick={hideWeights}
                        className={`ml-4 px-3 py-1 text-sm rounded ${buttonSecondaryClass}`}
                      >
                        Verbergen
                      </button>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Startgewicht: {activeUser.startWeight} kg
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Diagramm & Daten */}
        {activeUser && activeUser.measurements.length > 0 && (
          <div className={`${cardClass} p-5 rounded-lg border shadow-sm`}>
            <h2 className="text-xl font-semibold mb-6">Fortschritt</h2>
            
            {/* Diagramm */}
            <div className={`mb-8 h-64 p-4 rounded ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis 
                    dataKey="date" 
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis 
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                      color: darkMode ? '#F9FAFB' : '#111827'
                    }}
                    formatter={(value, name) => {
                      if (name === "Gewicht (kg)" && !showActualWeights) {
                        return ["***", "Gewicht (kg)"];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  {showActualWeights && (
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke={chartColors.weight}
                      name="Gewicht (kg)" 
                      strokeWidth={2}
                    />
                  )}
                  <Line 
                    type="monotone" 
                    dataKey="changeFromPrev" 
                    stroke={chartColors.prevChange}
                    name="Änderung zur letzten Messung (%)" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="changeFromStart" 
                    stroke={chartColors.startChange}
                    name="Änderung seit Start (%)" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Daten-Tabelle */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={tableHeadClass}>
                    <th className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-2 text-left`}>Datum</th>
                    {showActualWeights && (
                      <th className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-2 text-left`}>Gewicht (kg)</th>
                    )}
                    <th className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-2 text-left`}>Änderung zur letzten Messung (%)</th>
                    <th className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-2 text-left`}>Änderung zum Startgewicht (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? tableRowEvenClass : tableRowOddClass}>
                      <td className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-2`}>{data.date}</td>
                      {showActualWeights && (
                        <td className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-2`}>{data.weight}</td>
                      )}
                      <td 
                        className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-2 font-medium`} 
                        style={{ color: data.changeFromPrev <= 0 ? (darkMode ? '#34D399' : '#10B981') : (darkMode ? '#F87171' : '#EF4444') }}
                      >
                        {data.changeFromPrev > 0 ? '+' : ''}{data.changeFromPrev}%
                      </td>
                      <td 
                        className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-2 font-medium`} 
                        style={{ color: data.changeFromStart <= 0 ? (darkMode ? '#34D399' : '#10B981') : (darkMode ? '#F87171' : '#EF4444') }}
                      >
                        {data.changeFromStart > 0 ? '+' : ''}{data.changeFromStart}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className={`mt-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
          <p>© 2025 Intervall-Helden | Dein persönlicher Fortschritt-Tracker</p>
        </div>
      </div>
    </div>
  );
};

export default IntervallHelden;
