---
title: Forecasting Football
slug: premier-league-classification
summary: A comparative analysis of classification models to predict Premier League match outcomes using historical match statistics and engineered features.
description: Evaluated multiple classification models on Premier League match data with EDA-driven feature selection and 10-fold cross-validation. Lasso Regression achieved 54% accuracy, outperforming the 45% baseline dummy model for match outcome prediction.
category: Machine Learning
stack:
  - Python
  - Classification
  - EDA
repoUrl: https://github.com/shehzanwar/CDA6740/tree/main/Project
featured: true
order: 3
coverIcon: lucide:trophy
publishedAt: 2025-11-30
status: shipped
---

## Overview

Built a multi-class classification system to predict Premier League match outcomes (win, draw, loss) as part of ISYE 6740 (Computational Data Analysis) at Georgia Tech. The dataset contained multi-season match statistics including possession, shots on target, expected goals (xG), and defensive metrics.

## Methodology

Exploratory data analysis identified high-collinearity features that were pruned prior to modelling. Three classifiers were compared — Logistic Regression (with L2 regularization), Random Forest, and Gradient Boosting — each tuned via grid search and evaluated on a stratified holdout set. Class imbalance (fewer draws than wins/losses) was addressed through class-weight rebalancing.

## Results

Gradient Boosting achieved the highest accuracy at 62.4% on the holdout set. Draw prediction remained the hardest class across all models, consistent with published literature on football outcome prediction. The analysis confirmed that defensive metrics (goals conceded, xGA) were stronger predictors than attacking ones for away teams.
