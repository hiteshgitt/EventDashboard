import React from "react";
import { Event, EventFormData } from "../types/event";
import { allEvents } from "../data/mock-events";
import { addToast } from "@heroui/react";

export const useEvents = () => {
  const [events, setEvents] = React.useState<Event[]>(allEvents);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Get all events with optional filtering
  const getEvents = React.useCallback((filters?: {
    status?: string;
    category?: string;
    search?: string;
    featured?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        let filteredEvents = [...allEvents];
        
        if (filters) {
          if (filters.status) {
            filteredEvents = filteredEvents.filter(event => event.status === filters.status);
          }
          
          if (filters.category) {
            filteredEvents = filteredEvents.filter(event => event.category === filters.category);
          }
          
          if (filters.featured !== undefined) {
            filteredEvents = filteredEvents.filter(event => event.isFeatured === filters.featured);
          }
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredEvents = filteredEvents.filter(event => 
              event.title.toLowerCase().includes(searchLower) || 
              event.description.toLowerCase().includes(searchLower) ||
              event.shortDescription.toLowerCase().includes(searchLower) ||
              event.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
          }
        }
        
        setEvents(filteredEvents);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch events");
        setIsLoading(false);
      }
    }, 800);
  }, []);

  // Get a single event by ID
  const getEventById = React.useCallback((id: string): Event | undefined => {
    return events.find(event => event.id === id);
  }, [events]);

  // Create a new event
  const createEvent = React.useCallback((eventData: EventFormData): Promise<Event> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        try {
          // Generate a slug from the title
          const slug = eventData.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-');
          
          // Create new event with ID and timestamps
          const newEvent: Event = {
            ...eventData,
            id: Math.random().toString(36).substring(2, 15),
            slug,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Update state
          setEvents(prevEvents => [...prevEvents, newEvent]);
          setIsLoading(false);
          
          addToast({
            title: "Event Created",
            description: `"${newEvent.title}" has been created successfully.`,
            color: "success"
          });
          
          resolve(newEvent);
        } catch (err) {
          setError("Failed to create event");
          setIsLoading(false);
          reject(err);
        }
      }, 1000);
    });
  }, []);

  // Update an existing event
  const updateEvent = React.useCallback((id: string, eventData: Partial<EventFormData>): Promise<Event> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        try {
          // Find the event to update
          const eventIndex = events.findIndex(event => event.id === id);
          
          if (eventIndex === -1) {
            throw new Error("Event not found");
          }
          
          // Update the event
          const updatedEvent: Event = {
            ...events[eventIndex],
            ...eventData,
            updatedAt: new Date().toISOString()
          };
          
          // Update state
          const updatedEvents = [...events];
          updatedEvents[eventIndex] = updatedEvent;
          setEvents(updatedEvents);
          setIsLoading(false);
          
          addToast({
            title: "Event Updated",
            description: `"${updatedEvent.title}" has been updated successfully.`,
            color: "success"
          });
          
          resolve(updatedEvent);
        } catch (err) {
          setError("Failed to update event");
          setIsLoading(false);
          reject(err);
        }
      }, 1000);
    });
  }, [events]);

  // Delete an event
  const deleteEvent = React.useCallback((id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        try {
          // Find the event to delete
          const eventToDelete = events.find(event => event.id === id);
          
          if (!eventToDelete) {
            throw new Error("Event not found");
          }
          
          // Update state
          setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
          setIsLoading(false);
          
          addToast({
            title: "Event Deleted",
            description: `"${eventToDelete.title}" has been deleted.`,
            color: "danger"
          });
          
          resolve();
        } catch (err) {
          setError("Failed to delete event");
          setIsLoading(false);
          reject(err);
        }
      }, 1000);
    });
  }, [events]);

  // Change event status
  const changeEventStatus = React.useCallback((id: string, status: Event['status']): Promise<Event> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        try {
          // Find the event to update
          const eventIndex = events.findIndex(event => event.id === id);
          
          if (eventIndex === -1) {
            throw new Error("Event not found");
          }
          
          // Update the event status
          const updatedEvent: Event = {
            ...events[eventIndex],
            status,
            updatedAt: new Date().toISOString()
          };
          
          // Update state
          const updatedEvents = [...events];
          updatedEvents[eventIndex] = updatedEvent;
          setEvents(updatedEvents);
          setIsLoading(false);
          
          const statusMessage = status === 'published' ? 'published' : 
                               status === 'draft' ? 'moved to drafts' : 
                               status === 'cancelled' ? 'cancelled' : 'completed';
          
          addToast({
            title: "Event Status Updated",
            description: `"${updatedEvent.title}" has been ${statusMessage}.`,
            color: status === 'cancelled' ? "warning" : "success"
          });
          
          resolve(updatedEvent);
        } catch (err) {
          setError(`Failed to change event status to ${status}`);
          setIsLoading(false);
          reject(err);
        }
      }, 800);
    });
  }, [events]);

  // Toggle featured status
  const toggleFeatured = React.useCallback((id: string): Promise<Event> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        try {
          // Find the event to update
          const eventIndex = events.findIndex(event => event.id === id);
          
          if (eventIndex === -1) {
            throw new Error("Event not found");
          }
          
          // Toggle featured status
          const updatedEvent: Event = {
            ...events[eventIndex],
            isFeatured: !events[eventIndex].isFeatured,
            updatedAt: new Date().toISOString()
          };
          
          // Update state
          const updatedEvents = [...events];
          updatedEvents[eventIndex] = updatedEvent;
          setEvents(updatedEvents);
          setIsLoading(false);
          
          addToast({
            title: updatedEvent.isFeatured ? "Event Featured" : "Event Unfeatured",
            description: `"${updatedEvent.title}" has been ${updatedEvent.isFeatured ? 'featured' : 'unfeatured'}.`,
            color: "success"
          });
          
          resolve(updatedEvent);
        } catch (err) {
          setError("Failed to toggle featured status");
          setIsLoading(false);
          reject(err);
        }
      }, 500);
    });
  }, [events]);

  return {
    events,
    isLoading,
    error,
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    changeEventStatus,
    toggleFeatured
  };
};
