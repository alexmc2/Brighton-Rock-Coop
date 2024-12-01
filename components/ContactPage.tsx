// src/app/contact/page.tsx
import React from 'react';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';
import FadeWrapper from './FadeWrapper';

const Contact: React.FC = () => {
  return (
    <div>
      <Hero title="Contact Us!" useSlideEffect={false} />

      <section className="bg-background pt-12 pb-10">
        <FadeWrapper useCustomAnimation delay={0}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-2xl shadow-sm p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
                Get in Touch
              </h2>
              <form
                action="https://formspree.io/f/mbjvjwlj"
                method="POST"
                className="space-y-4"
              >
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Message"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary dark:bg-secondary hover:bg-primary/90 text-primary-foreground dark:text-foreground"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </FadeWrapper>
      </section>
      <section className="bg-background pb-10">
        <FadeWrapper useCustomAnimation delay={400}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-2xl shadow-sm p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
                Our Location
              </h2>
              <div
                className="aspect-w-16 aspect-h-9"
                style={{ height: '400px' }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.0849833416496!2d-0.21057392336081204!3d50.82958977166704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48759a95de147337%3A0x6360d8e2eec4c7a0!2s399%20Kingsway%2C%20Hove%2C%20Brighton%20and%20Hove%2C%20Hove%20BN3%204QE!5e0!3m2!1sen!2suk!4v1689447900403!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </FadeWrapper>
      </section>
      <section className="bg-background pb-10">
        <FadeWrapper useCustomAnimation delay={100}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-2xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Connect With Us
              </h2>
              <p className="mb-4 text-lg text-foreground">
                For inquiries or for further information, feel free to reach out
                to us!
              </p>
              <div className="flex justify-center mb-4">
                <a
                  href="https://www.facebook.com/profile.php?id=100083542400718"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary dark:text-secondary hover:text-primary/80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
              <a
                href="mailto:brightonrockhousingco-op@outlook.com"
                className="text-primary dark:text-secondary hover:underline text-xl font-bold"
              >
                brightonrockhousingco-op@outlook.com
              </a>
              <p className="mt-4 text-foreground text-lg">
                Website designed and built by Alex McGarry
              </p>
            </div>
          </div>
        </FadeWrapper>
      </section>
    </div>
  );
};

export default Contact;
