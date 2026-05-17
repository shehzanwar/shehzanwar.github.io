---
title: "Formula One: Statistical Learning"
slug: f1-prediction
summary: Predicting lap times and podium finishes using advanced statistical learning and telemetry data from Formula 1 race sessions.
description: Applied PCA for dimensionality reduction on high-frequency F1 telemetry features, then trained and tuned a Random Forest model to predict lap times and podium probability, evaluated against held-out race sessions.
role: researcher
stack:
  - Python
  - Random Forest
  - PCA
  - Scikit-Learn
repoUrl: https://github.com/shehzanwar/DMSL7406/tree/main/Project
featured: true
order: 2
coverIcon: lucide:flag
publishedAt: 2025-11-15
status: shipped
---

## Overview

Developed a statistical learning pipeline for Formula 1 telemetry data as part of ISYE 7406 (Data Mining & Statistical Learning) at Georgia Tech. The goal was to predict lap times and classify podium probability using race session telemetry including speed traces, throttle and brake inputs, DRS activation, and tyre age.

## Methodology

PCA was applied to reduce the high-dimensional telemetry feature space while retaining 95% of variance. A Random Forest Regressor was then trained on the reduced feature set to predict lap times, and a Random Forest Classifier was used to predict podium finish probability. Models were evaluated via 10-fold cross-validation and benchmarked against Lasso regression and logistic regression baselines.

## Results

The Random Forest regressor achieved the lowest RMSE across all tested models on lap time prediction. Feature importance analysis revealed that tyre age, fuel load, and cornering speed were the strongest predictors — consistent with domain knowledge from motorsport engineering.
