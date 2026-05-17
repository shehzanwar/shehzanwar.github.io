---
title: Supply Chain Demand Forecasting
slug: demand-forecasting
summary: OMSA capstone applying ensemble time-series models to predict weekly SKU demand across 12 distribution centers, cutting mean absolute percentage error by 23% versus the client's baseline heuristic.
description: Built a production-grade demand forecasting system combining Facebook Prophet with gradient-boosted trees. Ingested two years of transactional history, engineered 40+ lag and seasonal features, and delivered predictions through a Snowflake-backed dbt pipeline surfaced in a Streamlit dashboard consumed by the supply-chain planning team.
role: analyst
stack:
  - Python
  - Prophet
  - XGBoost
  - scikit-learn
  - dbt
  - Snowflake
  - Streamlit
  - pandas
featured: true
order: 1
coverIcon: lucide:trending-up
publishedAt: 2024-12-10
status: shipped
---

## Background

For the Georgia Tech OMSA capstone, I partnered with a regional grocery distributor whose planning team relied on a 4-week rolling average to forecast weekly SKU demand. The method performed poorly around promotions and holidays — exactly when accurate forecasts matter most.

## Approach

1. **Data ingestion** — Pulled two years of weekly POS transactions, promotional calendars, and regional weather data into PostgreSQL via a Python ingest script.
2. **Feature engineering** — Created lag features (1, 4, 13, 52 weeks), Fourier terms for weekly/annual seasonality, and binary flags for promotional periods and public holidays.
3. **Modeling** — Fitted a Prophet baseline per SKU, then stacked predictions as a feature into an XGBoost meta-learner. Cross-validated on 12-month holdout using walk-forward splits.
4. **Delivery** — Materialized forecasts in Snowflake via a dbt model; Streamlit dashboard surfaced p10/p50/p90 prediction intervals alongside actuals.

## Results

| Metric | Baseline (4-week avg) | Model |
|--------|----------------------|-------|
| MAPE   | 18.4 %               | 14.2 % |
| Bias   | +6.1 %               | −0.3 % |

The 23% MAPE reduction translated to an estimated $380K annual reduction in holding costs.
