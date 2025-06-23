// Define permissions for easier management
export const PERMISSIONS = {
  MANAGE_USERS: "manage_users",
  MANAGE_DESTINATIONS: "manage_destinations",
  MANAGE_TRIPS: "manage_trips",
  MANAGE_HOTELS: "manage_hotels",
  MANAGE_RENTALS: "manage_rentals",
  MANAGE_BOOKINGS: "manage_bookings",
  MANAGE_REVIEWS: "manage_reviews",
  MANAGE_BLOGS: "manage_blogs",
  MANAGE_PARTNERS: "manage_partners", // For collaborators/vendors
  VIEW_ANALYTICS: "view_analytics",
  APPROVE_LISTINGS: "approve_listings", // For hotel/rental/etc. submissions
  MANAGE_PAYMENTS: "manage_payments",
} as const // Use "as const" for stricter typing

export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Example roles and their default permissions
export const ROLES_PERMISSIONS: Record<string, PermissionValue[]> = {
  super_admin: Object.values(PERMISSIONS), // Has all permissions
  admin: [
    PERMISSIONS.MANAGE_DESTINATIONS,
    PERMISSIONS.MANAGE_TRIPS,
    PERMISSIONS.MANAGE_HOTELS,
    PERMISSIONS.MANAGE_RENTALS,
    PERMISSIONS.MANAGE_BOOKINGS,
    PERMISSIONS.MANAGE_REVIEWS,
    PERMISSIONS.MANAGE_BLOGS,
    PERMISSIONS.APPROVE_LISTINGS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  content_manager: [
    PERMISSIONS.MANAGE_BLOGS,
    PERMISSIONS.MANAGE_REVIEWS,
    // Can be given specific content update permissions for trips/destinations if needed
  ],
  hotel_owner: [], // Permissions to submit/manage their own hotel listings (handled via specific API routes)
  rental_vendor: [], // Permissions to submit/manage their own rental listings
}
