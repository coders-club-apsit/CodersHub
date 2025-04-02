import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useMemo } from 'react';

const PrivacyPolicyModal = ({ open, onOpenChange }) => {
  // Memoize the date to prevent re-renders
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl h-[80vh] bg-background/95 backdrop-blur-xl border border-primary/10"
        aria-describedby="privacy-policy-content"
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Privacy Policy
          </DialogTitle>
          <DialogDescription id="privacy-policy-content" className="text-muted-foreground">
            Last updated: {currentDate}. This policy outlines how we collect, use, and protect your information.
          </DialogDescription>
          <DialogClose className="absolute right-0 top-0" />
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground">Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to Coder's Club! We are committed to protecting your privacy and ensuring 
                that your personal information is handled securely and responsibly. This Privacy 
                Policy explains how we collect, use, and protect your information when you use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                When you visit our website, we may collect the following types of information:
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Personal Information:</strong> Name, 
                  email address, student ID (if applicable), and other details you provide while signing up.
                </li>
                <li>
                  <strong className="text-foreground">Usage Data:</strong> IP address, 
                  browser type, pages visited, time spent on our site, and other analytics.
                </li>
                <li>
                  <strong className="text-foreground">Cookies:</strong> We use cookies to 
                  enhance user experience and track website performance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the collected information to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Provide access to learning resources and contests</li>
                <li>Improve our website experience</li>
                <li>Send updates, announcements, and important notifications</li>
                <li>Monitor and analyze website traffic and engagement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">Information Sharing & Security</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>We do not sell or share your personal data with third parties for marketing purposes.</li>
                <li>Your data is stored securely, and we take necessary precautions to prevent unauthorized access.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">Third-Party Links</h2>
              <p className="text-muted-foreground">
                Our website may contain links to external websites. We are not responsible for 
                their privacy policies or content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">Your Rights & Choices</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>You can request access, modification, or deletion of your personal data by contacting us.</li>
                <li>You can disable cookies through your browser settings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. Any changes will be posted 
                on this page with the revised effective date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
              <p className="text-muted-foreground">
                For any questions or concerns regarding this Privacy Policy, please contact us at:{' '}
                <a 
                  href="mailto:codersclub@apsit.edu.in" 
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  codersclub@apsit.edu.in
                </a>
              </p>
            </section>
            
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;