# Statistics Distribution Tool

## Current State
New project with no existing implementation.

## Requested Changes (Diff)

### Add
- Page 1: Statistics Tools with search/filter bar for 6 distributions
- Page 2: About page with team member profile cards
- Interactive charts for PDF, CDF, PP Plot, QQ Plot using Recharts
- Full statistical computation for all 6 distributions

### Modify
- N/A

### Remove
- N/A

## Implementation Plan

### Distributions Supported
1. Fatigue Life (Birnbaum-Saunders) - params: alpha (shape), beta (scale)
2. Frechet - params: alpha (shape), s (scale)
3. Fatigue Life 3P (Birnbaum-Saunders 3P) - params: alpha, beta, gamma (location)
4. Frechet 3P - params: alpha (shape), s (scale), m (location)
5. Gamma - params: alpha (shape), beta (scale)
6. Gamma 3P - params: alpha (shape), beta (scale), gamma (location)

### Statistical Measures Per Distribution
- PDF, CDF, Survival, Hazard (all as functions of x, displayed as charts)
- Scalar: Mean, Median, Mode, Variance, Skewness, Kurtosis, Probability Difference
- Quartiles: Q1, Q2 (Median), Q3, Q4 (max/1.0 quantile note)
- MGF, Moment Line Function (displayed as formula/value)
- PP Plot: plot of empirical vs theoretical CDF
- QQ Plot: plot of theoretical vs empirical quantiles

### Frontend
- React Router or tab-based navigation between Page 1 and Page 2
- Recharts for all interactive plots
- Frost white and pink design with clean academic aesthetic
- Distribution selector (cards or dropdown) with search filter
- Parameter input form per distribution
- Results panel with scalar stats table and chart tabs

### About Page
- Main featured card: Dr. G. Kannan (lead)
- Secondary cards: S. Sadaiyappan, B. Ravi Kumar
- Professional layout with avatar placeholders and role descriptions
