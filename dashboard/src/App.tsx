import "./App.css";
import Layout from "components/ui-components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider, Global } from "@mantine/core";
import SlackOAuth from "components/ui-components/SlackOAuth";
import Workspaces from "components/ui-components/workspaces/Workspaces";
import ForgotPassword from "components/ui-components/ForgotPassword";
import Login from "components/auth/Login";
import Signup from "components/auth/Signup";
import ProtectedRoute from "components/auth/ProtectedRoute";
import { Notifications } from "@mantine/notifications";
import WorkspaceCreation from "components/core/WorkspaceCreation";
import InviteUsers from "components/core/InviteUsers";
import Details from "components/details/Details";
import Finance from "finance/expense/Finance";
import CrmLayout from "crm/CrmLayout";

function MyGlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        ".primary": {
          backgroundColor: "#4263EB",
          "&:hover": {
            backgroundColor: "#364FC7",
          },
        },
      })}
    />
  );
}

function App() {
  return (
    <>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <MyGlobalStyles />
        <Notifications />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/workspace/:workspaceId/invite-user"
              element={
                <ProtectedRoute>
                  <InviteUsers />
                </ProtectedRoute>
              }
            />
               <Route
                path="/:workspaceId/chat"
                element={
                  <Layout >
                    <Details/>
                  </Layout>
                }
              />
            <Route
              path="/dashboard/:workspaceId"
              element={
                <Layout>
                  <Details />
                </Layout>
              }
            />
            <Route
              path="/slack/oauth"
              element={
                <ProtectedRoute>
                  <SlackOAuth />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspaces"
              element={
                <ProtectedRoute>
                  <Workspaces />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspace-creation"
              element={
                <ProtectedRoute>
                  <WorkspaceCreation />
                </ProtectedRoute>
              }
            />
              <Route
                path="/workspaces/chat"
                element={
                  <ProtectedRoute>
                   <Workspaces/>
                  </ProtectedRoute>
                }
              />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/finance/:workspaceId"
              element={
                <Layout>
                  <Finance />
                </Layout>
              }
            />
            <Route path="/relation/:workspaceId/*">
              <Route
                index
                element={
                  <Layout>
                    <CrmLayout pageName="dashboard" />
                  </Layout>
                }
              />
              <Route
                path="contacts"
                index
                element={
                  <Layout>
                    <CrmLayout pageName="contacts" />
                  </Layout>
                }
              />
              <Route
                path="companies"
                index
                element={
                  <Layout>
                    <CrmLayout pageName="companies" />
                  </Layout>
                }
              />
              <Route
                path="companies/:companyId"
                index
                element={
                  <Layout>
                    <CrmLayout pageName="companies" />
                  </Layout>
                }
              />
              <Route
                path="contacts/:contactId"
                index
                element={
                  <Layout>
                    <CrmLayout pageName="contacts" />
                  </Layout>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}

export default App;
