---
title: Does Geopolitical Stress Move Commodity Prices?
slug: geopolitical-stress-commodity-pipeline
summary: A 2018–2025 study testing whether geopolitical stress Granger-causes commodity volatility — 480 corrected hypothesis tests, zero significant results, and why that's the right answer.
description: Built a composite Geopolitical Stress Index from GDELT/CAMEO-coded global events (2018–2025) and tested it against 20-day realized volatility in WTI crude, gold, and wheat using Granger causality with multiple-comparison correction across 480 hypothesis tests. The study found no statistically significant causal relationship — a designed null result consistent with market efficiency operating faster than daily event aggregation can capture.
category: Data Engineering
stack:
  - Python
  - GDELT
  - Granger Causality
  - Pandas
  - Time-Series Analysis
repoUrl: https://github.com/shehzanwar/geopolitical-stress-commodity-pipeline
featured: true
order: 3
coverIcon: lucide:globe
publishedAt: 2026-03-01
status: shipped
---

## Question

Does rising geopolitical stress cause commodity markets to move — or do markets already price it in faster than daily data can measure? Global commodity markets — crude oil, gold, wheat — are widely assumed to respond to geopolitical shocks, but the claim is rarely tested rigorously. This project built the pipeline to test it properly, then reported what the data actually showed.

## Design

Global political events from 2018–2025 were pulled from GDELT and coded using the CAMEO event taxonomy, then aggregated into a composite Geopolitical Stress Index. Commodity price series (WTI crude, gold, wheat) were converted to 20-day realized volatility, a standard measure of near-term market turbulence. Granger causality tests were run between the stress index and each commodity's volatility series across multiple lag windows and event categories, producing 480 individual hypothesis tests. Because running that many tests inflates the false-positive rate, results were corrected for multiple comparisons before any test was called significant.

## Result

**Zero of 480 tests survived correction.** No statistically significant Granger-causal relationship was found between the geopolitical stress index and commodity volatility at any lag tested.

## Why the Null Result Is the Right Answer

A null result here is not a failed pipeline — it's evidence the methodology was applied correctly. Three things point to why zero is the honest outcome rather than a modeling failure:

1. **Market efficiency operates faster than daily aggregation can capture.** If futures markets price in geopolitical risk within hours, a daily-resolution stress index will systematically miss the causal window.
2. **Realized volatility is backward-looking.** It measures how much prices already moved, not investors' forward expectations — implied volatility would be a more direct test of anticipatory pricing.
3. **A global stress index dilutes event-level signal.** Averaging across all geopolitical events worldwide likely washes out the effect of the specific events (say, a Strait of Hormuz incident) that actually move a specific commodity.

Reporting a spurious positive from underpowered correction would have been the actual failure mode here — the discipline was in not doing that.

## What's Next

The natural follow-ups are the three points above, run as a next iteration: substitute implied volatility for realized volatility, filter events by geographic and sectoral relevance to each commodity rather than using a global average, and use event-study windows (days around a specific shock) instead of daily lag correlation.
