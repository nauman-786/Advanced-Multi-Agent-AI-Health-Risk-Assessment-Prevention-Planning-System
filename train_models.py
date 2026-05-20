#!/usr/bin/env python
"""
PRESAGE Model Training Pipeline
Trains 3 disease risk prediction models from provided datasets
with cross-validation and accuracy optimization
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib
import warnings
warnings.filterwarnings('ignore')

print("=" * 70)
print("PRESAGE MODEL TRAINING PIPELINE")
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
    
    # Scale features
    scaler_diabetes = StandardScaler()
    X_train_scaled = scaler_diabetes.fit_transform(X_train)
    X_test_scaled = scaler_diabetes.transform(X_test)
    
    # Train multiple models and select best
    models_diabetes = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    best_model_diabetes = None
    best_score_diabetes = 0
    results_diabetes = {}
    
    for name, model in models_diabetes.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        
        results_diabetes[name] = {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1
        }
        
        print(f"\n  {name}:")
        print(f"    Accuracy:  {accuracy:.4f}")
        print(f"    Precision: {precision:.4f}")
        print(f"    Recall:    {recall:.4f}")
        print(f"    F1-Score:  {f1:.4f}")
        
        if accuracy > best_score_diabetes:
            best_score_diabetes = accuracy
            best_model_diabetes = model
    
    # Save best diabetes model
    diabetes_model_path = 'data/risk_models/diabetes_model.pkl'
    joblib.dump(best_model_diabetes, diabetes_model_path)
    print(f"\n✓ Best Diabetes Model Saved: {diabetes_model_path}")
    print(f"  Accuracy: {best_score_diabetes:.4f}")
    
except Exception as e:
    print(f"✗ Error training diabetes model: {e}")

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
    
    # Scale features
    scaler_cardio = StandardScaler()
    X_train_scaled = scaler_cardio.fit_transform(X_train)
    X_test_scaled = scaler_cardio.transform(X_test)
    
    # Train multiple models
    models_cardio = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    best_model_cardio = None
    best_score_cardio = 0
    results_cardio = {}
    
    for name, model in models_cardio.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        
        results_cardio[name] = {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1
        }
        
        print(f"\n  {name}:")
        print(f"    Accuracy:  {accuracy:.4f}")
        print(f"    Precision: {precision:.4f}")
        print(f"    Recall:    {recall:.4f}")
        print(f"    F1-Score:  {f1:.4f}")
        
        if accuracy > best_score_cardio:
            best_score_cardio = accuracy
            best_model_cardio = model
    
    # Save best cardiovascular model
    cardio_model_path = 'data/risk_models/cardiovascular_model.pkl'
    joblib.dump(best_model_cardio, cardio_model_path)
    print(f"\n✓ Best Cardiovascular Model Saved: {cardio_model_path}")
    print(f"  Accuracy: {best_score_cardio:.4f}")
    
except Exception as e:
    print(f"✗ Error training cardiovascular model: {e}")

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
    
    # Scale features
    scaler_hyper = StandardScaler()
    X_train_scaled = scaler_hyper.fit_transform(X_train)
    X_test_scaled = scaler_hyper.transform(X_test)
    
    # Train multiple models
    models_hyper = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    best_model_hyper = None
    best_score_hyper = 0
    results_hyper = {}
    
    for name, model in models_hyper.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        
        results_hyper[name] = {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1
        }
        
        print(f"\n  {name}:")
        print(f"    Accuracy:  {accuracy:.4f}")
        print(f"    Precision: {precision:.4f}")
        print(f"    Recall:    {recall:.4f}")
        print(f"    F1-Score:  {f1:.4f}")
        
        if accuracy > best_score_hyper:
            best_score_hyper = accuracy
            best_model_hyper = model
    
    # Save best hypertension model
    hyper_model_path = 'data/risk_models/hypertension_model.pkl'
    joblib.dump(best_model_hyper, hyper_model_path)
    print(f"\n✓ Best Hypertension Model Saved: {hyper_model_path}")
    print(f"  Accuracy: {best_score_hyper:.4f}")
    
except Exception as e:
    print(f"✗ Error training hypertension model: {e}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 70)
print("MODEL TRAINING SUMMARY")
print("=" * 70)
print(f"\n✓ Diabetes Model:        Accuracy = {best_score_diabetes:.4f}")
print(f"✓ Cardiovascular Model:  Accuracy = {best_score_cardio:.4f}")
print(f"✓ Hypertension Model:    Accuracy = {best_score_hyper:.4f}")
print(f"\nAll models saved to: data/risk_models/")
print("\n" + "=" * 70)
