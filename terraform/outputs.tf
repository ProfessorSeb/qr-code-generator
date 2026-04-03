output "cloud_run_url" {
  description = "Cloud Run service URL"
  value       = google_cloud_run_service.qr_generator.status[0].url
}

output "custom_domain" {
  description = "Custom domain for the service"
  value       = "https://${var.domain}"
}

output "artifact_registry" {
  description = "Artifact Registry repository path"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.qr_app.repository_id}"
}
