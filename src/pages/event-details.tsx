import React from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Chip, 
  Divider, 
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEvents } from "../hooks/use-events";
import { motion } from "framer-motion";

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { getEventById, isLoading, deleteEvent, changeEventStatus, toggleFeatured } = useEvents();
  const [event, setEvent] = React.useState(getEventById(id));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Redirect if event not found
  React.useEffect(() => {
    if (!isLoading && !event) {
      history.push("/events");
    }
  }, [event, isLoading, history]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'cancelled': return 'danger';
      case 'completed': return 'secondary';
      default: return 'default';
    }
  };

  // Handle delete
  const handleDelete = async () => {
    await deleteEvent(id);
    history.push("/events");
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    const updatedEvent = await changeEventStatus(id, newStatus as any);
    setEvent(updatedEvent);
  };

  // Handle featured toggle
  const handleFeaturedToggle = async () => {
    const updatedEvent = await toggleFeatured(id);
    setEvent(updatedEvent);
  };

  if (isLoading || !event) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            as={Link}
            to="/events"
            variant="light"
            isIconOnly
            size="sm"
          >
            <Icon icon="lucide:arrow-left" />
          </Button>
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          {event.isFeatured && (
            <Chip color="warning" variant="flat" startContent={<Icon icon="lucide:star" />}>
              Featured
            </Chip>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            as={Link}
            to={`/events/${id}/edit`}
            color="primary"
            variant="flat"
            startContent={<Icon icon="lucide:edit" />}
          >
            Edit
          </Button>
          <Button
            color="danger"
            variant="flat"
            startContent={<Icon icon="lucide:trash-2" />}
            onPress={onOpen}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Actions */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Chip 
              size="lg" 
              color={getStatusColor(event.status)}
              variant="flat"
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Chip>
            <span className="text-foreground-500">
              Last updated: {new Date(event.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex gap-2">
            {event.status !== 'published' && (
              <Button 
                color="success" 
                variant="flat"
                startContent={<Icon icon="lucide:check-circle" />}
                onPress={() => handleStatusChange('published')}
              >
                Publish
              </Button>
            )}
            {event.status !== 'draft' && (
              <Button 
                variant="flat"
                startContent={<Icon icon="lucide:file" />}
                onPress={() => handleStatusChange('draft')}
              >
                Move to Draft
              </Button>
            )}
            {event.status !== 'cancelled' && (
              <Button 
                color="danger" 
                variant="flat"
                startContent={<Icon icon="lucide:x-circle" />}
                onPress={() => handleStatusChange('cancelled')}
              >
                Cancel
              </Button>
            )}
            {event.status !== 'completed' && (
              <Button 
                color="secondary" 
                variant="flat"
                startContent={<Icon icon="lucide:check-square" />}
                onPress={() => handleStatusChange('completed')}
              >
                Mark Completed
              </Button>
            )}
            <Button 
              color="warning" 
              variant="flat"
              startContent={<Icon icon="lucide:star" />}
              onPress={handleFeaturedToggle}
            >
              {event.isFeatured ? "Unfeature" : "Feature"}
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Images */}
          {(event.featuredImage || event.images.length > 0) && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Event Images</h2>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.featuredImage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="col-span-full"
                    >
                      <p className="text-sm text-foreground-500 mb-2">Featured Image</p>
                      <Image
                        src={event.featuredImage.url}
                        alt={event.featuredImage.alt}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </motion.div>
                  )}
                  {event.images.map((image, index) => (
                    <motion.div 
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Description</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-foreground-600 whitespace-pre-line">{event.description}</p>
            </CardBody>
          </Card>

          {/* Tickets */}
          {event.tickets && event.tickets.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Tickets</h2>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="space-y-4">
                  {event.tickets.map(ticket => (
                    <div key={ticket.id} className="flex justify-between items-center p-4 border border-divider rounded-lg">
                      <div>
                        <h3 className="font-medium">{ticket.name}</h3>
                        <p className="text-sm text-foreground-500">
                          {ticket.availableQuantity} available
                          {ticket.maxPerOrder && ` (max ${ticket.maxPerOrder} per order)`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {ticket.price === 0 ? 'Free' : `$${ticket.price.toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Event Details</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-4">
                {/* Date & Time */}
                <div>
                  <h3 className="text-sm text-foreground-500 mb-1">Date & Time</h3>
                  <div className="flex items-start gap-2">
                    <Icon icon="lucide:calendar" className="text-foreground-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{formatDate(event.startDate)}</p>
                      {event.startDate !== event.endDate && (
                        <p className="font-medium">to {formatDate(event.endDate)}</p>
                      )}
                      <p className="text-foreground-500">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm text-foreground-500 mb-1">Location</h3>
                  <div className="flex items-start gap-2">
                    <Icon icon="lucide:map-pin" className="text-foreground-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{event.location.address}</p>
                      <p className="text-foreground-500">
                        {event.location.city}, {event.location.state} {event.location.zipCode}
                      </p>
                      <p className="text-foreground-500">{event.location.country}</p>
                      {event.location.venueDetails && (
                        <p className="text-foreground-500 mt-1">{event.location.venueDetails}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category & Tags */}
                <div>
                  <h3 className="text-sm text-foreground-500 mb-1">Category</h3>
                  <Chip variant="flat">{event.category}</Chip>
                  
                  {event.tags.length > 0 && (
                    <>
                      <h3 className="text-sm text-foreground-500 mb-1 mt-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => (
                          <Chip key={tag} size="sm" variant="flat">{tag}</Chip>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Capacity */}
                {event.capacity && (
                  <div>
                    <h3 className="text-sm text-foreground-500 mb-1">Capacity</h3>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:users" className="text-foreground-500" />
                      <p className="font-medium">{event.capacity} attendees</p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Icon icon="lucide:user" className="text-foreground-500 mt-0.5" />
                  <p className="font-medium">{event.contact.name}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon icon="lucide:mail" className="text-foreground-500 mt-0.5" />
                  <p className="font-medium">{event.contact.email}</p>
                </div>
                {event.contact.phone && (
                  <div className="flex items-start gap-2">
                    <Icon icon="lucide:phone" className="text-foreground-500 mt-0.5" />
                    <p className="font-medium">{event.contact.phone}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Visibility */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Visibility</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:globe" className="text-foreground-500" />
                    <p>Public Event</p>
                  </div>
                  <Chip size="sm" color={event.isPublic ? "success" : "default"} variant="flat">
                    {event.isPublic ? "Yes" : "No"}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:star" className="text-foreground-500" />
                    <p>Featured Event</p>
                  </div>
                  <Chip size="sm" color={event.isFeatured ? "warning" : "default"} variant="flat">
                    {event.isFeatured ? "Yes" : "No"}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Event</ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={() => {
                  handleDelete();
                  onClose();
                }}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};