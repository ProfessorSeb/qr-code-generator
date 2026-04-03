provider "google" {
  project = var.project_id
  region  = var.region
  # Auth: set GOOGLE_OAUTH_ACCESS_TOKEN or use application-default credentials
  # For CI/CD: use a service account key or workload identity
}

# --- Artifact Registry ---
resource "google_artifact_registry_repository" "qr_app" {
  location      = var.region
  repository_id = "qr-app"
  format        = "DOCKER"
  description   = "Docker repository for QR code generator"
}

# --- Cloud Run Service ---
resource "google_cloud_run_service" "qr_generator" {
  name     = "qr-generator"
  location = var.region

  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
  }

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "0"
        "autoscaling.knative.dev/maxScale" = "3"
      }
    }

    spec {
      container_concurrency = 80

      containers {
        image = var.image

        ports {
          container_port = 4242
        }

        resources {
          limits = {
            memory = "256Mi"
            cpu    = "1"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    ignore_changes = [
      metadata[0].annotations["run.googleapis.com/operation-id"],
    ]
  }
}

# --- IAM: Allow unauthenticated access ---
resource "google_cloud_run_service_iam_member" "public" {
  location = google_cloud_run_service.qr_generator.location
  service  = google_cloud_run_service.qr_generator.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# --- Cloud Run Domain Mapping ---
resource "google_cloud_run_domain_mapping" "qr_domain" {
  name     = var.domain
  location = var.region

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_service.qr_generator.name
  }
}

# --- Cloud DNS CNAME record in maniak-io project ---
resource "google_dns_record_set" "qr_cname" {
  project      = var.dns_project_id
  managed_zone = var.dns_zone_name
  name         = "${var.domain}."
  type         = "CNAME"
  ttl          = 300
  rrdatas      = ["ghs.googlehosted.com."]
}
