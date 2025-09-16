import React from "react";
import { Card, CardBody, CardHeader, Divider, Input, Button, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";

export const SettingsPage: React.FC = () => {
  const [generalSettings, setGeneralSettings] = React.useState({
    siteName: "Event Management",
    siteDescription: "Admin panel for managing events",
    contactEmail: "admin@example.com",
    supportPhone: "+1 (555) 123-4567"
  });

  const [notificationSettings, setNotificationSettings] = React.useState({
    emailNotifications: true,
    eventCreated: true,
    eventUpdated: true,
    eventCancelled: true,
    dailySummary: false
  });

  const handleGeneralChange = (field: string, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveGeneral = () => {
    // In a real app, this would save to an API
    console.log("Saving general settings:", generalSettings);
  };

  const handleSaveNotifications = () => {
    // In a real app, this would save to an API
    console.log("Saving notification settings:", notificationSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-foreground-500">Configure your event management system</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">General Settings</h2>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-6">
          <Input
            label="Site Name"
            placeholder="Enter site name"
            value={generalSettings.siteName}
            onValueChange={(value) => handleGeneralChange("siteName", value)}
          />
          
          <Input
            label="Site Description"
            placeholder="Enter site description"
            value={generalSettings.siteDescription}
            onValueChange={(value) => handleGeneralChange("siteDescription", value)}
          />
          
          <Input
            label="Contact Email"
            placeholder="Enter contact email"
            value={generalSettings.contactEmail}
            onValueChange={(value) => handleGeneralChange("contactEmail", value)}
          />
          
          <Input
            label="Support Phone"
            placeholder="Enter support phone number"
            value={generalSettings.supportPhone}
            onValueChange={(value) => handleGeneralChange("supportPhone", value)}
          />
          
          <div className="flex justify-end">
            <Button
              color="primary"
              onPress={handleSaveGeneral}
            >
              Save General Settings
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Notification Settings</h2>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-medium font-medium">Email Notifications</h3>
              <p className="text-sm text-foreground-500">Enable email notifications</p>
            </div>
            <Switch
              isSelected={notificationSettings.emailNotifications}
              onValueChange={(value) => handleNotificationChange("emailNotifications", value)}
            />
          </div>
          
          <Divider />
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-medium font-medium">Event Created</h3>
              <p className="text-sm text-foreground-500">Notify when a new event is created</p>
            </div>
            <Switch
              isSelected={notificationSettings.eventCreated}
              onValueChange={(value) => handleNotificationChange("eventCreated", value)}
              isDisabled={!notificationSettings.emailNotifications}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-medium font-medium">Event Updated</h3>
              <p className="text-sm text-foreground-500">Notify when an event is updated</p>
            </div>
            <Switch
              isSelected={notificationSettings.eventUpdated}
              onValueChange={(value) => handleNotificationChange("eventUpdated", value)}
              isDisabled={!notificationSettings.emailNotifications}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-medium font-medium">Event Cancelled</h3>
              <p className="text-sm text-foreground-500">Notify when an event is cancelled</p>
            </div>
            <Switch
              isSelected={notificationSettings.eventCancelled}
              onValueChange={(value) => handleNotificationChange("eventCancelled", value)}
              isDisabled={!notificationSettings.emailNotifications}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-medium font-medium">Daily Summary</h3>
              <p className="text-sm text-foreground-500">Receive a daily summary of event activity</p>
            </div>
            <Switch
              isSelected={notificationSettings.dailySummary}
              onValueChange={(value) => handleNotificationChange("dailySummary", value)}
              isDisabled={!notificationSettings.emailNotifications}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              color="primary"
              onPress={handleSaveNotifications}
            >
              Save Notification Settings
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Account Security</h2>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-medium font-medium">Change Password</h3>
              <p className="text-sm text-foreground-500">Update your account password</p>
            </div>
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:lock" />}
            >
              Change Password
            </Button>
          </div>
          
          <Divider />
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-medium font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-foreground-500">Enable 2FA for enhanced security</p>
            </div>
            <Button
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:shield" />}
            >
              Setup 2FA
            </Button>
          </div>
          
          <Divider />
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-medium font-medium text-danger">Delete Account</h3>
              <p className="text-sm text-foreground-500">Permanently delete your account and all data</p>
            </div>
            <Button
              color="danger"
              variant="flat"
              startContent={<Icon icon="lucide:trash-2" />}
            >
              Delete Account
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};