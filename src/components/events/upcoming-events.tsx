import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Skeleton, User } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Event } from "../../types/event";

interface UpcomingEventsProps {
  events: Event[];
  isLoading: boolean;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, isLoading }) => {
  // Filter for upcoming events
  const upcomingEvents = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter(event => event.startDate >= today && event.status === 'published')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5); // Show only next 5 events
  }, [events]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status color mapping
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'cancelled': return 'danger';
      case 'completed': return 'secondary';
      default: return 'default';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // No upcoming events
  if (upcomingEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 flex justify-center">
          <Icon icon="lucide:calendar-x" className="text-4xl text-foreground-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
        <p className="text-foreground-500 mb-4">There are no published events scheduled for the future.</p>
        <Button 
          as={Link}
          to="/events/new"
          color="primary"
          variant="flat"
        >
          Create New Event
        </Button>
      </div>
    );
  }

  return (
    <Table removeWrapper aria-label="Upcoming events">
      <TableHeader>
        <TableColumn>EVENT</TableColumn>
        <TableColumn>DATE</TableColumn>
        <TableColumn>CATEGORY</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {upcomingEvents.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              <User
                name={event.title}
                description={event.shortDescription.length > 60 
                  ? `${event.shortDescription.substring(0, 60)}...` 
                  : event.shortDescription}
                avatarProps={{
                  src: event.featuredImage?.url || event.images[0]?.url,
                  fallback: <Icon icon="lucide:image" className="text-default-500" />
                }}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Icon icon="lucide:calendar" className="text-default-500" />
                <span>{formatDate(event.startDate)}</span>
              </div>
            </TableCell>
            <TableCell>
              <Chip size="sm" variant="flat">{event.category}</Chip>
            </TableCell>
            <TableCell>
              <Chip 
                size="sm" 
                color={getStatusColor(event.status)}
                variant="flat"
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Chip>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  as={Link}
                  to={`/events/${event.id}`}
                  size="sm"
                  variant="flat"
                  color="primary"
                  isIconOnly
                >
                  <Icon icon="lucide:eye" />
                </Button>
                <Button
                  as={Link}
                  to={`/events/${event.id}/edit`}
                  size="sm"
                  variant="flat"
                  color="default"
                  isIconOnly
                >
                  <Icon icon="lucide:edit" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};