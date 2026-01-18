import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { CheckCircle, Calendar, Bell, ArrowRight } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />

            <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
                {/* Ambient Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:bg-purple-900/20"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-blue-900/20"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:bg-pink-900/20"></div>
                </div>

                {/* Navbar */}
                <div className="relative z-10 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ApplicationLogo className="h-10 w-10" />
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">SmartTask</span>
                    </div>
                    <nav className="flex gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition shadow-lg shadow-blue-500/30"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* Hero Section */}
                <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center lg:pt-32">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Master Your Day,<br /> Every Day.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                        The professional way to manage tasks, recurring events, and reminders.
                        Boost your productivity with a smart, intuitive, and beautiful interface.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-xl shadow-blue-500/20"
                            >
                                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        ) : (
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-xl shadow-blue-500/20"
                            >
                                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <FeatureCard
                            icon={<CheckCircle className="h-8 w-8 text-blue-500" />}
                            title="Smart Task Management"
                            description="Organize tasks with priorities, tags, and dragging capabilities. Stay on top of everything effortlessly."
                        />
                        <FeatureCard
                            icon={<Calendar className="h-8 w-8 text-purple-500" />}
                            title="Interactive Calendar"
                            description="Visualize your schedule with our dynamic calendar view. Never miss a deadline again."
                        />
                        <FeatureCard
                            icon={<Bell className="h-8 w-8 text-pink-500" />}
                            title="Instant Notifications"
                            description="Get real-time browser alerts and reminders so you are always in the loop."
                        />
                    </div>
                </main>

                <footer className="relative z-10 py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                    &copy; {new Date().getFullYear()} SmartTask App. Built with Laravel v{laravelVersion} & PHP v{phpVersion}.
                </footer>
            </div>
        </>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-1">
            <div className="mb-4 p-3 bg-white dark:bg-gray-900 rounded-lg inline-block shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
