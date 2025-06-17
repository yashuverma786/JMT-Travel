"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const partners = [
  {
    id: 1,
    name: "Accor Hotels",
    logo: "/placeholder.svg?height=80&width=160",
  },
  {
    id: 2,
    name: "Amadeus",
    logo: "/placeholder.svg?height=80&width=160",
  },
  {
    id: 3,
    name: "Travelport",
    logo: "/placeholder.svg?height=80&width=160",
  },
  {
    id: 4,
    name: "Taj Group",
    logo: "/placeholder.svg?height=80&width=160",
  },
  {
    id: 5,
    name: "Marriott",
    logo: "/placeholder.svg?height=80&width=160",
  },
  {
    id: 6,
    name: "Hilton",
    logo: "/placeholder.svg?height=80&width=160",
  },
]

export default function Partners() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <section className="py-16 bg-gray-100 relative overflow-hidden">
      <div className="absolute right-0 bottom-0">
        <motion.div
          initial={{ x: 100, y: 100 }}
          animate={{ x: 0, y: 0 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M60 10C60 4.47715 64.4772 0 70 0H110C115.523 0 120 4.47715 120 10V50C120 55.5228 115.523 60 110 60H70C64.4772 60 60 55.5228 60 50V10Z"
              fill="#E5E7EB"
            />
            <path
              d="M60 70C60 64.4772 64.4772 60 70 60H110C115.523 60 120 64.4772 120 70V110C120 115.523 115.523 120 110 120H70C64.4772 120 60 115.523 60 110V70Z"
              fill="#E5E7EB"
            />
            <path
              d="M0 10C0 4.47715 4.47715 0 10 0H50C55.5228 0 60 4.47715 60 10V50C60 55.5228 55.5228 60 50 60H10C4.47715 60 0 55.5228 0 50V10Z"
              fill="#E5E7EB"
            />
            <path
              d="M0 70C0 64.4772 4.47715 60 10 60H50C55.5228 60 60 64.4772 60 70V110C60 115.523 55.5228 120 50 120H10C4.47715 120 0 115.523 0 110V70Z"
              fill="#E5E7EB"
            />
          </svg>
        </motion.div>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">We are proud to be Collaborate by Global Recognitions</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: partner.id * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center p-4"
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={160}
                height={80}
                className="max-h-16 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute -bottom-10 -left-10 opacity-10"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path
              d="M60 10C32.3858 10 10 32.3858 10 60C10 87.6142 32.3858 110 60 110C87.6142 110 110 87.6142 110 60C110 32.3858 87.6142 10 60 10Z"
              stroke="#CBD5E1"
              strokeWidth="20"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-10 right-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path
                d="M40 0L49.7056 30.2944L80 40L49.7056 49.7056L40 80L30.2944 49.7056L0 40L30.2944 30.2944L40 0Z"
                fill="#E5E7EB"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
