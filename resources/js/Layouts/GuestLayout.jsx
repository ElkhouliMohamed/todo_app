import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 pt-6 sm:pt-0 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-purple-900/40"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-blue-900/40"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-900/40"></div>

            <div className="z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-3xl rounded-2xl shadow-xl w-full sm:max-w-md p-8 border border-white/20 dark:border-gray-700/30">
                <div className="flex justify-center mb-6">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 shadow-lg rounded-full" />
                    </Link>
                </div>

                {children}
            </div>
        </div>
    );
}
