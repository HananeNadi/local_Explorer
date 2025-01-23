"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Place {
  _id: string
  name: string
  address: string
  icon: string
  latitude: number
  longitude: number
}

interface ActivityWithPlaces {
  suggestion: string
  places: Place[]
}

interface RecommendedActivitiesProps {
  latitude: number
  longitude: number
  userIdentifier: string
  weather: string
  onPlaceClick: (place: Place) => void
}

export default function RecommendedActivities({
  latitude,
  longitude,
  userIdentifier,
  weather,
  onPlaceClick,
}: RecommendedActivitiesProps) {
  const [activities, setActivities] = useState<string>("")
  const [places, setPlaces] = useState<ActivityWithPlaces[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecommendedActivities()
  }, [latitude, longitude, userIdentifier])

  const fetchRecommendedActivities = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/suggest/nearby_places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: latitude.toString(),
          lon: longitude.toString(),
          history: [],
          current_time: new Date().toISOString(),
          weather: weather,
          user_identifier: userIdentifier,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recommended activities")
      }

      const data = await response.json()
      setActivities(data.recommendation || "No recommendations available.")
      setPlaces(data.places || [])
    } catch (err) {
      setError("Failed to load recommended activities. Please try again later.")
      console.error("Error fetching recommended activities:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-400">Recommended Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: activities }} />
          )}
        </CardContent>
      </Card>
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-blue-600 dark:text-blue-400">Places to Visit</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto whitespace-nowrap">
              {places.map((activity, index) => (
                <div key={index} className="inline-block mr-4">
                  <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">{activity.suggestion}</h3>
                  {activity.places.length > 0 ? (
                    <div className="flex gap-2">
                      {activity.places.map((place) => (
                        <Card
                          key={place._id}
                          className="p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors min-w-[200px]"
                          onClick={() => onPlaceClick(place)}
                        >
                          <div className="flex items-center space-x-2">
                            <img src={place.icon || "/placeholder.svg"} alt={place.name} className="w-6 h-6" />
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200">{place.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{place.address}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No places available for this activity.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}