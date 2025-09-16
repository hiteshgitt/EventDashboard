import React from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Divider, 
  Input, 
  Textarea, 
  Switch,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  DatePicker,
  TimeInput,
  Spinner,
  Tabs,
  Tab
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEvents } from "../hooks/use-events";
import { Event, EventFormData, EventImage, EventTicket } from "../types/event";
import { eventCategories } from "../data/mock-events";
import { parseDate, parseTime, now, Time } from "@internationalized/date";
import { motion } from "framer-motion";

export const EventFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const { getEventById, createEvent, updateEvent, isLoading } = useEvents();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = React.useState<Partial<EventFormData>>({
    title: "",
    shortDescription: "",
    description: "",
    startDate: now().toString().split('T')[0],
    endDate: now().toString().split('T')[0],
    startTime: "09:00",
    endTime: "17:00",
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      venueDetails: ""
    },
    images: [],
    category: "",
    tags: [],
    status: "draft",
    isPublic: false,
    isFeatured: false,
    contact: {
      name: "",
      email: "",
      phone: ""
    },
    tickets: []
  });
  
  // Form validation
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [tagInput, setTagInput] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("details");
  
  // Load event data if in edit mode
  React.useEffect(() => {
    if (isEditMode && id) {
      const eventData = getEventById(id);
      if (eventData) {
        setFormData(eventData);
      } else {
        history.push("/events");
      }
    }
  }, [isEditMode, id, getEventById, history]);

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle nested field changes
  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
    
    // Clear error when field is updated
    const errorKey = `${parent}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  // Handle image upload
  const handleAddImage = () => {
    // In a real app, this would handle file upload
    // For this demo, we'll add a placeholder image
    const newImage: EventImage = {
      id: Math.random().toString(36).substring(2, 15),
      url: `https://img.heroui.chat/image/ai?w=800&h=400&u=event-${Date.now()}`,
      alt: "Event image"
    };
    
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), newImage]
    }));
  };

  const handleRemoveImage = (imageId: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img.id !== imageId) || [],
      // Also remove as featured image if it was selected
      featuredImage: prev.featuredImage?.id === imageId ? undefined : prev.featuredImage
    }));
  };

  const handleSetFeaturedImage = (image: EventImage) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: image
    }));
  };

  // Handle ticket management
  const handleAddTicket = () => {
    const newTicket: EventTicket = {
      id: Math.random().toString(36).substring(2, 15),
      name: "New Ticket",
      price: 0,
      availableQuantity: 100
    };
    
    setFormData(prev => ({
      ...prev,
      tickets: [...(prev.tickets || []), newTicket]
    }));
  };

  const handleUpdateTicket = (ticketId: string, field: keyof EventTicket, value: any) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets?.map(ticket => 
        ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
      ) || []
    }));
  };

  const handleRemoveTicket = (ticketId: string) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets?.filter(ticket => ticket.id !== ticketId) || []
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.shortDescription) newErrors.shortDescription = "Short description is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.category) newErrors.category = "Category is required";
    
    // Location validation
    if (!formData.location?.address) newErrors["location.address"] = "Address is required";
    if (!formData.location?.city) newErrors["location.city"] = "City is required";
    if (!formData.location?.country) newErrors["location.country"] = "Country is required";
    
    // Contact validation
    if (!formData.contact?.name) newErrors["contact.name"] = "Contact name is required";
    if (!formData.contact?.email) newErrors["contact.email"] = "Contact email is required";
    if (formData.contact?.email && !/\S+@\S+\.\S+/.test(formData.contact.email)) {
      newErrors["contact.email"] = "Invalid email format";
    }
    
    // Date validation
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date cannot be before start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show error and scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      if (isEditMode && id) {
        await updateEvent(id, formData as EventFormData);
        history.push(`/events/${id}`);
      } else {
        const newEvent = await createEvent(formData as EventFormData);
        history.push(`/events/${newEvent.id}`);
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            as={Link}
            to={isEditMode && id ? `/events/${id}` : "/events"}
            variant="light"
            isIconOnly
            size="sm"
          >
            <Icon icon="lucide:arrow-left" />
          </Button>
          <h1 className="text-2xl font-semibold">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="flat"
            as={Link}
            to={isEditMode && id ? `/events/${id}` : "/events"}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            {isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </div>

      {/* Form Tabs */}
      <Card>
        <CardBody>
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={setActiveTab as any}
            aria-label="Event form tabs"
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              cursor: "w-full bg-primary"
            }}
          >
            <Tab 
              key="details" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:info" />
                  <span>Basic Details</span>
                </div>
              }
            />
            <Tab 
              key="location" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:map-pin" />
                  <span>Location</span>
                </div>
              }
            />
            <Tab 
              key="media" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:image" />
                  <span>Media</span>
                </div>
              }
            />
            <Tab 
              key="tickets" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:ticket" />
                  <span>Tickets</span>
                </div>
              }
            />
            <Tab 
              key="settings" 
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:settings" />
                  <span>Settings</span>
                </div>
              }
            />
          </Tabs>
        </CardBody>
      </Card>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        {activeTab === "details" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Basic Information</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-6">
                <Input
                  id="title"
                  label="Event Title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onValueChange={(value) => handleChange("title", value)}
                  isRequired
                  isInvalid={!!errors.title}
                  errorMessage={errors.title}
                  fullWidth
                />
                
                <Input
                  id="shortDescription"
                  label="Short Description"
                  placeholder="Brief summary of your event (for listings)"
                  value={formData.shortDescription}
                  onValueChange={(value) => handleChange("shortDescription", value)}
                  isRequired
                  isInvalid={!!errors.shortDescription}
                  errorMessage={errors.shortDescription}
                  fullWidth
                />
                
                <Textarea
                  id="description"
                  label="Full Description"
                  placeholder="Detailed description of your event"
                  value={formData.description}
                  onValueChange={(value) => handleChange("description", value)}
                  isRequired
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  minRows={5}
                  maxRows={10}
                  fullWidth
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      id="startDate"
                      value={formData.startDate ? parseDate(formData.startDate) : undefined}
                      onChange={(date) => handleChange("startDate", date?.toString().split('T')[0])}
                      isInvalid={!!errors.startDate}
                      errorMessage={errors.startDate}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      id="endDate"
                      value={formData.endDate ? parseDate(formData.endDate) : undefined}
                      onChange={(date) => handleChange("endDate", date?.toString().split('T')[0])}
                      isInvalid={!!errors.endDate}
                      errorMessage={errors.endDate}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Time <span className="text-danger">*</span>
                    </label>
                    <TimeInput
                      id="startTime"
                      value={formData.startTime ? parseTime(formData.startTime) : new Time(9, 0)}
                      onChange={(time) => {
                        const timeStr = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
                        handleChange("startTime", timeStr);
                      }}
                      isInvalid={!!errors.startTime}
                      errorMessage={errors.startTime}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Time <span className="text-danger">*</span>
                    </label>
                    <TimeInput
                      id="endTime"
                      value={formData.endTime ? parseTime(formData.endTime) : new Time(17, 0)}
                      onChange={(time) => {
                        const timeStr = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
                        handleChange("endTime", timeStr);
                      }}
                      isInvalid={!!errors.endTime}
                      errorMessage={errors.endTime}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category <span className="text-danger">*</span>
                  </label>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="flat"
                        className={`justify-start ${!formData.category ? 'text-foreground-400' : ''}`}
                        fullWidth
                        isInvalid={!!errors.category}
                      >
                        {formData.category || "Select a category"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Categories"
                      selectionMode="single"
                      selectedKeys={formData.category ? [formData.category] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        handleChange("category", selected);
                      }}
                    >
                      {eventCategories.map((category) => (
                        <DropdownItem key={category}>{category}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  {errors.category && (
                    <p className="text-danger text-xs mt-1">{errors.category}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {formData.tags?.map((tag) => (
                      <Chip
                        key={tag}
                        onClose={() => handleRemoveTag(tag)}
                        variant="flat"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onValueChange={setTagInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      onPress={handleAddTag}
                      isDisabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <Input
                  id="capacity"
                  type="number"
                  label="Capacity (optional)"
                  placeholder="Maximum number of attendees"
                  value={formData.capacity?.toString() || ""}
                  onValueChange={(value) => handleChange("capacity", value ? parseInt(value) : undefined)}
                  min={1}
                />
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Contact Information</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-6">
                <Input
                  id="contact.name"
                  label="Contact Name"
                  placeholder="Name of the contact person"
                  value={formData.contact?.name || ""}
                  onValueChange={(value) => handleNestedChange("contact", "name", value)}
                  isRequired
                  isInvalid={!!errors["contact.name"]}
                  errorMessage={errors["contact.name"]}
                />
                
                <Input
                  id="contact.email"
                  label="Contact Email"
                  placeholder="Email address for inquiries"
                  value={formData.contact?.email || ""}
                  onValueChange={(value) => handleNestedChange("contact", "email", value)}
                  isRequired
                  isInvalid={!!errors["contact.email"]}
                  errorMessage={errors["contact.email"]}
                />
                
                <Input
                  id="contact.phone"
                  label="Contact Phone (optional)"
                  placeholder="Phone number for inquiries"
                  value={formData.contact?.phone || ""}
                  onValueChange={(value) => handleNestedChange("contact", "phone", value)}
                />
              </CardBody>
            </Card>
          </motion.div>
        )}
        
        {/* Location */}
        {activeTab === "location" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Event Location</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-6">
                <Input
                  id="location.address"
                  label="Address"
                  placeholder="Street address"
                  value={formData.location?.address || ""}
                  onValueChange={(value) => handleNestedChange("location", "address", value)}
                  isRequired
                  isInvalid={!!errors["location.address"]}
                  errorMessage={errors["location.address"]}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="location.city"
                    label="City"
                    placeholder="City"
                    value={formData.location?.city || ""}
                    onValueChange={(value) => handleNestedChange("location", "city", value)}
                    isRequired
                    isInvalid={!!errors["location.city"]}
                    errorMessage={errors["location.city"]}
                  />
                  
                  <Input
                    id="location.state"
                    label="State/Province"
                    placeholder="State or province"
                    value={formData.location?.state || ""}
                    onValueChange={(value) => handleNestedChange("location", "state", value)}
                  />
                  
                  <Input
                    id="location.zipCode"
                    label="Zip/Postal Code"
                    placeholder="Zip or postal code"
                    value={formData.location?.zipCode || ""}
                    onValueChange={(value) => handleNestedChange("location", "zipCode", value)}
                  />
                  
                  <Input
                    id="location.country"
                    label="Country"
                    placeholder="Country"
                    value={formData.location?.country || ""}
                    onValueChange={(value) => handleNestedChange("location", "country", value)}
                    isRequired
                    isInvalid={!!errors["location.country"]}
                    errorMessage={errors["location.country"]}
                  />
                </div>
                
                <Textarea
                  id="location.venueDetails"
                  label="Venue Details (optional)"
                  placeholder="Additional details about the venue (e.g., room number, floor, etc.)"
                  value={formData.location?.venueDetails || ""}
                  onValueChange={(value) => handleNestedChange("location", "venueDetails", value)}
                />
              </CardBody>
            </Card>
          </motion.div>
        )}
        
        {/* Media */}
        {activeTab === "media" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Event Images</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-foreground-500">Upload images for your event</p>
                  <Button
                    onPress={handleAddImage}
                    startContent={<Icon icon="lucide:plus" />}
                  >
                    Add Image
                  </Button>
                </div>
                
                {formData.images && formData.images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.images.map((image) => (
                      <div 
                        key={image.id} 
                        className="relative border border-divider rounded-lg overflow-hidden group"
                      >
                        <img 
                          src={image.url} 
                          alt={image.alt} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            isDisabled={formData.featuredImage?.id === image.id}
                            onPress={() => handleSetFeaturedImage(image)}
                          >
                            {formData.featuredImage?.id === image.id ? "Featured" : "Set as Featured"}
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => handleRemoveImage(image.id)}
                          >
                            Remove
                          </Button>
                        </div>
                        {formData.featuredImage?.id === image.id && (
                          <div className="absolute top-2 right-2">
                            <Chip color="warning" size="sm" variant="flat" startContent={<Icon icon="lucide:star" />}>
                              Featured
                            </Chip>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-divider rounded-lg p-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <Icon icon="lucide:image" className="text-4xl text-foreground-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No images added yet</h3>
                    <p className="text-foreground-500 mb-4">Add images to showcase your event</p>
                    <Button
                      onPress={handleAddImage}
                      startContent={<Icon icon="lucide:plus" />}
                    >
                      Add Image
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}
        
        {/* Tickets */}
        {activeTab === "tickets" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Event Tickets</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-foreground-500">Create tickets for your event</p>
                  <Button
                    onPress={handleAddTicket}
                    startContent={<Icon icon="lucide:plus" />}
                  >
                    Add Ticket
                  </Button>
                </div>
                
                {formData.tickets && formData.tickets.length > 0 ? (
                  <div className="space-y-4">
                    {formData.tickets.map((ticket) => (
                      <Card key={ticket.id} className="border border-divider">
                        <CardBody>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Ticket Name"
                              placeholder="e.g., General Admission, VIP, etc."
                              value={ticket.name}
                              onValueChange={(value) => handleUpdateTicket(ticket.id, "name", value)}
                            />
                            
                            <Input
                              type="number"
                              label="Price ($)"
                              placeholder="0.00"
                              value={ticket.price.toString()}
                              onValueChange={(value) => handleUpdateTicket(ticket.id, "price", parseFloat(value) || 0)}
                              min={0}
                              step={0.01}
                            />
                            
                            <Input
                              type="number"
                              label="Available Quantity"
                              placeholder="100"
                              value={ticket.availableQuantity.toString()}
                              onValueChange={(value) => handleUpdateTicket(ticket.id, "availableQuantity", parseInt(value) || 0)}
                              min={1}
                            />
                            
                            <Input
                              type="number"
                              label="Max Per Order (optional)"
                              placeholder="Leave blank for no limit"
                              value={ticket.maxPerOrder?.toString() || ""}
                              onValueChange={(value) => handleUpdateTicket(ticket.id, "maxPerOrder", value ? parseInt(value) : undefined)}
                              min={1}
                            />
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <Button
                              color="danger"
                              variant="flat"
                              size="sm"
                              onPress={() => handleRemoveTicket(ticket.id)}
                            >
                              Remove Ticket
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-divider rounded-lg p-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <Icon icon="lucide:ticket" className="text-4xl text-foreground-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No tickets created yet</h3>
                    <p className="text-foreground-500 mb-4">Add tickets to sell for your event</p>
                    <Button
                      onPress={handleAddTicket}
                      startContent={<Icon icon="lucide:plus" />}
                    >
                      Add Ticket
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}
        
        {/* Settings */}
        {activeTab === "settings" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Event Settings</h2>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-medium font-medium">Event Status</h3>
                    <p className="text-sm text-foreground-500">Set the current status of your event</p>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="flat"
                        color={
                          formData.status === 'published' ? 'success' :
                          formData.status === 'cancelled' ? 'danger' :
                          formData.status === 'completed' ? 'secondary' : 'default'
                        }
                      >
                        {formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1) || "Draft"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Event status"
                      selectionMode="single"
                      selectedKeys={formData.status ? [formData.status] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        handleChange("status", selected);
                      }}
                    >
                      <DropdownItem key="draft">Draft</DropdownItem>
                      <DropdownItem key="published">Published</DropdownItem>
                      <DropdownItem key="cancelled">Cancelled</DropdownItem>
                      <DropdownItem key="completed">Completed</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                
                <Divider />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-medium font-medium">Public Event</h3>
                    <p className="text-sm text-foreground-500">Make this event visible to the public</p>
                  </div>
                  <Switch
                    isSelected={formData.isPublic}
                    onValueChange={(value) => handleChange("isPublic", value)}
                  />
                </div>
                
                <Divider />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-medium font-medium">Featured Event</h3>
                    <p className="text-sm text-foreground-500">Highlight this event in featured sections</p>
                  </div>
                  <Switch
                    isSelected={formData.isFeatured}
                    onValueChange={(value) => handleChange("isFeatured", value)}
                  />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="flat"
            as={Link}
            to={isEditMode && id ? `/events/${id}` : "/events"}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            isLoading={isLoading}
          >
            {isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  );
};