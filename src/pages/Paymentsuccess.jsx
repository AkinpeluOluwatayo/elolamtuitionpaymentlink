import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Paymentsuccess = () => {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState('verifying');
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [verifyingMessage, setVerifyingMessage] = useState('Securing Transaction...');

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://elolampaymentlink-backend.onrender.com';

    useEffect(() => {
        if (reference) {
            const verifyPayment = async () => {
                try {
                    setTimeout(() => setVerifyingMessage('Waking up payment server...'), 5000);
                    setTimeout(() => setVerifyingMessage('Verifying with Paystack...'), 20000);

                    let attempts = 0;
                    const maxAttempts = 8;
                    const delayBetweenAttempts = 10000;

                    while (attempts < maxAttempts) {
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 20000);

                            const response = await fetch(`${API_BASE_URL}/elolam/payments/verify`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ reference }),
                                signal: controller.signal
                            });

                            clearTimeout(timeoutId);

                            if (response.ok) {
                                const data = await response.json();
                                setPaymentDetails(data);
                                setStatus('success');
                                return;
                            }
                        } catch (fetchError) {
                            console.log(`Attempt ${attempts + 1}: Server warming up...`);
                        }
                        attempts++;
                        if (attempts < maxAttempts) await new Promise(r => setTimeout(r, delayBetweenAttempts));
                    }
                    throw new Error("Verification timed out");
                } catch (err) {
                    console.error("Final Error:", err);
                    setStatus('error');
                }
            };
            verifyPayment();
        }
    }, [reference, API_BASE_URL]);

    // Helper to load images from public folder
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = (e) => reject(e);
        });
    };

    const handleDownload = async () => {
        if (!paymentDetails) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        try {
            // 1. Load images from public/images/
            const logoData = await loadImage('/images/logo.png');
            const signatureData = await loadImage('/images/signature.png');

            // 2. Add Watermark
            doc.setTextColor(245, 245, 245);
            doc.setFontSize(60);
            doc.setFont(undefined, 'bold');
            doc.text("EL-OLAM OFFICIAL", pageWidth / 2, pageHeight / 2, {
                align: "center",
                angle: 45
            });

            // 3. Add Logo (Centered at top)
            doc.addImage(logoData, 'PNG', 85, 10, 40, 40);

            // 4. Header & Branding (Shifted down for logo)
            doc.setFontSize(22);
            doc.setTextColor(14, 165, 233);
            doc.text("EL-OLAM SPECIAL HOME", 105, 58, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("REHABILITATION & EDUCATION CENTER", 105, 65, { align: "center" });

            // 5. PAID Stamp
            doc.setDrawColor(34, 197, 94);
            doc.setLineWidth(0.5);
            doc.roundedRect(160, 15, 30, 10, 2, 2, 'S');
            doc.setTextColor(34, 197, 94);
            doc.setFontSize(12);
            doc.text("VERIFIED", 175, 21.5, { align: "center" });

            // 6. Receipt Table
            doc.autoTable({
                startY: 75,
                head: [['Description', 'Transaction Details']],
                body: [
                    ['Transaction Reference', reference],
                    ['Student Name', paymentDetails.studentName || 'N/A'],
                    ['Payer Name', paymentDetails.customerName || 'N/A'],
                    ['Amount Paid', `NGN ${paymentDetails.amount}`],
                    ['Payment Period', paymentDetails.paymentDuration || 'N/A'],
                    ['Date', paymentDetails.paidAt ? new Date(paymentDetails.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'],
                    ['Payment Status', 'SUCCESSFUL']
                ],
                theme: 'striped',
                headStyles: { fillColor: [14, 165, 233], fontStyle: 'bold' },
                styles: { fontSize: 11, cellPadding: 6 }
            });

            // 7. Signature Image & Block
            const finalY = doc.lastAutoTable.finalY;
            doc.addImage(signatureData, 'PNG', 135, finalY + 10, 40, 15);

            doc.setTextColor(0);
            doc.setFontSize(11);
            doc.text("__________________________", 155, finalY + 30, { align: "center" });
            doc.setFont(undefined, 'bold');
            doc.text("Amb. Dr. Mrs. Edward Grace", 155, finalY + 37, { align: "center" });
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text("CEO, El-Olam Special Home", 155, finalY + 42, { align: "center" });

            // 8. Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("This is a computer-generated receipt and requires no physical stamp.", 105, 285, { align: "center" });

            doc.save(`ElOlam_Receipt_${reference}.pdf`);

        } catch (error) {
            console.error("PDF Image Error:", error);
            alert("Could not load images. Generating text-only receipt...");
            // Standard fallback if images aren't found
            doc.text("EL-OLAM SPECIAL HOME", 105, 25, { align: "center" });
            doc.save(`ElOlam_Receipt_${reference}.pdf`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-8 px-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl rounded-[2.5rem] text-center border border-slate-100 relative overflow-hidden">
                {status === 'verifying' && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-sky-50 rounded-full mx-auto flex items-center justify-center animate-pulse">
                            <ShieldCheck className="text-sky-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{verifyingMessage}</h2>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-sky-500 h-full animate-pulse" style={{width: '70%'}}></div>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-in fade-in zoom-in duration-700">
                        <div className="w-24 h-24 bg-green-50 rounded-full mx-auto mb-8 flex items-center justify-center">
                            <CheckCircle className="text-green-500" size={50} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3">Verification Successful</h2>
                        <p className="text-slate-500 mb-10 leading-relaxed">
                            Payment for <strong>{paymentDetails?.studentName}</strong> has been verified.
                        </p>

                        <button
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-5 px-6 rounded-2xl hover:bg-sky-600 transition-all shadow-xl active:scale-95"
                        >
                            <Download size={22} /> Download Official Receipt
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-4">
                        <h2 className="text-xl font-bold text-slate-800">Verification Delayed</h2>
                        <button onClick={() => window.location.reload()} className="mt-4 text-sky-600 font-bold underline">Retry Now</button>
                    </div>
                )}

                <div className="mt-12 pt-6 border-t border-slate-50">
                    <Link to="/" className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase flex items-center justify-center gap-2">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Paymentsuccess;