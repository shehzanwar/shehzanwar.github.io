---
title: "Formula One: Statistical Learning"
slug: f1-prediction
summary: Predicting F1 lap times (R² 0.863) and podium finishes (AUC 0.914) from historical race and qualifying data using PCA, Random Forest, and LDA.
description: Built a statistical learning pipeline on historical Formula 1 results data — race results, qualifying times, per-driver lap-time statistics, and constructor history. A Random Forest Regressor reached R² 0.863 for lap-time prediction, beating a Ridge/Lasso baseline (R² 0.791), and an LDA classifier reached AUC 0.914 for podium-finish classification.
category: Statistical Modeling
stack:
  - Python
  - Random Forest
  - PCA
  - LDA
  - Scikit-Learn
repoUrl: https://github.com/shehzanwar/f1-lap-prediction
featured: true
order: 5
coverIcon: lucide:flag
publishedAt: 2025-11-15
status: shipped
---

## Overview

Developed a statistical learning pipeline on historical Formula 1 data (Ergast dataset) as part of ISYE 7406 (Data Mining & Statistical Learning) at Georgia Tech. The goal was to predict lap times and classify podium finishes from race results, qualifying times, per-driver lap-time mean and standard deviation, driver age, and constructor history — no telemetry involved, since none exists in the underlying dataset.

## Methodology

PCA and PCR/PLS were used to explore dimensionality and multicollinearity in the feature set, alongside Ridge and Lasso regression as regularized linear baselines. A Random Forest Regressor was then trained to predict lap times, and Linear Discriminant Analysis (LDA) was used to classify podium finish probability. Models were evaluated via K-fold cross-validation.

## Results

The Random Forest regressor achieved an R² of 0.863 on lap-time prediction, a meaningful jump over the Ridge/Lasso baseline's R² of 0.791 — evidence that the lap-time relationship has non-linear structure the linear models couldn't capture. For podium classification, LDA reached an AUC of 0.914, outperforming a Random Forest classifier on the same task.
