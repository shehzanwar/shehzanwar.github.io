---
title: "TrueScout — World Cup 2026 Intelligence"
slug: truescout
summary: "A self-running World Cup 2026 dashboard: league-adjusted Bayesian player ratings, 100K-run bracket simulations, and honest Brier-score calibration against the betting market."
description: "World Cup 2026 intelligence platform built end-to-end: hierarchical Bayesian player ratings with league-adjustment via partial pooling, 100K-run Monte Carlo bracket simulations with calibrated advancement probabilities, Brier-score validation against bookmaker odds, guardrailed LLM scouting narratives, and a nightly self-running GitHub Actions ETL pipeline requiring zero manual intervention."
category: Predictive Analytics
stack:
  - Python
  - Bayesian Modeling
  - Monte Carlo Simulation
  - DuckDB
  - Next.js
  - FastAPI
  - GitHub Actions
  - Scikit-Learn
  - LLM Integration
repoUrl: https://github.com/shehzanwar/TrueScout-WC26
liveUrl: https://truescout.vercel.app
featured: true
order: 1
coverIcon: lucide:radar
publishedAt: 2026-06-15
status: shipped
---

## Problem

Raw football statistics lie. A striker scoring 0.5 goals per 90 minutes in Liga MX and one scoring the same in the Bundesliga are not the same player — yet naive aggregations treat them identically. At the World Cup, where 32 squads arrive from wildly different competitive environments, this gap between raw numbers and true quality is especially wide.

TrueScout was built to close that gap: ingest data across all qualifying leagues, adjust for competitive context, and produce ratings that support honest comparisons across confederations.

## Metric Design — Hierarchical Bayesian Rating Model

Player ratings use hierarchical Bayesian partial pooling, implemented in PyMC. Each player's performance is modeled as drawn from a league-level distribution, which itself is drawn from a global prior. This structure does two things simultaneously:

1. **League adjustment** — a striker's contribution is discounted or amplified based on the estimated quality of their league, inferred from cross-league player overlap and international results.
2. **Uncertainty propagation** — players with fewer appearances get pulled toward the league mean rather than overfitting to small samples. A one-game wonder doesn't rank alongside a 30-game consistent performer.

Ratings are position-scoped (forwards rated on attack contribution, defenders on defensive actions) and reported as percentile scores within position group, making them directly comparable across leagues and roles.

## Decision Output — Monte Carlo Bracket Simulation

Group-stage win probabilities are derived from the player ratings via a lightweight Elo-informed model calibrated on recent international results. From there, 100,000 Monte Carlo simulations are run for the full bracket — each simulation draws from the win-probability distributions, propagates teams through knockout rounds, and records final placement.

The output is a calibrated probability distribution for every team reaching every stage: Round of 16, Quarterfinals, Semifinals, Final, and Champion. These are presented as percentages on the dashboard, not fake certainty.

## Self-Evaluation — Brier Score vs. Bookmaker Baseline

Prediction systems without honest self-assessment are sports-media content dressed as analytics. TrueScout tracks a running Brier score across all completed matches and compares it against the implied probabilities from major betting markets, which represent the sharpest publicly available baseline.

The result is a live calibration metric. If TrueScout's probabilities are better calibrated than the market, that's evidence the league-adjustment and partial pooling are adding signal. If the market is better, the dashboard says so.

## Product Surface

The homepage surfaces four insight modules designed for a non-technical reader:

- **Title Favorites** — teams with the highest championship probability from the simulation
- **Next Match Win Probabilities** — for every live and upcoming fixture
- **Value Picks** — players rated highly by the model but less visible in public discourse
- **Player Comparison** — head-to-head rating breakdown across key performance dimensions

Every number on the dashboard traces back to the model outputs. There are no editorial adjustments or subjective overrides.

## Guardrailed LLM Scouting Narratives

Each player profile includes a generated scouting narrative. The LLM generation is confidence-gated: players with high model certainty (large sample, consistent performance) receive a data-analyst-voice summary that cites specific metrics. Players with sparse data receive a scout-voice summary that reflects the uncertainty explicitly — no invented statistics, no false confidence. The gating logic enforces this in code, not in the prompt.

## Operational Reliability — Nightly Self-Running Pipeline

The ETL runs nightly on GitHub Actions across nine sequential steps: data ingestion from multiple sources, validation against expected schemas, league normalization, Bayesian model refit, bracket simulation rerun, output assertion checks (probability sums to 1, Brier score within bounds), database write to DuckDB, and API cache refresh. Each step is structured with soft-fail logic that sends a failure notification without halting the pipeline for non-critical data gaps.

Zero manual intervention has been required since deployment. The dashboard at truescout.vercel.app reflects results from the most recent pipeline run.
