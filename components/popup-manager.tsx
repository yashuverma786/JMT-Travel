"use client"

import { useState, useEffect } from "react"
import LeadGenerationPopup from "./lead-generation-popup"

export default function PopupManager() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("leadPopupShown")

    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowPopup(true)
        sessionStorage.setItem("leadPopupShown", "true")
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return <LeadGenerationPopup isOpen={showPopup} onClose={handleClosePopup} />
}
