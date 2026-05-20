#!/usr/bin/env python
"""
Test to identify exact feature columns used in each dataset
"""

import pandas as pd

print("=" * 70)
print("FEATURE ANALYSIS FOR MODEL TRAINING DATA")
print("=" * 70)

# Diabetes dataset
df_diabetes = pd.read_csv('diabetes_data.csv')
diabetes_features = [col for col in df_diabetes.columns if col != 'Diabetes']
print(f"\nDIABETES MODEL:")
print(f"  Features ({len(diabetes_features)}): {diabetes_features}")

# Cardiovascular dataset
df_cardio = pd.read_csv('cardio_train.csv', sep=';')
cardio_features = [col for col in df_cardio.columns if col != 'cardio']
print(f"\nCARDIOVASCULAR MODEL:")
print(f"  Features ({len(cardio_features)}): {cardio_features}")

# Chronic disease dataset
df_chronic = pd.read_csv('chronic_disease_prediction_dataset.csv')
df_chronic = df_chronic.drop('Patient_ID', axis=1)
hypertension_features = [col for col in df_chronic.columns if col != 'HasChronicDisease']
print(f"\nHYPERTENSION MODEL:")
print(f"  Features ({len(hypertension_features)}): {hypertension_features}")

print("\n" + "=" * 70)
print("PATIENT PROFILE FEATURES:")
print("=" * 70)

# Patient profile features
patient_features = [
    'age', 'sex', 'blood_pressure_systolic', 'blood_pressure_diastolic',
    'blood_sugar_fasting', 'cholesterol_total', 'hdl_cholesterol', 'bmi',
    'sleep_hours', 'stress_level', 'smoking', 'alcohol', 'exercise_days_per_week',
    'iron_level', 'cortisol', 'family_history'
]
print(f"  Patient Features ({len(patient_features)}): {patient_features}")
