import React, {useContext} from 'react';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import './app.css';
import { HomePage } from "./pages/HompePage";
import { DashboardPage } from "./pages/DashboardPage";
import { TodoBoardPage } from "./pages/TodoBoardPage";
import AuthContext, {AuthProvider} from "./contexts/AuthContext";

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
})

/**
 * Wrapper for protected routes to ensure that content is only displayed if user is authenticated
 *
 * @param {JSX.Element} children - Page to render if user is authenticated
 * @constructor
 */
function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext)
  const location = useLocation()

  if (!auth.user) {
    // Redirect user back to the homepage but save the location coming from to redirect back to
    return <Navigate to="/" state={{ from: location }} replace />
  }
  return children
}

/**
 * The Atomic Todo Web App
 * @constructor
 */
function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>} />
          <Route path="/todoboard/:todoboardId" element={
            <RequireAuth>
              <TodoBoardPage />
            </RequireAuth>} />
        </Routes>
      </AuthProvider>

    </ApolloProvider>
  );
}

export default App;
