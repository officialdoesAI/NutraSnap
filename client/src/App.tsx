import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, RequireAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ResultsPage from "@/pages/ResultsPage";
import HistoryPage from "@/pages/HistoryPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Public routes */}
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        
        {/* Protected routes */}
        <Route path="/">
          {() => (
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          )}
        </Route>
        <Route path="/results/:id?">
          {() => (
            <RequireAuth>
              <ResultsPage />
            </RequireAuth>
          )}
        </Route>
        <Route path="/history">
          {() => (
            <RequireAuth>
              <HistoryPage />
            </RequireAuth>
          )}
        </Route>
        <Route path="/profile">
          {() => (
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          )}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
