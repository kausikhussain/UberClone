import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageSquare, Phone } from 'lucide-react';

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I request a ride?",
      answer: "Enter your destination in the 'Where to?' box on the Rider Dashboard. Review the fare estimate, select your ride, and tap 'Confirm Ride'. A nearby driver will accept your request."
    },
    {
      question: "How is my fare calculated?",
      answer: "Fares are calculated using a base rate plus distance and time. During times of high demand, a surge multiplier may be applied to ensure reliability."
    },
    {
      question: "Can I cancel a ride?",
      answer: "Yes, you can cancel a ride before the driver arrives. Please note that a cancellation fee may apply if you cancel more than 5 minutes after the driver has accepted the request."
    },
    {
      question: "How do I apply a promo code?",
      answer: "On the booking screen, valid promo codes can be inserted into the 'Promo Code' input box. Once applied, the updated fare estimate will be reflected instantly."
    },
    {
      question: "How do I contact my driver?",
      answer: "Once a driver accepts your trip, you will see an option to call or message them anonymously directly from the Ride Status interface."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-64px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center mb-4">
          <HelpCircle className="mr-3 text-blue-600" size={36} /> 
          Help Center
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          We're here to help. Search through our frequently asked questions or reach out to our support team directly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Support Contact Cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="bg-white p-3 rounded-full shadow-sm text-blue-600 mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Live Chat</h3>
            <p className="text-sm text-gray-500">Wait time: ~2 mins</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="bg-white p-3 rounded-full shadow-sm text-gray-700 mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
            <p className="text-sm text-gray-500">support@rideflow.app</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="bg-white p-3 rounded-full shadow-sm text-gray-700 mb-4">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Call Support</h3>
            <p className="text-sm text-gray-500">1-800-RIDE-NOW</p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 ${openIndex === index ? 'bg-white shadow-md border-blue-100' : 'bg-white hover:bg-gray-50'}`}
            >
              <button
                className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? <ChevronUp className="text-blue-500 shrink-0" size={20} /> : <ChevronDown className="text-gray-400 shrink-0" size={20} />}
              </button>
              
              {openIndex === index && (
                <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
