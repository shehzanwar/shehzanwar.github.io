---
title: "Formula One: Statistical Learning"
slug: f1-prediction
summary: Predicting F1 lap times (R² 0.863) and podium finishes (AUC 0.914) using PCA, LDA, and Random Forest on high-dimensional race telemetry data.
description: Analyzed the computational performance of PCA, K-Means Clustering, and Support Vector Machines on high-dimensional F1 telemetry data. Engineered predictive models where a Random Forest Regressor achieved an R² of 0.863 for lap times, and an LDA classification model reached an AUC of 0.914 for predicting podium finishes.
category: Statistical Modeling
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
