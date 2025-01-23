"use client"

import { useEffect, useState } from "react"

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return <div className="text-4xl font-bold">{time.toLocaleTimeString()}</div>
}

