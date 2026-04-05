variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "qr-maniak-io"
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "dns_project_id" {
  description = "GCP project that hosts the Cloud DNS zone"
  type        = string
  default     = "maniak-io"
}

variable "dns_zone_name" {
  description = "Cloud DNS managed zone name"
  type        = string
  default     = "maniak"
}

variable "app_domain" {
  description = "Custom domain for the QR generator UI"
  type        = string
  default     = "qr.maniak.io"
}

variable "short_domain" {
  description = "Custom domain for short redirects"
  type        = string
  default     = "s.maniak.io"
}

variable "image" {
  description = "Container image to deploy"
  type        = string
  default     = "us-central1-docker.pkg.dev/qr-maniak-io/qr-app/qr-generator:latest"
}

variable "firestore_location" {
  description = "Firestore location"
  type        = string
  default     = "nam5"
}
