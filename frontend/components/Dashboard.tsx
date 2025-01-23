"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { v4 as uuidv4 } from "uuid"
import Weather from "./Weather"
import Clock from "./Clock"
import { getConfig } from '@/lib/config'
import RecommendedActivities from "./RecommendedActivities"

interface User {
  id: string
  user_identifier: string
  latitude: number
  longitude: number
  weather: string
}

interface Place {
  _id: string
  name: string
  address: string
  icon: string
  latitude: number
  longitude: number
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null)
  const [locationPermission, setLocationPermission] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [mapLocation, setMapLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  const config = getConfig();

  const handlePlaceClick = (place: Place) => {
    console.log({ lat: place.latitude, lng: place.longitude })
    setMapLocation({ latitude: place.latitude, longitude: place.longitude });
  };

  useEffect(() => {
    initializeApp()
  }, [])

  useEffect(() => {
    if (user && location) {
      const updateInterval = setInterval(
        () => {
          updateUserWeatherAndLocation()
        },
        20 * 60 * 1000,
      ) // 20 minutes

      return () => clearInterval(updateInterval)
    }
  }, [user, location])

  const initializeApp = async () => {
    setIsLoading(true)
    await fetchLocation()
    await initializeUser()
    await checkLocationPermission()
    setIsLoading(false)
  }

  const initializeUser = async () => {
    const storedIdentifier = localStorage.getItem("user_identifier")
    if (storedIdentifier) {
      await fetchUser(storedIdentifier)
    } else {
      const newIdentifier = uuidv4()
      localStorage.setItem("user_identifier", newIdentifier)
      await createUser(newIdentifier)
    }
  }

  const fetchUser = async (identifier: string) => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/users/find?identifier=${encodeURIComponent(identifier)}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else if (response.status === 404) {
        await createUser(identifier)
      } else {
        console.error("Failed to fetch user")
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const createUser = async (identifier: string) => {
    try {
      const weatherData = ""
      const lastLocationString = localStorage.getItem("last_location")
      let lastLocation = { latitude: 0, longitude: 0 }

      if (lastLocationString) {
        lastLocation = JSON.parse(lastLocationString)
      }

      const userData = {
        user_identifier: identifier,
        latitude: lastLocation.latitude,
        longitude: lastLocation.longitude,
        weather: weatherData,
      }

      const response = await fetch(`${config.BACKEND_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const newUser = await response.json()
        setUser(newUser)
      } else {
        console.error("Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const updateUserWeatherAndLocation = async () => {
    if (user && location) {
      try {
        const weatherData = ""
        const updatedUserData = {
          latitude: location.latitude,
          longitude: location.longitude,
          weather: weatherData,
        }
        const response = await fetch(`${config.BACKEND_URL}/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        })
        if (response.ok) {
          const updatedUser = await response.json()
          setUser(updatedUser)
        } else {
          console.error("Failed to update user")
        }
      } catch (error) {
        console.error("Error updating user:", error)
      }
    }
  }

  const checkLocationPermission = async () => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not supported by this browser.")
      return
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" })
      if (result.state === "granted") {
        setLocationPermission(true)
        await fetchLocation()
      } else if (result.state === "prompt") {
        setLocationPermission(false)
      } else {
        console.error("Location permission denied.")
        setLocationPermission(false)
      }
    } catch (error) {
      console.error("Error checking location permission:", error)
      setLocationPermission(false)
    }
  }

  const fetchLocation = () => {
    return new Promise<void>((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setLocation(position.coords)
            localStorage.setItem("last_location", JSON.stringify({ latitude, longitude }))
            resolve()
          },
          (error) => {
            handleLocationError(error)
            reject(error)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        )
      } else {
        console.error("Geolocation is not supported by this browser.")
        reject(new Error("Geolocation not supported"))
      }
    })
  }

  const handleLocationError = (error: GeolocationPositionError) => {
    let message = "Unknown error occurred."
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "User denied the request for Geolocation."
        break
      case error.POSITION_UNAVAILABLE:
        message = "Location information is unavailable."
        break
      case error.TIMEOUT:
        message = "The request to get user location timed out."
        break
    }
    console.error("Error fetching location:", message)
    setLocationPermission(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Setting up your LocalExplorer...</p>
          </CardContent>
        </Card>
      </div>
    )
  }
 
  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-blue-600 dark:text-blue-400">LocalExplorer</h1>
      {!locationPermission ? (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <p className="mb-4 text-gray-700 dark:text-gray-300">Please allow access to your location to use LocalExplorer.</p>
            <Button onClick={fetchLocation} className="bg-blue-500 hover:bg-blue-600 text-white">Allow Location Access</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">Weather</CardTitle>
              </CardHeader>
              <CardContent>{location && <Weather weatherString={user?.weather} />}</CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">Current Time</CardTitle>
              </CardHeader>
              <CardContent>
                <Clock />
              </CardContent>
            </Card>
          </div>
          <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Map</CardTitle>
            </CardHeader>
            <CardContent>
              {location && (
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=${config.GOOGLE_PLACES_API_KEY}&q=${
                    mapLocation
                      ? `${mapLocation.latitude},${mapLocation.longitude}`
                      : `${location?.latitude},${location?.longitude}`
                  }`}
                />
              )}
            </CardContent>
          </Card>
          {user && location && (
            <RecommendedActivities
              latitude={location.latitude}
              longitude={location.longitude}
              userIdentifier={user.user_identifier}
              weather={user.weather}
              onPlaceClick={handlePlaceClick}
            />
          )}
        </>
      )}
    </div>
  )
}
