---
title: "TrueScout — World Cup 2026 Intelligence"
slug: truescout
summary: "A World Cup 2026 dashboard: league-adjusted Bayesian player ratings, 100K-run bracket simulations, and a closed, scored track record — 24/32 matches called correctly, avg Brier 0.202."
description: "World Cup 2026 intelligence platform built end-to-end: hierarchical Bayesian player ratings (pure NumPy, no PyMC/NumPyro dependency) with league-adjustment via partial pooling, 100K-run Monte Carlo bracket simulations with calibrated advancement probabilities, and Brier-score self-evaluation against bookmaker odds. Final tournament record: 32 matches graded, 24 correct, average Brier score 0.202 — a 19.2% improvement over a coin flip."
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
order: 2
coverIcon: lucide:radar
publishedAt: 2026-06-15
status: archived
---

## Problem

Raw football statistics lie. A striker scoring 0.5 goals per 90 minutes in Liga MX and one scoring the same in the Bundesliga are not the same player — yet naive aggregations treat them identically. At the World Cup, where 32 squads arrive from wildly different competitive environments, this gap between raw numbers and true quality is especially wide.

TrueScout was built to close that gap: ingest data across all qualifying leagues, adjust for competitive context, and produce ratings that support honest comparisons across confederations.

## Metric Design — Hierarchical Bayesian Rating Model

Player ratings use hierarchical Bayesian partial pooling, implemented from scratch in NumPy — no PyMC or NumPyro dependency. Each player's performance is modeled as drawn from a league-level distribution, which itself is drawn from a global prior. This structure does two things simultaneously:

1. **League adjustment** — a striker's contribution is discounted or amplified based on the estimated quality of their league, inferred from cross-league player overlap and international results.
2. **Uncertainty propagation** — players with fewer appearances get pulled toward the league mean rather than overfitting to small samples. A one-game wonder doesn't rank alongside a 30-game consistent performer.

Ratings are position-scoped (forwards rated on attack contribution, defenders on defensive actions) and reported as percentile scores within position group, making them directly comparable across leagues and roles.

## Decision Output — Monte Carlo Bracket Simulation

Group-stage win probabilities are derived from the player ratings via a lightweight Elo-informed model calibrated on recent international results. From there, 100,000 Monte Carlo simulations are run for the full bracket — each simulation draws from the win-probability distributions, propagates teams through knockout rounds, and records final placement.

The output is a calibrated probability distribution for every team reaching every stage: Round of 16, Quarterfinals, Semifinals, Final, and Champion. These are presented as percentages on the dashboard, not fake certainty.

## Self-Evaluation — Brier Score vs. Bookmaker Baseline

Prediction systems without honest self-assessment are sports-media content dressed as analytics. TrueScout tracked a running Brier score across all completed matches, compared against the implied probabilities from major betting markets — the sharpest publicly available baseline.

## Final Record

The tournament ended July 19, 2026, and the pipeline is now frozen. Final scored results: **32 matches graded, 24 correct (75%), average Brier score 0.202** — a 19.2% improvement over an uninformed coin-flip baseline. The dashboard reflects the final run and is no longer updating.

## Guardrailed LLM Scouting Narratives

Each player profile includes a generated scouting narrative. The LLM generation is confidence-gated: players with high model certainty (large sample, consistent performance) receive a data-analyst-voice summary that cites specific metrics. Players with sparse data receive a scout-voice summary that reflects the uncertainty explicitly — no invented statistics, no false confidence. The gating logic enforces this in code, not in the prompt.

## Operational Reliability — Nightly Pipeline (Now Disabled)

During the tournament, the ETL ran nightly on GitHub Actions across nine sequential steps: data ingestion from multiple sources, validation against expected schemas, league normalization, Bayesian model refit, bracket simulation rerun, output assertion checks (probability sums to 1, Brier score within bounds), database write to DuckDB, and API cache refresh, with soft-fail logic for non-critical data gaps. Zero manual intervention was required for the full tournament run. The pipeline is now disabled and the data is frozen at the final tournament state.

A successor project, TrueScout-UCL, is in active development, applying the same rating and calibration approach to UEFA Champions League play.
