import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Heading, Input, useToast } from "@chakra-ui/react";

const API_URL = "http://localhost:1337/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();

  const register = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        toast({
          title: "Registration successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Registration failed",
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
        Register
      </Heading>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button mt={4} onClick={register}>
        Register
      </Button>
    </Box>
  );
};

export default Register;
