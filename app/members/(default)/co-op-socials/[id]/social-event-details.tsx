'use client';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Card } from '@/components/members/ui/card';
import { Button } from '@/components/members/ui/button';
import {
  SocialEventWithDetails,
  SocialEventParticipant,
  ParticipationStatus,
} from '@/types/members/social';
import { getUserColor } from '@/lib/members/utils';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/members/ui/radio-group';

interface SocialEventDetailsProps {
  event: SocialEventWithDetails;
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const formatDuration = (duration: string) => {
  const hours = parseInt(duration.split(' ')[0]);
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
};

export default function SocialEventDetails({
  event: initialEvent,
}: SocialEventDetailsProps) {
  const supabase = createClientComponentClient();
  const [event, setEvent] = useState(initialEvent);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    full_name: string | null;
  } | null>(null);
  const [currentUserStatus, setCurrentUserStatus] =
    useState<ParticipationStatus | null>(null);

  // Fetch current user and their participation status once on mount
  useEffect(() => {
    async function fetchUserAndStatus() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setCurrentUser(profile);

          // Get user's participation status for this event
          const { data: participation } = await supabase
            .from('social_event_participants')
            .select('status')
            .eq('event_id', event.id)
            .eq('user_id', user.id)
            .single();

          if (participation) {
            setCurrentUserStatus(participation.status as ParticipationStatus);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserAndStatus();
  }, [event.id, supabase]);

  // Handle participation updates with optimistic UI updates
  const handleParticipationUpdate = async (
    newStatus: ParticipationStatus | null
  ) => {
    if (!currentUser || isUpdating) return;

    setIsUpdating(true);

    // Optimistically update the UI
    const previousStatus = currentUserStatus;
    setCurrentUserStatus(newStatus);

    // Update the participants list optimistically
    const updatedParticipants = [...(event.participants || [])];
    const userIndex = updatedParticipants.findIndex(
      (p) => p.user_id === currentUser.id
    );

    if (newStatus === null) {
      // Remove participation
      if (userIndex > -1) {
        updatedParticipants.splice(userIndex, 1);
      }
    } else {
      // Add or update participation
      const updatedParticipant: SocialEventParticipant = {
        event_id: event.id,
        user_id: currentUser.id,
        status: newStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: currentUser,
      };

      if (userIndex > -1) {
        updatedParticipants[userIndex] = updatedParticipant;
      } else {
        updatedParticipants.push(updatedParticipant);
      }
    }

    setEvent((prev) => ({
      ...prev,
      participants: updatedParticipants,
    }));

    try {
      if (newStatus === null) {
        // Remove participation
        await supabase
          .from('social_event_participants')
          .delete()
          .eq('event_id', event.id)
          .eq('user_id', currentUser.id);
      } else {
        // Add or update participation
        await supabase.from('social_event_participants').upsert({
          event_id: event.id,
          user_id: currentUser.id,
          status: newStatus,
        });
      }
    } catch (error) {
      console.error('Error updating participation:', error);
      // Revert optimistic updates on error
      setCurrentUserStatus(previousStatus);
      setEvent((prev) => ({
        ...prev,
        participants: event.participants,
      }));
    } finally {
      setIsUpdating(false);
    }
  };

  // Group participants by status
  const participantsByStatus = event.participants?.reduce(
    (acc, participant) => {
      const status = participant.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(participant);
      return acc;
    },
    {
      going: [] as SocialEventParticipant[],
      maybe: [] as SocialEventParticipant[],
      not_going: [] as SocialEventParticipant[],
    }
  ) || { going: [], maybe: [], not_going: [] };

  // Only count "going" participants, exclude "maybe" from this count
  const activeParticipantCount =
    event.participants?.filter((p) => p.status === 'going').length || 0;

  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Description
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {event.event_date && (
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Event Date
              </h3>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(event.event_date), 'EEEE, MMMM do yyyy')}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            {event.start_time && (
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Start Time
                </h3>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTime(event.start_time)}
                </div>
              </div>
            )}

            {event.duration && (
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Duration
                </h3>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDuration(event.duration)}
                </div>
              </div>
            )}

            {event.location && (
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Location
                </h3>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Created By
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {event.created_by_user.full_name || event.created_by_user.email}
              </p>
            </div>
          </div>
        </div>

        {event.open_to_everyone && (
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Going
            </h3>
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
              <Users className="w-4 h-4 mr-2" />
              {activeParticipantCount}{' '}
              {activeParticipantCount === 1 ? 'person going' : 'people going'}
            </div>
          </div>
        )}

        {/* Created By and Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Event Created
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {format(new Date(event.created_at), 'PPp')}
            </p>
          </div>

          <div>
            <div className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Last Updated
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {format(new Date(event.updated_at), 'PPp')}
            </p>
          </div>
        </div>

        {/* Participants Section */}
        {event.open_to_everyone && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="bg-slate-50 dark:bg-slate-900/90 rounded-lg p-4">
              {/* Participation Options */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <RadioGroup
                    value={currentUserStatus || ''}
                    onValueChange={(value) => {
                      // If value is "", consider it as null (no selection)
                      const newStatus =
                        value === '' ? null : (value as ParticipationStatus);
                      handleParticipationUpdate(newStatus);
                    }}
                    className="flex flex-row items-center gap-3"
                  >
                    {/* Going - Green */}
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="going"
                        className="border-green-500 border-3 text-green-500 focus-visible:ring-green-500"
                      />
                      <span className="text-sm text-slate-700 pt-1 dark:text-slate-200 pl-1">
                        Going
                      </span>
                    </div>

                    {/* Maybe - Yellow */}
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="maybe"
                        className="border-yellow-500 border-3 text-yellow-500 focus-visible:ring-yellow-500"
                      />
                      <span className="text-sm text-slate-700 pt-1 dark:text-slate-200 pl-1">
                        Maybe
                      </span>
                    </div>

                    {/* Not Going - Red */}
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="not_going"
                        className="border-red-500 border-3 text-red-500 focus-visible:ring-red-500"
                      />
                      <span className="text-sm text-slate-700 pt-1 dark:text-slate-200 pl-1">
                        Not Going
                      </span>
                    </div>
                  </RadioGroup>

                  {/* Clear button */}
                  {currentUserStatus && (
                    <Button
                      variant="ghost"
                      onClick={() => handleParticipationUpdate(null)}
                      disabled={isUpdating}
                      size="sm"
                      className="text-xs sm:text-sm pt-2"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {/* Participant Lists */}
              <div className="space-y-6">
                {(['going', 'maybe', 'not_going'] as const).map((status) => {
                  const participants = participantsByStatus[status];
                  if (!participants?.length) return null;

                  return (
                    <div key={status}>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-3 capitalize">
                        {status.replace('_', ' ')} ({participants.length})
                      </h4>
                      <div className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {participants.map((participant) => (
                          <div
                            key={participant.user_id}
                            className="flex items-center px-4 py-3"
                          >
                            <div
                              className={`h-8 w-8 rounded-full ${getUserColor(
                                participant.user_id
                              )} flex items-center justify-center`}
                            >
                              <span className="text-sm font-medium text-white">
                                {participant.user?.full_name?.[0]?.toUpperCase() ||
                                  participant.user?.email[0]?.toUpperCase()}
                              </span>
                            </div>
                            <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                              {participant.user?.full_name ||
                                participant.user?.email}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
