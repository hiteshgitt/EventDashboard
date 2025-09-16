import React from "react";
import { Card, CardBody, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Event } from "../../types/event";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  isLoading: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, isLoading }) => {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon icon={icon} className="text-2xl text-white" />
        </div>
        <div>
          <p className="text-sm text-foreground-500">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-20 rounded-lg" />
          ) : (
            <p className="text-2xl font-semibold">{value}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

interface EventsOverviewStatsProps {
  events: Event[];
  isLoading: boolean;
}

export const EventsOverviewStats: React.FC<EventsOverviewStatsProps> = ({ events, isLoading }) => {
  // Calculate stats
  const totalEvents = events.length;
  const publishedEvents = events.filter(event => event.status === 'published').length;
  const upcomingEvents = events.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    return event.status === 'published' && event.startDate >= today;
  }).length;
  const featuredEvents = events.filter(event => event.isFeatured).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Events"
        value={totalEvents}
        icon="lucide:calendar"
        color="bg-primary"
        isLoading={isLoading}
      />
      <StatsCard
        title="Published Events"
        value={publishedEvents}
        icon="lucide:check-circle"
        color="bg-success"
        isLoading={isLoading}
      />
      <StatsCard
        title="Upcoming Events"
        value={upcomingEvents}
        icon="lucide:clock"
        color="bg-warning"
        isLoading={isLoading}
      />
      <StatsCard
        title="Featured Events"
        value={featuredEvents}
        icon="lucide:star"
        color="bg-secondary"
        isLoading={isLoading}
      />
    </div>
  );
};