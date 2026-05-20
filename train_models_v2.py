#!/usr/bin/env python
"""
PRESAGE Model Training Pipeline (v2)
Trains 3 disease risk prediction models with proper feature scaling
Saves both models AND scalers for consistent prediction
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import warnings
warnings.filterwarnings('ignore')

print("=" * 70)
print("PRESAGE MODEL TRAINING PIPELINE v2 (with Feature Scaling)")
print("=" * 70)

# ============================================================================
# MODEL 1: DIABETES RISK PREDICTION
# ============================================================================
print("\n[1/3] TRAINING DIABETES RISK MODEL...")
print("-" * 70)

try:
    df_diabetes = pd.read_csv('diabetes_data.csv')
    print(f"✓ Loaded diabetes dataset: {df_diabetes.shape}")
    
    # Prepare features and target
    X_diabetes = df_diabetes.drop('Diabetes', axis=1)
    y_diabetes = df_diabetes['Diabetes']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_diabetes, y_diabetes, test_size=0.2, random_state=42, stratify=y_diabetes
    )
    
    # Create and save scaler
    scaler_diabetes = StandardScaler()
    X_train_scaled = scaler_diabetes.fit_transform(X_train)
    X_test_scaled = scaler_diabetes.transform(X_test)
    
    # Train Gradient Boosting (best performer)
    model_diabetes = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model_diabetes.fit(X_train_scaled, y_train)
    
    y_pred = model_diabetes.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    print(f"\n  Gradient Boosting Classifier:")
    print(f"    Accuracy:  {accuracy:.4f}")
    print(f"    Precision: {precision:.4f}")
    print(f"    Recall:    {recall:.4f}")
    print(f"    F1-Score:  {f1:.4f}")
    
    # Save model and scaler
    joblib.dump(model_diabetes, 'data/risk_models/diabetes_model.pkl')
    joblib.dump(scaler_diabetes, 'data/risk_models/diabetes_scaler.pkl')
    print(f"\n✓ Diabetes Model & Scaler Saved")
    print(f"  Accuracy: {accuracy:.4f}")
    
except Exception as e:
    print(f"✗ Error training diabetes model: {e}")
    import traceback
    traceback.print_exc()

# ============================================================================
# MODEL 2: CARDIOVASCULAR RISK PREDICTION
# ============================================================================
print("\n[2/3] TRAINING CARDIOVASCULAR RISK MODEL...")
print("-" * 70)

try:
    # Read and parse cardiovascular data (semicolon-delimited)
    df_cardio = pd.read_csv('cardio_train.csv', sep=';')
    print(f"✓ Loaded cardiovascular dataset: {df_cardio.shape}")
    
    # Target is 'cardio' column
    X_cardio = df_cardio.drop('cardio', axis=1)
    y_cardio = df_cardio['cardio']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_cardio, y_cardio, test_size=0.2, random_state=42, stratify=y_cardio
    )
    
    # Create and save scaler
    scaler_cardio = StandardScaler()
    X_train_scaled = scaler_cardio.fit_transform(X_train)
    X_test_scaled = scaler_cardio.transform(X_test)
    
    # Train Gradient Boosting
    model_cardio = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model_cardio.fit(X_train_scaled, y_train)
    
    y_pred = model_cardio.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    print(f"\n  Gradient Boosting Classifier:")
    print(f"    Accuracy:  {accuracy:.4f}")
    print(f"    Precision: {precision:.4f}")
    print(f"    Recall:    {recall:.4f}")
    print(f"    F1-Score:  {f1:.4f}")
    
    # Save model and scaler
    joblib.dump(model_cardio, 'data/risk_models/cardiovascular_model.pkl')
    joblib.dump(scaler_cardio, 'data/risk_models/cardiovascular_scaler.pkl')
    print(f"\n✓ Cardiovascular Model & Scaler Saved")
    print(f"  Accuracy: {accuracy:.4f}")
    
except Exception as e:
    print(f"✗ Error training cardiovascular model: {e}")
    import traceback
    traceback.print_exc()

# ============================================================================
# MODEL 3: HYPERTENSION RISK PREDICTION
# ============================================================================
print("\n[3/3] TRAINING HYPERTENSION RISK MODEL...")
print("-" * 70)

try:
    df_chronic = pd.read_csv('chronic_disease_prediction_dataset.csv')
    print(f"✓ Loaded chronic disease dataset: {df_chronic.shape}")
    
    # Drop Patient_ID
    df_chronic = df_chronic.drop('Patient_ID', axis=1)
    
    # Encode categorical variables
    le_dict = {}
    categorical_cols = df_chronic.select_dtypes(include=['object']).columns
    
    for col in categorical_cols:
        if col != 'HasChronicDisease':
            le = LabelEncoder()
            df_chronic[col] = le.fit_transform(df_chronic[col])
            le_dict[col] = le
    
    # Target: HasChronicDisease (as proxy for hypertension)
    le_target = LabelEncoder()
    y_hypertension = le_target.fit_transform(df_chronic['HasChronicDisease'])
    X_hypertension = df_chronic.drop('HasChronicDisease', axis=1)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_hypertension, y_hypertension, test_size=0.2, random_state=42, stratify=y_hypertension
    )
    
    # Create and save scaler
    scaler_hyper = StandardScaler()
    X_train_scaled = scaler_hyper.fit_transform(X_train)
    X_test_scaled = scaler_hyper.transform(X_test)
    
    # Train Gradient Boosting
    model_hyper = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model_hyper.fit(X_train_scaled, y_train)
    
    y_pred = model_hyper.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    print(f"\n  Gradient Boosting Classifier:")
    print(f"    Accuracy:  {accuracy:.4f}")
    print(f"    Precision: {precision:.4f}")
    print(f"    Recall:    {recall:.4f}")
    print(f"    F1-Score:  {f1:.4f}")
    
    # Save model and scaler
    joblib.dump(model_hyper, 'data/risk_models/hypertension_model.pkl')
    joblib.dump(scaler_hyper, 'data/risk_models/hypertension_scaler.pkl')
    print(f"\n✓ Hypertension Model & Scaler Saved")
    print(f"  Accuracy: {accuracy:.4f}")
    
except Exception as e:
    print(f"✗ Error training hypertension model: {e}")
    import traceback
    traceback.print_exc()

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 70)
print("MODEL TRAINING COMPLETE ✓")
print("=" * 70)
print("\nAll models and scalers saved to: data/risk_models/")
print("  - diabetes_model.pkl + diabetes_scaler.pkl")
print("  - cardiovascular_model.pkl + cardiovascular_scaler.pkl")
print("  - hypertension_model.pkl + hypertension_scaler.pkl")
print("\n" + "=" * 70)
