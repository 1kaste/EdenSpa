
import React, { useState, useRef, memo } from 'react';
import { useAppContext } from '../context/AppContext';
import { LoginMode } from '../types';

interface AdminTriggerProps {
    onUnlock: (mode: LoginMode) => void;
}

const AdminTrigger: React.FC<AdminTriggerProps> = ({ onUnlock }) => {
    const { appData, theme, authenticate } = useAppContext();
    const [tapCount, setTapCount] = useState(0);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    if (!appData) return null;

    const handleTap = () => {
        if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
        }

        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);

        if (newTapCount >= 3) {
            setTapCount(0);
            setShowPasswordModal(true);
        } else {
            tapTimeoutRef.current = setTimeout(() => {
                setTapCount(0);
            }, 1000); // Reset taps after 1 second
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordInput || isAuthenticating) return;

        setIsAuthenticating(true);
        setPasswordError('');

        const result = await authenticate(passwordInput);

        setIsAuthenticating(false);

        if (result.success && result.mode) {
            setPasswordInput('');
            setShowPasswordModal(false);
            onUnlock(result.mode);
        } else {
            setPasswordError('Incorrect password. Please try again.');
            setPasswordInput('');
        }
    };

    return (
        <>
            <button
                onClick={handleTap}
                className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-30 transition-opacity duration-300 opacity-20 hover:opacity-100"
                style={{ backgroundColor: theme.accent, color: theme.background }}
                aria-label="Admin Access"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </button>
            
            {showPasswordModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowPasswordModal(false)}>
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4">Admin Access</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(''); }}
                                className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                placeholder="Enter password"
                                autoFocus
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 rounded-md text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700">Cancel</button>
                                <button type="submit" disabled={isAuthenticating} className="px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50" style={{backgroundColor: theme.accent, color: theme.background}}>{isAuthenticating ? 'Checking...' : 'Unlock'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(AdminTrigger);