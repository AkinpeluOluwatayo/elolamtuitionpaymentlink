import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { CreditCard, ShieldCheck, Phone, Mail, Info } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Payment = () => {
    const paystackLink = "https://paystack.shop/pay/children-tuition-fees";
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://elolampaymentlink-backend.onrender.com';

    // Wake up the backend when page loads
    useEffect(() => {
        const wakeUpBackend = async () => {
            try {
                console.log('Waking up backend server...');
                await fetch(`${API_BASE_URL}/elolam/payments/health`, {
                    method: 'GET',
                });
                console.log('Backend is awake!');
            } catch (err) {
                console.log('Backend wake-up in progress...');
            }
        };

        wakeUpBackend();
    }, [API_BASE_URL]);

    return (
        <div className="min-h-screen bg-[#F0F9FF] relative overflow-hidden flex flex-col items-center py-8 px-4 font-sans">

            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-sky-200 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
            </div>

            <div className="w-full max-w-4xl flex flex-col items-center mb-12">
                <div className="flex justify-center w-full">
                    <img
                        src="/images/logo.png"
                        alt="El-Olam Special Home Logo"
                        className="max-h-28 md:max-h-40 w-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-500"
                    />
                </div>
            </div>

            <div className="w-full max-w-3xl bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[3rem] overflow-hidden">

                <div className="h-48 md:h-56 relative border-b border-white/40">
                    <Swiper
                        modules={[Autoplay, Pagination, EffectFade]}
                        effect="fade"
                        autoplay={{ delay: 4000 }}
                        pagination={{ clickable: true }}
                        className="h-full"
                    >
                        <SwiperSlide className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center p-8">
                                <h3 className="text-white text-xl md:text-2xl font-bold text-center leading-tight">
                                    "Excellence in special education and professional therapy."
                                </h3>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-center p-8">
                                <h3 className="text-white text-xl md:text-2xl font-bold text-center leading-tight">
                                    Every child deserves a world where they belong.
                                </h3>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>

                <div className="p-8 md:p-14 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                        <ShieldCheck size={16} /> Secure Payment Gateway
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                        Tuition & Rehabilitation Fees
                    </h2>

                    <p className="text-slate-600 mb-12 max-w-md mx-auto leading-relaxed text-lg">
                        Please have your child's <span className="font-bold text-slate-800 no-underline decoration-sky-300 decoration-2">Full Name</span> and your <span className="font-bold text-slate-800 no-underline decoration-sky-300 decoration-2">Invoice Amount</span> ready.
                    </p>

                    <div className="flex justify-center w-full">
                        <button
                            onClick={() => window.location.href = paystackLink}
                            className="group flex items-center justify-center gap-4 bg-slate-900 text-white font-bold py-5 px-10 md:px-16 rounded-2xl shadow-2xl transition-all hover:bg-sky-600 hover:scale-[1.05] active:scale-[0.95]"
                        >
                            <CreditCard className="transition-transform group-hover:rotate-12" />
                            <span className="text-lg">Proceed to Secure Payment</span>
                        </button>
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-3 text-sm text-slate-400 font-medium">
                        <Info size={16} className="text-sky-400" />
                        Transactions are secured and processed via Paystack
                    </div>
                </div>
            </div>

            <footer className="mt-12 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/50 flex items-center gap-4 transition-all hover:bg-white/60">
                    <div className="p-3 bg-white rounded-xl text-sky-600 shadow-sm">
                        <Phone size={20}/>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Emergency Contact</p>
                        <p className="text-slate-700 font-bold text-sm">+234 813 797 3130</p>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/50 flex items-center gap-4 transition-all hover:bg-white/60">
                    <div className="p-3 bg-white rounded-xl text-sky-600 shadow-sm">
                        <Mail size={20}/>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Email Support</p>
                        <p className="text-slate-700 font-bold text-sm truncate max-w-[180px] md:max-w-full">
                            elolamspecialhome@gmail.com
                        </p>
                    </div>
                </div>
            </footer>

            <p className="mt-8 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                © 2026 El-Olam Special Home · Dedicated to Excellence
            </p>
        </div>
    );
};

export default Payment;