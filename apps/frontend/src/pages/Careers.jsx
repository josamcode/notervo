// src/pages/Careers.js
import React, { useState } from "react";

const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(""); // success or error

    // Mock job listings — replace with API call later
    const jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            department: "Technology",
            location: "Cairo, Egypt (Hybrid)",
            type: "Full-time",
            salary: "EGP 12,000 – 18,000/month",
            description: `
        We're looking for a passionate Frontend Developer to join the growing tech team at Notervo.
        You’ll work on building fast, responsive, and beautiful interfaces using React, Tailwind CSS, and modern web standards.
        
        Responsibilities:
        - Develop reusable components and frontend features
        - Collaborate with designers and backend developers
        - Optimize performance and accessibility
        - Maintain code quality with testing and reviews
        
        Requirements:
        - 2+ years of experience in React.js
        - Strong knowledge of JavaScript, HTML5, CSS3
        - Experience with REST APIs and state management
        - Familiarity with Git, CI/CD, and agile workflows
      `,
        },
        {
            id: 2,
            title: "Customer Support Specialist",
            department: "Support",
            location: "Giza, Egypt (On-site)",
            type: "Full-time",
            salary: "EGP 6,000 – 8,000/month",
            description: `
        Join our customer experience team as a Support Specialist. 
        You'll help users with orders, returns, and general inquiries across email, chat, and phone.

        Responsibilities:
        - Respond to customer inquiries promptly and professionally
        - Process returns and exchanges
        - Escalate technical issues when needed
        - Contribute to improving support documentation

        Requirements:
        - Excellent communication skills in English and Arabic
        - Patient, empathetic, and solution-oriented mindset
        - Basic computer literacy
        - Previous support or retail experience is a plus
      `,
        },
        {
            id: 3,
            title: "Warehouse & Logistics Associate",
            department: "Operations",
            location: "Cairo, Egypt (On-site)",
            type: "Full-time",
            salary: "EGP 5,000 – 7,000/month",
            description: `
        Help us deliver notebooks faster. As a Warehouse Associate, you'll manage inventory, pack orders, and coordinate shipments.

        Responsibilities:
        - Pick, pack, and ship online orders accurately
        - Maintain warehouse cleanliness and organization
        - Track inventory levels and report discrepancies
        - Work closely with delivery partners

        Requirements:
        - Physical ability to lift up to 20kg
        - Attention to detail and time management
        - Willingness to work flexible hours during peak seasons
      `,
        },
    ];

    const handleOpenModal = (job) => {
        setSelectedJob(job);
        setForm({
            name: "",
            email: "",
            phone: "",
            coverLetter: "",
            resume: null,
        });
        setSubmitStatus("");
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
        setIsSubmitting(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, resume: e.target.files[0] }));
    };

    const handleSubmitApplication = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            console.log("Application submitted:", form, selectedJob);
            setSubmitStatus("success");
            setIsSubmitting(false);
        }, 1500);

        // In production: send data to backend API
        // await axios.post('/api/careers/apply', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    };

    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="py-24 px-6 text-center bg-surface">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Join the Notervo Team
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                        Be part of a fast-growing notebook brand focused on calm, premium stationery.
                    </p>
                    <a
                        href="#openings"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-xl hover:bg-black transition shadow-md hover:shadow-lg"
                    >
                        View Open Positions
                    </a>
                </div>
            </section>

            {/* Why Work With Us */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Why Work at Notervo?</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        We believe great people build great brands. Here’s what makes Notervo different.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {[
                        {
                            title: "Innovative Culture",
                            desc: "We encourage creativity, ownership, and continuous learning in everything we do.",
                            icon: (
                                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            ),
                        },
                        {
                            title: "Growth Opportunities",
                            desc: "Fast-track your career with mentorship, training, and room to grow into leadership roles.",
                            icon: (
                                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-8 8" />
                                </svg>
                            ),
                        },
                        {
                            title: "Work-Life Balance",
                            desc: "Flexible schedules, hybrid options, and paid time off so you can thrive both professionally and personally.",
                            icon: (
                                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-lg transition group">
                            <div className="flex justify-center mb-5">{item.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Open Positions */}
            <section id="openings" className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Current Openings</h2>
                    {jobs.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
                            <p className="text-gray-500">No positions available at this time.</p>
                            <p className="text-sm text-gray-400 mt-2">Check back soon!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group cursor-pointer"
                                    onClick={() => handleOpenModal(job)}
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition">
                                                {job.title}
                                            </h3>
                                            <p className="text-primary font-medium">{job.department}</p>
                                            <p className="text-gray-600 mt-1">{job.location}</p>
                                        </div>
                                        <div className="text-right md:text-left mt-2 md:mt-0">
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                                                {job.type}
                                            </span>
                                            <p className="text-gray-700 font-semibold mt-2">{job.salary}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Application Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                                    <p className="text-primary">{selectedJob.department}</p>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Details</h3>
                                <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                                    {selectedJob.description}
                                </div>
                            </div>

                            {submitStatus === "success" ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        ✓
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                                    <p className="text-gray-600">
                                        Thank you for applying to {selectedJob.title}. We'll review your application and get back to you within 5 business days.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitApplication} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF or DOCX) *</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                                        <textarea
                                            name="coverLetter"
                                            value={form.coverLetter}
                                            onChange={handleInputChange}
                                            rows="4"
                                            placeholder="Tell us why you're interested in this role..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`px-6 py-3 bg-primary text-white rounded-lg hover:bg-black transition ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {isSubmitting ? "Submitting..." : "Submit Application"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Final CTA */}
            <section className="py-20 px-6 bg-primary text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Don’t See the Right Role?</h2>
                    <p className="text-lg opacity-90 mb-10">
                        We’re always looking for talented individuals who share our passion for quality and style. Send us your resume and let’s talk.
                    </p>
                    <button
                        onClick={() => window.location.href = "mailto:careers@Notervo.com"}
                        className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Contact Us
                    </button>
                </div>
            </section>

            {/* Footer Note */}
            {/* <div className="text-center py-10 text-gray-500 text-sm border-t border-gray-100 bg-gray-50">
                <p>© {new Date().getFullYear()} Notervo. Crafted with ❤️ in Egypt.</p>
            </div> */}
        </main>
    );
};

export default Careers;
