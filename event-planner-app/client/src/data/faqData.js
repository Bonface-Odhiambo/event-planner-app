export const faqData = [
  {
    id: 1,
    question: "What types of events do you plan?",
    answer: "We specialize in weddings, corporate events, birthday parties, anniversaries, baby showers, and custom celebrations. Our team can handle events of any size, from intimate gatherings to large-scale celebrations.",
    keywords: ["events", "types", "wedding", "corporate", "birthday", "party", "celebration"]
  },
  {
    id: 2,
    question: "How much do your services cost?",
    answer: "Our pricing varies based on event type, size, and services needed. Wedding packages start at $2,500, corporate events from $1,500, and social events from $800. Contact us for a personalized quote based on your specific needs.",
    keywords: ["cost", "price", "pricing", "budget", "expensive", "cheap", "quote"]
  },
  {
    id: 3,
    question: "How far in advance should I book?",
    answer: "We recommend booking 3-6 months in advance for weddings, 2-3 months for corporate events, and 4-6 weeks for social gatherings. However, we can accommodate shorter timelines based on availability.",
    keywords: ["book", "advance", "timeline", "when", "schedule", "availability"]
  },
  {
    id: 4,
    question: "Do you provide vendors and catering?",
    answer: "Yes! We have partnerships with trusted vendors including caterers, photographers, florists, and entertainment. We can coordinate all aspects of your event or work with your preferred vendors.",
    keywords: ["vendors", "catering", "food", "photographer", "florist", "entertainment", "music"]
  },
  {
    id: 5,
    question: "What areas do you serve?",
    answer: "We primarily serve the greater metropolitan area and surrounding regions within a 50-mile radius. For destination events, additional travel fees may apply. Contact us to discuss your location.",
    keywords: ["location", "area", "serve", "travel", "destination", "where"]
  },
  {
    id: 6,
    question: "Can I make changes to my event after booking?",
    answer: "Absolutely! We understand that plans can change. Minor adjustments can usually be made up to 2 weeks before your event. Major changes may require additional fees and are subject to vendor availability.",
    keywords: ["changes", "modify", "update", "cancel", "reschedule", "flexible"]
  },
  {
    id: 7,
    question: "Do you offer payment plans?",
    answer: "Yes, we offer flexible payment options. Typically, we require a 30% deposit to secure your date, with the remaining balance due 2 weeks before your event. Custom payment plans can be arranged.",
    keywords: ["payment", "deposit", "installment", "plan", "finance", "money"]
  },
  {
    id: 8,
    question: "What happens if there's bad weather for outdoor events?",
    answer: "We always have contingency plans for outdoor events. This includes backup indoor venues, tent rentals, or rescheduling options. Weather monitoring begins 7 days before your event.",
    keywords: ["weather", "outdoor", "rain", "backup", "tent", "indoor", "contingency"]
  },
  {
    id: 9,
    question: "Do you handle decorations and setup?",
    answer: "Yes! Our full-service packages include decoration design, setup, and breakdown. We handle everything from centerpieces and lighting to linens and floral arrangements.",
    keywords: ["decorations", "setup", "design", "flowers", "centerpieces", "lighting", "breakdown"]
  },
  {
    id: 10,
    question: "How do I get started?",
    answer: "Getting started is easy! You can book a free consultation through our website, call us directly, or use this chat to connect with our team. We'll discuss your vision and create a custom proposal.",
    keywords: ["start", "begin", "consultation", "contact", "book", "proposal"]
  }
];

export const findFAQAnswer = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Find FAQ that matches keywords
  const matchedFAQ = faqData.find(faq => 
    faq.keywords.some(keyword => message.includes(keyword.toLowerCase()))
  );
  
  return matchedFAQ;
};

export const getWelcomeMessage = () => {
  return {
    type: 'bot',
    content: `👋 Welcome to Elegant Events! I'm here to help you.

How can I assist you today?

🤖 **Ask me about:**
• Event types and services
• Pricing and packages  
• Booking process
• Vendors and catering
• Timeline and planning

💬 **Or choose:**
• Type your question for instant answers
• Say "live chat" to speak with our team
• Browse our FAQ below

What would you like to know?`
  };
};

export const getLiveChatMessage = () => {
  return {
    type: 'bot',
    content: `🔄 Connecting you with our live support team...

A team member will be with you shortly. In the meantime, feel free to describe your event needs and we'll make sure the right person assists you.

**Average response time:** 2-5 minutes during business hours
**Business hours:** Mon-Fri 9AM-6PM, Sat 10AM-4PM`
  };
};

export const getNoMatchMessage = () => {
  return {
    type: 'bot',
    content: `I'm not sure about that specific question, but I'd love to help! 

You can:
• Try rephrasing your question
• Type "live chat" to speak with our team
• Browse our common questions below:

**Popular topics:**
• Event pricing and packages
• Booking timeline
• Services included
• Vendor coordination
• Payment options

What else can I help you with?`
  };
};
