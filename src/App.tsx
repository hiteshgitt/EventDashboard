import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import { EventsPage } from "./pages/events";
import { EventFormPage } from "./pages/event-form";
import { EventDetailsPage } from "./pages/event-details";
import { DashboardHome } from "./pages/dashboard-home";
import { SettingsPage } from "./pages/settings";

function App() {
  return (
    <DashboardLayout>
      <Switch>
        <Route exact path="/" component={DashboardHome} />
        <Route exact path="/events" component={EventsPage} />
        <Route exact path="/events/new" component={EventFormPage} />
        <Route exact path="/events/:id/edit" component={EventFormPage} />
        <Route exact path="/events/:id" component={EventDetailsPage} />
        <Route exact path="/settings" component={SettingsPage} />
        <Redirect to="/" />
      </Switch>
    </DashboardLayout>
  );
}

export default App;