import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForms from "./auth/AuthForms";
import TaskBoard from "./dashboard/TaskBoard";
import { UserCircle, LogOut, Menu } from "lucide-react";

interface User {
  id: string;
  email: string;
  name?: string;
}

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Mock login function - in a real app, this would connect to your auth service
  const handleLogin = (email: string, password: string) => {
    // Simulate successful login
    setUser({
      id: "1",
      email: email,
      name: email.split("@")[0],
    });
    setIsAuthenticated(true);
  };

  // Mock register function
  const handleRegister = (email: string, password: string, name: string) => {
    // Simulate successful registration
    setUser({
      id: "1",
      email: email,
      name: name,
    });
    setIsAuthenticated(true);
  };

  // Mock logout function
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <h1 className="text-2xl font-bold text-primary">TaskMaster</h1>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {user?.name || "User"}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t p-4"
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {user?.name || "User"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto mt-10"
          >
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <AuthForms
                      mode="login"
                      onLogin={handleLogin}
                      onRegister={handleRegister}
                    />
                  </TabsContent>
                  <TabsContent value="register">
                    <AuthForms
                      mode="register"
                      onLogin={handleLogin}
                      onRegister={handleRegister}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TaskBoard />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TaskMaster. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
