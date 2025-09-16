import './global.css';
import { useState, useEffect } from 'react';
import { Skill, CreateSkillRequest } from './types/Skill';
import { apiService } from './services/apiService';
import { AddSkillForm } from './components/AddSkillForm';
import { SkillsList } from './components/SkillsList';
import { ErrorMessage } from './components/ui/ErrorMessage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AVAILABLE_LANGUAGES, useTranslation } from './components/LanguageProvider';

function App() {
    const { t, language, setLanguage } = useTranslation();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [deletingSkillId, setDeletingSkillId] = useState<number | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    useEffect(() => {
        checkConnection();
    }, []);

    useEffect(() => {
        if (connectionStatus === 'connected') {
            loadSkills();
        }
    }, [connectionStatus]);

    const checkConnection = async () => {
        try {
            await apiService.healthCheck();
            setConnectionStatus('connected');
            setError(null);
        } catch (err) {
            setConnectionStatus('disconnected');
            setError('Cannot connect to the server. Make sure the backend is running on port 8082.');
        }
    };

    const loadSkills = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedSkills = await apiService.getSkills();
            setSkills(fetchedSkills);
            console.log('Fetched skills:', fetchedSkills);
        } catch (err) {
            setError('Error while fetching skills');
            console.error('Error loading skills:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSkill = async (skillData: CreateSkillRequest) => {
        try {
            setIsAddingSkill(true);
            setError(null);
            const newSkill = await apiService.createSkill(skillData);
            setSkills(prev => [...prev, newSkill]);
        } catch (err) {
            setError('Error while adding skill');
            console.error('Error adding skill:', err);
            throw err;
        } finally {
            setIsAddingSkill(false);
        }
    };

    const handleDeleteSkill = async (skillId: number) => {
        try {
            setDeletingSkillId(skillId);
            setError(null);
            await apiService.deleteSkill(skillId);
            setSkills(prev => prev.filter(skill => skill.skillId !== skillId));
        } catch (err) {
            setError('Error while deleting skill');
            console.error('Error deleting skill:', err);
        } finally {
            setDeletingSkillId(undefined);
        }
    };

    const handleRetry = () => {
        if (connectionStatus === 'disconnected') {
            checkConnection();
        } else {
            loadSkills();
        }
    };

    if (connectionStatus === 'checking') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Connecting to server...</p>
                </div>
            </div>
        );
    }

    if (connectionStatus === 'disconnected') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <ErrorMessage
                        message="Cannot connect to the server. Make sure the backend is running on port 8082."
                        onRetry={handleRetry}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('skill_manager')}</h1>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{t('connected')}</span>
                        </div>

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en' | 'pl')}
                            className="px-2 py-1 border rounded text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            {AVAILABLE_LANGUAGES.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="dark-mode-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    id="dark-mode-toggle"
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isDarkMode}
                                    onChange={toggleDarkMode}
                                />
                                <div className="w-10 h-4 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner"></div>
                                <div
                                    className={`dot absolute w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow -left-1 -top-1 transition-transform ${isDarkMode ? 'translate-x-full' : ''
                                        }`}
                                ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-200">
                                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </label>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && <ErrorMessage message={error} onRetry={handleRetry} />}
                <div className="space-y-8">
                    <AddSkillForm onSubmit={handleAddSkill} isLoading={isAddingSkill} />
                    <SkillsList
                        skills={skills}
                        onDeleteSkill={handleDeleteSkill}
                        isLoading={isLoading}
                        deletingSkillId={deletingSkillId}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
