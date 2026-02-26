# Load Testing Framework

This directory contains the load testing framework for StrellerMinds-Frontend, built with [k6](https://k6.io/).

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js (for local app execution)

## Structure

- `script.js`: The main k6 load testing script defining scenarios and thresholds.
- `docker-compose.yml`: Infrastructure setup for InfluxDB, Grafana, and k6.

## Running Tests

### 1. Start the Application

Ensure your Next.js application is running locally or target a deployed environment.

```bash
npm run dev
# App should be available at http://localhost:3000
```

### 2. Run Load Test (CLI)

If you have k6 installed locally:

```bash
k6 run script.js
```

### 3. Run with Visualization (Docker)

To run the tests and view metrics in Grafana:

```bash
docker-compose up
```

- **Grafana Dashboard**: http://localhost:3001
- **InfluxDB**: http://localhost:8086

## CI/CD Integration

The load tests are automatically triggered via GitHub Actions on pull requests to the `main` branch. See `.github/workflows/load-test.yml`.