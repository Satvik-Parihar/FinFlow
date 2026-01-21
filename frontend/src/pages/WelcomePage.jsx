import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import WelcomeNavbar from '../components/WelcomeNavbar';
import Footer from '../components/Footer';

// A custom hook to detect when an element is visible in the viewport
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

// A reusable animated component
const AnimatedSection = ({ children, className }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <div 
            ref={ref} 
            className={`${className} transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </div>
    );
};

// Reusable card components with improved styling
const FeatureCard = ({ icon, title, children }) => (
    <div className="h-full flex flex-col bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-blue-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
        <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mb-4 mx-auto transition-transform duration-300 group-hover:scale-110">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow">{children}</p>
    </div>
);

const TestimonialCard = ({ quote, author, title }) => (
    <div className="h-full flex flex-col bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-blue-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <p className="text-gray-600 italic mb-4 flex-grow">"{quote}"</p>
        <div>
            <p className="font-semibold text-gray-900">{author}</p>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);

export default function WelcomePage() {
    return (
        <div className="bg-white text-gray-800">
            <WelcomeNavbar />

            {/* Hero Section */}
            <main className="relative pt-24 pb-20 md:pt-32 md:pb-24 bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <AnimatedSection>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            Expense Management, <span className="text-blue-600">Simplified.</span>
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Stop chasing receipts and wrestling with spreadsheets. FinFlow automates your entire expense workflow, from submission to reimbursement.
                        </p>
                        <div className="mt-8 flex justify-center space-x-4">
                            <Link to="/signup" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                                Let's Get Started for Free
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <AnimatedSection className="text-center">
                        <h2 className="text-3xl font-bold mb-2">Why Choose FinFlow?</h2>
                        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Everything you need to manage company spending in one simple, powerful platform.</p>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AnimatedSection>
                            <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Automated Approvals">
                                Create multi-level approval workflows that automatically route expenses to the right people.
                            </FeatureCard>
                        </AnimatedSection>
                        <AnimatedSection>
                            <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} title="Real-time Insights">
                                Get a clear view of your company's spending with powerful analytics and reporting. A longer sentence to test equal height.
                            </FeatureCard>
                        </AnimatedSection>
                        <AnimatedSection>
                            <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>} title="OCR Receipt Scanning">
                                Employees can simply snap a photo of a receipt, and our AI will autofill the details.
                            </FeatureCard>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <AnimatedSection className="text-center">
                        <h2 className="text-3xl font-bold mb-12">Loved by Modern Finance Teams</h2>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatedSection>
                            <TestimonialCard quote="FinFlow cut our expense processing time by 75%. It's a game-changer for our finance department. The simplicity and power are unmatched." author="Sarah Johnson" title="CFO, Innovate Corp" />
                        </AnimatedSection>
                        <AnimatedSection>
                            <TestimonialCard quote="Our employees love how easy it is to submit expenses. No more lost receipts or complicated forms." author="Michael Chen" title="Operations Manager, Tech Solutions" />
                        </AnimatedSection>
                         <AnimatedSection className="md:col-span-2 lg:col-span-1">
                            <TestimonialCard quote="The level of control and visibility we have over company spending is incredible. I can't imagine going back." author="Jessica Rodriguez" title="Founder, Creative Hub" />
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <AnimatedSection>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Finances?</h2>
                        <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">Join hundreds of companies streamlining their expenses with FinFlow.</p>
                        <Link to="/signup" className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                            Sign Up Now
                        </Link>
                    </AnimatedSection>
                </div>
            </section>
            
            <Footer />
        </div>
    );
}
