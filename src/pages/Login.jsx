import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Heading, Input, useToast } from "@chakra-ui/react";

const API_URL = "http://localhost:1337/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: username, password }),
      });
      const data = await response.json();
      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Login
      </Heading>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button mt={4} onClick={login}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
