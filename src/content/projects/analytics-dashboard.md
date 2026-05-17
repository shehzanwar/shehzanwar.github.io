---
title: Real-Time Marketing Analytics Dashboard
slug: analytics-dashboard
summary: Kafka-backed streaming pipeline surfacing funnel metrics in near real-time for a mid-market SaaS product, cutting insight lag from 24 hours to under 90 seconds.
description: Designed an event-streaming architecture ingesting clickstream data from Kafka, transforming session aggregates with Spark Structured Streaming, materializing funnel metrics in Snowflake, and rendering interactive charts through a React and Vega-Lite dashboard updated via server-sent events.
role: engineer
stack:
  - Apache Kafka
  - Spark
  - Snowflake
  - dbt
  - React
  - Vega-Lite
  - Python
  - Kubernetes
featured: true
order: 2
coverIcon: lucide:bar-chart-2
publishedAt: 2025-01-20
status: in-progress
---

## Problem

The product team waited until the following morning for daily ETL to complete before reviewing prior-day funnel metrics. For live campaign launches and pricing experiments, 24-hour-old data meant decisions were already a day late.

## Architecture

```
Browser events → Kafka topic → Spark Structured Streaming
    → Snowflake (micro-batch, 60s) → dbt incremental models
    → FastAPI SSE endpoint → React + Vega-Lite dashboard
```

**Kafka** acts as the durable event log, decoupling producers from the streaming consumer. **Spark** handles sessionization — joining page-view events with a 30-minute inactivity timeout into sessions before writing aggregates downstream.

## Current status

Session aggregation and Snowflake materialization are complete. The React dashboard is in active development. Target: p95 end-to-end latency under 90 seconds from event to chart render.
