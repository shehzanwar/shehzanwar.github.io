---
title: Forecasting Football
slug: premier-league-classification
summary: Leakage-safe Premier League match prediction, statistically indistinguishable from Bet365 closing odds (McNemar p = 0.488) using only pre-match features.
description: Built a leakage-safe Premier League match outcome classifier using only information available before kickoff — Elo ratings with a home-field offset, rolling 5-match form, rest days, and rolling shot accuracy — validated with time-series cross-validation. The best model (Lasso, 54.1% accuracy) was statistically indistinguishable from Bet365 closing-line odds (McNemar's test, p = 0.488) while beating the baseline decisively (p < 0.001).
category: Machine Learning
stack:
  - Python
  - Classification
  - Time-Series CV
  - PCA
repoUrl: https://github.com/shehzanwar/premier-league-match-prediction
featured: true
order: 4
coverIcon: lucide:trophy
publishedAt: 2025-11-30
status: shipped
---

## Overview

Built a multi-class classification system to predict Premier League match outcomes (win, draw, loss) as part of ISYE 6740 (Computational Data Analysis) at Georgia Tech. The design constraint was leakage safety: every feature had to be knowable before kickoff, which ruled out in-match statistics like possession or shots on target.

## Methodology

Twelve engineered features were used, all computed with a `.shift(1)` to prevent lookahead: Elo ratings with a +100 home-field offset, rolling 5-match form, rest days between fixtures, and rolling shot accuracy. Models (Lasso, Ridge, Random Forest, XGBoost) were evaluated with a 5-fold `TimeSeriesSplit` rather than a random or stratified holdout, since shuffling match order would leak future information into training folds. PCA and ISOMAP were used to explore the feature space, and calibration curves checked whether predicted probabilities matched observed outcome frequencies.

## Results

Lasso was the best-performing model at 54.1% accuracy, ahead of XGBoost (49.2%) and a class-frequency dummy baseline (44.8%). The headline result is the comparison against the market: McNemar's test found no statistically significant difference between the model's predictions and Bet365 closing-line odds (p = 0.488) — matching a bookmaker's pricing using only 12 pre-match features, while beating the naive baseline with high confidence (p < 0.001). Draw prediction remained the hardest class across all models, consistent with published literature on football outcome prediction.
