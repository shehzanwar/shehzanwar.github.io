---
title: Predictive Modeling & Regression
slug: predictive-modeling
summary: Developed models for complex regression and classification tasks using Ridge/Lasso regularization and tree-based ensemble methods.
description: Applied Ridge/Lasso regularization and gradient-boosted tree ensembles to structured datasets, benchmarking model performance across cross-validated holdout splits.
role: analyst
stack:
  - Python
  - Scikit-Learn
  - Pandas
featured: true
order: 1
coverIcon: lucide:trending-up
publishedAt: 2024-05-01
status: shipped
---

## Overview

Developed and evaluated a suite of predictive models for regression and classification tasks on structured datasets. Compared regularization strategies (Ridge, Lasso, ElasticNet) against tree-based ensembles to characterize bias-variance trade-offs under varying data conditions.

## Approach

- Applied Ridge and Lasso regularization to linear models, tuning alpha via cross-validated grid search.
- Trained Random Forest and Gradient Boosting classifiers, inspecting feature importances for interpretability.
- Evaluated models on held-out test sets using RMSE, MAE, and AUC-ROC depending on task type.

## Key Findings

Regularized linear models matched ensemble performance on low-dimensional problems while offering clearer coefficient interpretability. Tree ensembles dominated on higher-dimensional feature spaces with non-linear interactions.
