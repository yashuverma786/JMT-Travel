import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { jsPDF } from "jspdf"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid trip ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const trip = await db
      .collection("trips")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "destinations",
            let: { destId: { $toObjectId: "$destinationId" } },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$destId"] } } }],
            as: "destination",
          },
        },
        {
          $addFields: {
            destinationName: {
              $ifNull: ["$destinationName", { $arrayElemAt: ["$destination.name", 0] }],
            },
            destinationCountry: { $arrayElemAt: ["$destination.country", 0] },
          },
        },
      ])
      .toArray()

    if (!trip || trip.length === 0) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    const tripData = trip[0]

    // Create PDF
    const doc = new jsPDF()
    let yPosition = 20

    // Header
    doc.setFontSize(20)
    doc.setTextColor(255, 102, 0) // Orange color
    doc.text("JMT TRAVEL", 20, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text("Your Travel Partner", 20, yPosition)
    yPosition += 20

    // Trip Title
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    const title = tripData.title || "Trip Details"
    doc.text(title, 20, yPosition)
    yPosition += 15

    // Basic Info
    doc.setFontSize(12)
    if (tripData.destinationName) {
      doc.text(`Destination: ${tripData.destinationName}`, 20, yPosition)
      yPosition += 8
    }

    const duration = tripData.durationDays || 1
    const nights = tripData.durationNights || (duration > 0 ? duration - 1 : 0)
    doc.text(`Duration: ${duration} Days / ${nights} Nights`, 20, yPosition)
    yPosition += 8

    // Pricing
    const adultPrice = typeof tripData.adultPrice === "number" ? tripData.adultPrice : 0
    const salePrice = typeof tripData.salePrice === "number" ? tripData.salePrice : adultPrice
    const displayPrice = salePrice > 0 ? salePrice : adultPrice

    if (displayPrice > 0) {
      doc.setFontSize(14)
      doc.setTextColor(0, 128, 0) // Green color
      doc.text(`Price: ₹${displayPrice.toLocaleString("en-IN")} per person`, 20, yPosition)
      yPosition += 12
    }

    // Overview
    if (tripData.overview || tripData.description) {
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text("Overview:", 20, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      const overview = tripData.overview || tripData.description
      const splitOverview = doc.splitTextToSize(overview, 170)
      doc.text(splitOverview, 20, yPosition)
      yPosition += splitOverview.length * 5 + 10
    }

    // Highlights
    if (tripData.highlights && tripData.highlights.length > 0) {
      doc.setFontSize(14)
      doc.text("Trip Highlights:", 20, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      tripData.highlights.forEach((highlight: string) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(`• ${highlight}`, 25, yPosition)
        yPosition += 6
      })
      yPosition += 10
    }

    // Inclusions
    if (tripData.inclusions && tripData.inclusions.length > 0) {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(0, 128, 0)
      doc.text("Inclusions:", 20, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      tripData.inclusions.forEach((inclusion: string) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(`✓ ${inclusion}`, 25, yPosition)
        yPosition += 6
      })
      yPosition += 10
    }

    // Exclusions
    if (tripData.exclusions && tripData.exclusions.length > 0) {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(255, 0, 0)
      doc.text("Exclusions:", 20, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      tripData.exclusions.forEach((exclusion: string) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(`✗ ${exclusion}`, 25, yPosition)
        yPosition += 6
      })
      yPosition += 10
    }

    // Itinerary
    if (tripData.itinerary && tripData.itinerary.length > 0) {
      if (yPosition > 200) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text("Itinerary:", 20, yPosition)
      yPosition += 10

      tripData.itinerary.forEach((day: any) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(12)
        doc.setTextColor(0, 102, 204)
        doc.text(`Day ${day.day}: ${day.title}`, 20, yPosition)
        yPosition += 8

        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)
        const splitDescription = doc.splitTextToSize(day.description, 170)
        doc.text(splitDescription, 25, yPosition)
        yPosition += splitDescription.length * 5 + 8
      })
    }

    // Footer
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(12)
    doc.setTextColor(255, 102, 0)
    doc.text("Contact Information:", 20, yPosition + 20)
    yPosition += 30

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("Phone: +91 98765 43210", 20, yPosition)
    yPosition += 6
    doc.text("Email: info@jmttravel.com", 20, yPosition)
    yPosition += 6
    doc.text("Website: www.jmttravel.com", 20, yPosition)

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${tripData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_brochure.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating brochure:", error)
    return NextResponse.json({ message: "Error generating brochure" }, { status: 500 })
  }
}
