import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

const Paymentsuccess = () => {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState('verifying');


    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://elolampaymentlink-backend.onrender.com';

    useEffect(() => {
        if (reference) {
            const verifyPayment = async () => {
                try {
                    // Small delay for smooth UI transition
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const response = await fetch(`${API_BASE_URL}/elolam/payments/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reference })
                    });

                    if (!response.ok) throw new Error("Verification failed");

                    setStatus('success');
                } catch (err) {
                    console.error("Payment Verification Error:", err);
                    setStatus('error');
                }
            };

            verifyPayment();
        }
    }, [reference, API_BASE_URL]);

    const handleDownload = () => {
        // Correct path to your Spring Boot PDF endpoint
        const downloadUrl = `${API_BASE_URL}/elolam/payments/receipt/${reference}`;

        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = "_blank";
        link.setAttribute('download', `ElOlam_Receipt_${reference}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-8 px-4 font-sans selection:bg-sky-100">
            <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] text-center border border-slate-100 relative overflow-hidden">

                {/* VERIFYING STATE */}
                {status === 'verifying' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-sky-50 rounded-full mx-auto flex items-center justify-center animate-pulse">
                            <ShieldCheck className="text-sky-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Securing Transaction...</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Please stay on this page while we finalize your <br/> official documentation.
                        </p>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {status === 'success' && (
                    <div className="animate-in fade-in zoom-in duration-700">
                        <div className="w-24 h-24 bg-green-50 rounded-full mx-auto mb-8 flex items-center justify-center">
                            <CheckCircle className="text-green-500" size={50} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Payment Verified</h2>
                        <p className="text-slate-500 mb-10 text-balance leading-relaxed">
                            Thank you. Your transaction was successful. You can now download your official receipt below.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={handleDownload}
                                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-5 px-6 rounded-2xl hover:bg-sky-600 transition-all shadow-xl shadow-slate-200 active:scale-95 transform"
                            >
                                <Download size={22} /> Download PDF Receipt
                            </button>

                            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pt-2">
                                <FileText size={12} /> Digital Document Issued
                            </div>
                        </div>
                    </div>
                )}

                {/* ERROR STATE */}
                {status === 'error' && (
                    <div className="py-4 animate-in shake duration-500">
                        <div className="w-16 h-16 bg-red-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-red-500 text-3xl font-bold">!</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
                        <p className="mt-2 text-slate-500 text-sm leading-relaxed px-4">
                            We couldn't confirm this payment automatically. Please contact school support with your reference:
                            <span className="block font-mono font-bold text-slate-700 mt-2">{reference}</span>
                        </p>
                    </div>
                )}

                <div className="mt-12 pt-6 border-t border-slate-50">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-black tracking-widest uppercase">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-slate-400 text-[10px] font-medium tracking-[0.1em] uppercase">
                EL-OLAM SPECIAL HOME & REHABILITATION CENTER © 2026
            </p>
        </div>
    );
};

export default Paymentsuccess;