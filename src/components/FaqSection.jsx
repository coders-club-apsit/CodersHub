import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  const faqs = [
    {
        "question": "What is Coder's Club?",
        "answer": "Coder's Club is a student-run community focused on improving problem-solving skills through Data Structures and Algorithms (DSA). The club organizes workshops, coding competitions, and peer-learning sessions to help students excel in competitive programming."
      },
      {
        "question": "What programming languages does the club focus on?",
        "answer": "We primarily focus on languages popular for DSA, such as C++, Java, and Python. However, you can use any language you're comfortable with for solving problems."
      },
      {
        "question": "What kind of resources does the club provide?",
        "answer": "The club provides:\n\n- Curated roadmaps for learning DSA.\n- Practice questions on platforms like LeetCode and HackerRank."
      },
      {
        "question": "Does the club organize coding competitions?",
        "answer": "Yes, we regularly organize coding contests on platforms like HackerRank. These contests are designed to challenge members and foster healthy competition."
      },
      {
        "question": "How do I log in to the website?",
        "answer": "Use your registered college email and password to log in. New members can sign up directly through the registration page."
      }
  ];
  
  const FaqSection = () => {
    return (
      <section id="faq" className="w-100 py-20 relative overflow-hidden">
        <div className="absolute top-40 right-0 size-[400px] rounded-full"/>
        
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our club, activities, and how to get involved.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto glass-card p-6 rounded-xl" id="faq">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  };
  
  export default FaqSection;