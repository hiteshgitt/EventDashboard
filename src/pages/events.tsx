import React from "react";
import { 
  Button, 
  Card, 
  CardBody, 
  Input, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  User,
  Spinner,
  Tooltip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useEvents } from "../hooks/use-events";
import { Event } from "../types/event";
import { eventCategories } from "../data/mock-events";
import { motion } from "framer-motion";

export const EventsPage: React.FC = () => {
  const { events, isLoading, getEvents, changeEventStatus, toggleFeatured, deleteEvent } = useEvents();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  // Load events on mount and when filters change
  React.useEffect(() => {
    const filters: {
      search?: string;
      category?: string;
      status?: string;
    } = {};

    if (searchQuery) filters.search = searchQuery;
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedStatus) filters.status = selectedStatus;

    getEvents(filters);
  }, [getEvents, searchQuery, selectedCategory, selectedStatus]);

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

  // Handle status change
  const handleStatusChange = async (eventId: string, newStatus: Event['status']) => {
    await changeEventStatus(eventId, newStatus);
  };

  // Handle featured toggle
  const handleFeaturedToggle = async (eventId: string) => {
    await toggleFeatured(eventId);
  };

  // Handle delete
  const handleDelete = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      await deleteEvent(eventId);
    }
  };

  // Calculate pagination
  const pages = Math.ceil(events.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return events.slice(start, end);
  }, [page, events]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Events</h1>
          <p className="text-foreground-500">Manage your events</p>
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

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              className="md:max-w-xs"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="flat" 
                    endContent={<Icon icon="lucide:chevron-down" className="text-small" />}
                  >
                    {selectedCategory || "All Categories"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Categories"
                  selectionMode="single"
                  selectedKeys={selectedCategory ? [selectedCategory] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedCategory(selected);
                  }}
                >
                  <DropdownItem key="">All Categories</DropdownItem>
                  {eventCategories.map((category) => (
                    <DropdownItem key={category}>{category}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    variant="flat" 
                    endContent={<Icon icon="lucide:chevron-down" className="text-small" />}
                  >
                    {selectedStatus ? selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1) : "All Statuses"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Statuses"
                  selectionMode="single"
                  selectedKeys={selectedStatus ? [selectedStatus] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedStatus(selected);
                  }}
                >
                  <DropdownItem key="">All Statuses</DropdownItem>
                  <DropdownItem key="published">Published</DropdownItem>
                  <DropdownItem key="draft">Draft</DropdownItem>
                  <DropdownItem key="cancelled">Cancelled</DropdownItem>
                  <DropdownItem key="completed">Completed</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Events Table */}
      <Card>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex justify-center"
              >
                <Icon icon="lucide:calendar-x" className="text-5xl text-foreground-400" />
              </motion.div>
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-foreground-500 mb-6">
                {searchQuery || selectedCategory || selectedStatus ? 
                  "Try adjusting your filters to find what you're looking for." : 
                  "Get started by creating your first event."}
              </p>
              <Button 
                as={Link}
                to="/events/new"
                color="primary"
              >
                Create New Event
              </Button>
            </div>
          ) : (
            <>
              <Table removeWrapper aria-label="Events table">
                <TableHeader>
                  <TableColumn>EVENT</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {items.map((event) => (
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
                        {event.isFeatured && (
                          <Tooltip content="Featured Event">
                            <span className="ml-2">
                              <Icon icon="lucide:star" className="text-warning" />
                            </span>
                          </Tooltip>
                        )}
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
                          <Tooltip content="View Details">
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
                          </Tooltip>
                          <Tooltip content="Edit Event">
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
                          </Tooltip>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                size="sm"
                                variant="flat"
                                isIconOnly
                              >
                                <Icon icon="lucide:more-vertical" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Event actions">
                              {event.status !== 'published' && (
                                <DropdownItem 
                                  key="publish"
                                  startContent={<Icon icon="lucide:check-circle" />}
                                  onPress={() => handleStatusChange(event.id, 'published')}
                                >
                                  Publish
                                </DropdownItem>
                              )}
                              {event.status !== 'draft' && (
                                <DropdownItem 
                                  key="draft"
                                  startContent={<Icon icon="lucide:file" />}
                                  onPress={() => handleStatusChange(event.id, 'draft')}
                                >
                                  Move to Draft
                                </DropdownItem>
                              )}
                              {event.status !== 'cancelled' && (
                                <DropdownItem 
                                  key="cancel"
                                  startContent={<Icon icon="lucide:x-circle" />}
                                  onPress={() => handleStatusChange(event.id, 'cancelled')}
                                >
                                  Cancel Event
                                </DropdownItem>
                              )}
                              {event.status !== 'completed' && (
                                <DropdownItem 
                                  key="complete"
                                  startContent={<Icon icon="lucide:check-square" />}
                                  onPress={() => handleStatusChange(event.id, 'completed')}
                                >
                                  Mark as Completed
                                </DropdownItem>
                              )}
                              <DropdownItem 
                                key="feature"
                                startContent={<Icon icon="lucide:star" />}
                                onPress={() => handleFeaturedToggle(event.id)}
                              >
                                {event.isFeatured ? "Unfeature Event" : "Feature Event"}
                              </DropdownItem>
                              <DropdownItem 
                                key="delete"
                                className="text-danger"
                                color="danger"
                                startContent={<Icon icon="lucide:trash-2" />}
                                onPress={() => handleDelete(event.id)}
                              >
                                Delete Event
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-center mt-6">
                <Pagination
                  total={pages}
                  initialPage={1}
                  page={page}
                  onChange={setPage}
                />
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};