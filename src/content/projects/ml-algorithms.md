---
title: Machine Learning Implementations
slug: ml-algorithms
summary: Implemented core ML algorithms from scratch including PCA, K-Means Clustering, and SVMs to analyze computational performance and deepen algorithmic intuition.
description: From-scratch NumPy implementations of PCA, K-Means, and SVM benchmarked against scikit-learn baselines to surface performance characteristics.
role: engineer
stack:
  - Python
  - NumPy
  - PCA
  - SVM
featured: true
order: 2
coverIcon: lucide:cpu
publishedAt: 2024-08-01
status: shipped
---

## Overview

Implemented foundational machine learning algorithms from scratch using NumPy to build intuition around their mathematical underpinnings and computational behavior. Each implementation was benchmarked against the equivalent scikit-learn baseline.

## Implementations

- **PCA** — Eigendecomposition of the sample covariance matrix; validated reconstruction error against `sklearn.decomposition.PCA`.
- **K-Means** — Lloyd's algorithm with k-means++ initialization; measured convergence speed across random seeds.
- **SVM** — SMO-inspired dual solver for binary classification with RBF kernel; compared decision boundaries with `sklearn.svm.SVC`.

## Outcome

The exercise surfaced the practical impact of initialization strategies on K-Means convergence and the sensitivity of SVM margins to the kernel bandwidth parameter gamma.
