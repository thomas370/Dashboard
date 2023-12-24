import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import AddFaq from "./scenes/form/addFaq";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Articlesadd from "./scenes/form/addArticle";
import Login from "./scenes/login/Login";
import Register from "./scenes/register/Register";
import Geography from "./scenes/geography";
import Articles from "./scenes/articles/Articles";
import ArticleEdit from "./scenes/articles/modifArticles";
import SiteList from "./scenes/sites/Sitelist";
import SiteModif from "./scenes/sites/Sitemodif";
import Settings from "./scenes/settings/settings";
import Profile from "./scenes/profile/profile";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import VueArticles from "./scenes/articles/vueArticles";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Team />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vueArticles/:id"
                element={
                  <PrivateRoute requiredRole="admin">
                    <VueArticles />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Contacts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Invoices />
                  </PrivateRoute>
                }
              />
              <Route
                path="/form"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Form />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bar"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Bar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pie"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Pie />
                  </PrivateRoute>
                }
              />
              <Route
                path="/line"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Line />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sitemodif/:id"
                element={
                  <PrivateRoute requiredRole="admin">
                    <SiteModif />
                  </PrivateRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <PrivateRoute requiredRole="admin">
                    <FAQ />
                  </PrivateRoute>
                }
              />
              <Route
                path="/addfaq"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AddFaq />
                  </PrivateRoute>
                }
              />
              <Route
                path="/editarticle/:id"
                element={
                  <PrivateRoute requiredRole="admin">
                    <ArticleEdit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/addArticle"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Articlesadd />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Calendar />
                  </PrivateRoute>
                }
              />
              <Route
                path="/formlist"
                element={
                  <PrivateRoute requiredRole="admin">
                    <SiteList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/geography"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Geography />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Article"
                element={
                  <PrivateRoute requiredRole="admin">
                    <Articles />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
