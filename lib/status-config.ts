import {
  Clock,
  FileText,
  CheckCircle,
  Truck,
  Building2,
  ArrowRightLeft,
  Plane,
  Package,
  ShieldCheck,
  PackageCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import { createElement } from "react"

export interface StatusConfig {
  value: string
  label: string
  color: string
  icon: LucideIcon
  description: string
  order: number
}

export const STATUS_OPTIONS: StatusConfig[] = [
  {
    value: "Pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    description: "Booking received and awaiting processing",
    order: 1,
  },
  {
    value: "Documentation Prepared",
    label: "Documentation Prepared",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: FileText,
    description: "Shipping documents have been prepared",
    order: 2,
  },
  {
    value: "Shipment Finalised",
    label: "Shipment Finalised",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: CheckCircle,
    description: "Shipment details confirmed and finalized",
    order: 3,
  },
  {
    value: "Pickup Arranged",
    label: "Pickup Arranged",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
    description: "Pickup has been scheduled",
    order: 4,
  },
  {
    value: "Arrived Hub (Origin)",
    label: "Arrived Hub (Origin)",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    icon: Building2,
    description: "Package arrived at origin hub",
    order: 5,
  },
  {
    value: "Sorted to Destination",
    label: "Sorted to Destination",
    color: "bg-teal-100 text-teal-800 border-teal-200",
    icon: ArrowRightLeft,
    description: "Package sorted for destination",
    order: 6,
  },
  {
    value: "In Transit to Destination",
    label: "In Transit to Destination",
    color: "bg-sky-100 text-sky-800 border-sky-200",
    icon: Plane,
    description: "Package is on the way to destination",
    order: 7,
  },
  {
    value: "Arrived Depot (Destination)",
    label: "Arrived Depot (Destination)",
    color: "bg-violet-100 text-violet-800 border-violet-200",
    icon: Package,
    description: "Package arrived at destination depot",
    order: 8,
  },
  {
    value: "Released from Customs",
    label: "Released from Customs",
    color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    icon: ShieldCheck,
    description: "Package cleared customs",
    order: 9,
  },
  {
    value: "Delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: PackageCheck,
    description: "Package successfully delivered",
    order: 10,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    description: "Booking has been cancelled",
    order: 11,
  },
]

export function getStatusConfig(status: string): StatusConfig {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0]
}

export function getStatusBadgeColor(status: string): string {
  return getStatusConfig(status).color
}

export function getStatusColor(status: string): string {
  return getStatusConfig(status).color
}

export function getStatusIcon(status: string) {
  const config = getStatusConfig(status)
  return createElement(config.icon, { className: "h-4 w-4" })
}
