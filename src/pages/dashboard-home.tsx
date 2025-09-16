import React from "react";
import { Card, CardBody, CardHeader, Button, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks/use-events";
import { EventStatusChart } from "../components/charts/event-status-chart";
import { EventCategoryChart } from "../components/charts/event-category-chart";
import { UpcomingEvents } from "../components/events/upcoming-events";
import { EventsOverviewStats } from "../components/events/events-overview-stats";

export const DashboardHome: React.FC = () => {
  const { events, isLoading, getEvents } = useEvents();
  
  React.useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Welcome back, Admin</h1>
          <p className="text-foreground-500">Here's an overview of your events</p>
        </div>
        <Button 
          as={Link}
          to="/events/new"
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
        >
          Create New Event
        </Button>
      </div>

      {/* Stats overview */}
      <EventsOverviewStats events={events} isLoading={isLoading} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Events by Status</h3>
            <Chip size="sm" color="primary" variant="flat">Last 30 days</Chip>
          </CardHeader>
          <CardBody>
            <EventStatusChart events={events} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Events by Category</h3>
            <Chip size="sm" color="primary" variant="flat">All events</Chip>
          </CardHeader>
          <CardBody>
            <EventCategoryChart events={events} />
          </CardBody>
        </Card>
      </div>

      {/* Upcoming events */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <Button 
            as={Link}
            to="/events"
            variant="light"
            color="primary"
            endContent={<Icon icon="lucide:arrow-right" />}
          >
            View All
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          <UpcomingEvents events={events} isLoading={isLoading} />
        </CardBody>
      </Card>
    </div>
  );
};