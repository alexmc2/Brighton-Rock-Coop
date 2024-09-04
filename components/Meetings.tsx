import React from 'react';
import Hero from '@/components/Hero';
import FadeWrapper from './FadeWrapper';

const MeetingsPage: React.FC = () => {
  const meetingDates = [
    { date: 'Tues, Jan 16th', time: '7:30pm', location: '395' },
    { date: 'Weds, Feb 14th', time: '7:30pm', location: '397' },
    { date: 'Thurs, Mar 14th', time: '7:30pm', location: '399' },
    { date: 'Tues, Apr 16th', time: '7:30pm', location: '395 (AGM)' },
    { date: 'Weds, May 15th', time: '7:30pm', location: '397' },
    { date: 'Thurs, Jun 13th', time: '7:30pm', location: '399' },
    { date: 'Tues, Jul 16th', time: '7:30pm', location: '395' },
    { date: 'Weds, Aug 14th', time: '7:30pm', location: '397' },
    { date: 'Thurs, Sep 12th', time: '7:30pm', location: '399' },
    { date: 'Tues, Oct 15th', time: '7:30pm', location: '395' },
    { date: 'Weds, Nov 13th', time: '7:30pm', location: '397' },
    { date: 'Thurs, Dec 12th', time: '7:30pm', location: '399' },
  ];

  return (
    <div>
      <Hero title="Meeting Dates 2024" />

      <section className="bg-background py-16">
        <FadeWrapper useCustomAnimation delay={0}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-foreground text-center">
                Meeting Dates
              </h2>
              <p className="mb-8 text-xl text-foreground text-center">
                Meetings are held monthly. Visitors are welcome to attend if
                they contact the secretary in advance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetingDates.map((meeting, index) => (
                  <FadeWrapper
                    key={index}
                    useCustomAnimation
                    delay={index * 25}
                  >
                    <div className="bg-background p-4 rounded-md shadow-sm">
                      <p className="text-lg font-semibold text-foreground">
                        {meeting.date}
                      </p>
                      <p className="text-md text-foreground">{meeting.time}</p>
                      <p className="text-md text-primary dark:text-secondary">
                        Location: {meeting.location}
                      </p>
                    </div>
                  </FadeWrapper>
                ))}
              </div>
              <p className="mt-10 text-xl text-foreground text-center">
                To attend a meeting, please email the secretary at <br />
                <a
                  href="mailto:brightonrockhousingco-op@outlook.com"
                  className="text-primary dark:text-secondary hover:underline font-semibold"
                >
                  brightonrockhousingco-op@outlook.com
                </a>
              </p>
            </div>
          </div>
        </FadeWrapper>
      </section>
    </div>
  );
};

export default MeetingsPage;
