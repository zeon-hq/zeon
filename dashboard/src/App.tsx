import { Global, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import CheckEmail from "components/auth/CheckEmail";
import ForgetPassword from "components/auth/ForgetPassword";
import Login from "components/auth/Login";
import ProtectedRoute from "components/auth/ProtectedRoute";
import SetNewPassword from "components/auth/SetNewPassword";
import Signup from "components/auth/Signup";
import InviteUsers from "components/core/InviteUsers";
import WorkspaceCreation from "components/core/WorkspaceCreation";
import Details from "components/details/Details";
import ForgotPassword from "components/ui-components/ForgotPassword";
import Layout from "components/ui-components/Layout";
import SlackOAuth from "components/ui-components/SlackOAuth";
import Workspaces from "components/ui-components/workspaces/Workspaces";
import CrmLayout from "crm/CrmLayout";
import Finance from "finance/expense/Finance";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

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
      <MantineProvider withNormalizeCSS withGlobalStyles 
        theme={{
          colorScheme: 'light',
          colors: {
            grey: ['#475467','#344054','#475467'],
            blue: ['#3054B9','#3C69E7']
          }
        }}>
        <MyGlobalStyles />
        <Notifications position="top-center" />

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
                <Layout>
                  <Details />
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
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<SetNewPassword />} />
            <Route path="/check-email" element={<CheckEmail />} />
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
                  <Workspaces />
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
