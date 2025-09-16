import './global.css';
import React, { useState, useEffect } from 'react';
import { Skill, CreateSkillRequest } from './types/Skill';
import { apiService } from './services/apiService';
import { AddSkillForm } from './components/AddSkillForm';
import { SkillsList } from './components/SkillsList';
import { ErrorMessage } from './components/ui/ErrorMessage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

function App() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [deletingSkillId, setDeletingSkillId] = useState<number | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

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
            setSkills(prev => prev.filter(skill => skill.id !== skillId));
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">Connecting to server...</p>
                </div>
            </div>
        );
    }

    if (connectionStatus === 'disconnected') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Skill Manager
                        </h1>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Connected</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6">
                        <ErrorMessage
                            message={error}
                            onRetry={handleRetry}
                        />
                    </div>
                )}

                <div className="space-y-8">
                    <AddSkillForm
                        onSubmit={handleAddSkill}
                        isLoading={isAddingSkill}
                    />

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
