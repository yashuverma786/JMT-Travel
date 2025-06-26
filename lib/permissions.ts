// Define permissions for easier management
export const PERMISSIONS = {
  MANAGE_USERS: "manage_users",
  MANAGE_DESTINATIONS: "manage_destinations",
  MANAGE_TRIPS: "manage_trips",
  MANAGE_HOTELS: "manage_hotels", // General hotel management
  MANAGE_OWN_HOTELS: "manage_own_hotels", // Specific for hotel listers
  MANAGE_RENTALS: "manage_rentals", // This will cover transfers too
  MANAGE_TRANSFERS: "manage_transfers", // Specific for transfers
  MANAGE_BOOKINGS: "manage_bookings",
  MANAGE_REVIEWS: "manage_reviews",
  MANAGE_BLOGS: "manage_blogs",
  MANAGE_PARTNERS: "manage_partners",
  VIEW_ANALYTICS: "view_analytics",
  APPROVE_LISTINGS: "approve_listings", // For hotel/rental submissions by super_admin/admin
  MANAGE_PAYMENTS: "manage_payments",
  VIEW_DASHBOARD: "view_dashboard", // Basic permission to see the dashboard
  MANAGE_SETTINGS: "manage_settings", // For general admin settings
} as const

export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// Example roles and their default permissions
export const ROLES_PERMISSIONS: Record<string, PermissionValue[]> = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_DESTINATIONS,
    PERMISSIONS.MANAGE_TRIPS,
    PERMISSIONS.MANAGE_HOTELS,
    PERMISSIONS.MANAGE_RENTALS,
    PERMISSIONS.MANAGE_TRANSFERS,
    PERMISSIONS.MANAGE_BOOKINGS,
    PERMISSIONS.MANAGE_REVIEWS,
    PERMISSIONS.MANAGE_BLOGS,
    PERMISSIONS.MANAGE_PARTNERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.APPROVE_LISTINGS,
  ],
  content_manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_BLOGS,
    PERMISSIONS.MANAGE_REVIEWS,
    // Optionally add limited trip/destination content update permissions if needed
    // PERMISSIONS.MANAGE_TRIPS, (could be too broad, consider more granular if needed)
    // PERMISSIONS.MANAGE_DESTINATIONS,
  ],
  hotel_lister: [
    PERMISSIONS.VIEW_DASHBOARD, // So they can see their dedicated dashboard
    PERMISSIONS.MANAGE_OWN_HOTELS, // Custom permission for their listings
  ],
  transfer_manager: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.MANAGE_TRANSFERS],
  // Add other roles as needed
}
