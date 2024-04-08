import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:1337/api";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [editEventId, setEditEventId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchEvents();
    }
  }, []);

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
        setIsLoggedIn(true);
        fetchEvents();
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
        setIsLoggedIn(true);
        fetchEvents();
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

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setEvents([]);
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEvents(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            name: eventName,
            description: eventDescription,
          },
        }),
      });
      const data = await response.json();
      setEvents([...events, data.data]);
      setEventName("");
      setEventDescription("");
      toast({
        title: "Event created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/events/${editEventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            name: eventName,
            description: eventDescription,
          },
        }),
      });
      const data = await response.json();
      const updatedEvents = events.map((event) => (event.id === editEventId ? data.data : event));
      setEvents(updatedEvents);
      setEditEventId(null);
      setEventName("");
      setEventDescription("");
      toast({
        title: "Event updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);
      toast({
        title: "Event deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Event Management App
      </Heading>
      {!isLoggedIn ? (
        <Stack spacing={4}>
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
          <Button onClick={register}>Register</Button>
          <Button onClick={login}>Login</Button>
        </Stack>
      ) : (
        <>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Event Name</FormLabel>
              <Input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Event Description</FormLabel>
              <Input type="text" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            </FormControl>
            {editEventId ? <Button onClick={updateEvent}>Update Event</Button> : <Button onClick={createEvent}>Create Event</Button>}
          </Stack>
          <Box mt={8}>
            <Heading as="h2" size="lg" mb={4}>
              Events
            </Heading>
            {events.map((event) => (
              <Box key={event.id} p={4} borderWidth={1} mb={4}>
                <Heading as="h3" size="md">
                  {event.attributes.name}
                </Heading>
                <Text>{event.attributes.description}</Text>
                <Stack direction="row" mt={4}>
                  <Button
                    leftIcon={<FaEdit />}
                    onClick={() => {
                      setEditEventId(event.id);
                      setEventName(event.attributes.name);
                      setEventDescription(event.attributes.description);
                    }}
                  >
                    Edit
                  </Button>
                  <Button leftIcon={<FaTrash />} onClick={() => deleteEvent(event.id)}>
                    Delete
                  </Button>
                </Stack>
              </Box>
            ))}
          </Box>
          <Button mt={8} onClick={logout}>
            Logout
          </Button>
        </>
      )}
    </Box>
  );
};

export default Index;
