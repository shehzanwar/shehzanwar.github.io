---
title: "Signal Harvester — Local Intelligence Triage"
slug: signal-harvester
summary: "A fully local RSS-to-intelligence pipeline — LLM-driven urgency tiering and target-relative sentiment, domain-agnostic YAML profiles, zero API keys and zero data egress."
description: "A local-first intelligence triage pipeline: ingests RSS/Atom feeds, runs each item through a locally-hosted LLM (llama.cpp, Qwen3-8B) for T1/T2/T3 urgency tiering and target-relative sentiment scoring, and persists state to SQLite in WAL mode. Domain-agnostic YAML profiles let the same pipeline retarget from OSINT monitoring to any other topic without code changes. A FastAPI backend and React dashboard expose the triaged feed. No external API calls, no API keys, no data leaves the machine."
category: Data Engineering
stack:
  - Python
  - llama.cpp
  - FastAPI
  - React
  - SQLite
  - YAML
repoUrl: https://github.com/shehzanwar/signal-harvester
featured: true
order: 1
coverIcon: lucide:radio-tower
publishedAt: 2026-04-01
status: shipped
---

## Problem

Manually monitoring dozens of RSS feeds for genuinely urgent items doesn't scale, and routing that triage through a hosted LLM API means every headline you're screening leaves your machine. For OSINT-style monitoring — or any domain where the source material shouldn't touch a third-party API — that's a non-starter.

## Approach

Signal Harvester ingests RSS/Atom feeds on a schedule and runs each item through a locally-hosted LLM (llama.cpp serving Qwen3-8B) for two judgments: an urgency tier (T1/T2/T3) and a target-relative sentiment score. Nothing is sent to an external API — inference runs entirely on local hardware.

Targeting logic lives in YAML profiles rather than code, so the same pipeline can be repointed from one monitoring domain to an entirely different one by editing a config file, not the source. State is persisted to SQLite in WAL mode, keeping the pipeline resilient to concurrent reads from the dashboard while writes are in progress.

## Interface

A FastAPI backend serves the triaged feed to a React dashboard, surfacing items sorted by urgency tier with the model's sentiment read attached.

## Why It's Built This Way

The constraint that shaped every decision here was zero data egress: no API keys, no external inference calls, no PII or source material leaving the host. That ruled out the usual hosted-LLM shortcut and required getting local inference (quantized model, llama.cpp) fast enough to be usable in a triage loop — the harder but more defensible engineering path for anything privacy- or classification-sensitive.
