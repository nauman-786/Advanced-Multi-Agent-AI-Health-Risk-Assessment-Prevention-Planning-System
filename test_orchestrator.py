#!/usr/bin/env python
"""Test script to debug the orchestrator pipeline"""

import sys
import traceback
from agents.orchestrator import run_presage_pipeline

# Test data from the API schema example
test_patient = {
    "age": 45,
    "sex": "male",
    "blood_pressure_systolic": 135,
    "blood_pressure_diastolic": 85,
    "blood_sugar_fasting": 105.5,
    "cholesterol_total": 210.0,
    "hdl_cholesterol": 38.0,
    "bmi": 26.4,
    "sleep_hours": 5.5,
    "stress_level": "high",
    "smoking": True,
    "alcohol": "moderate",
    "exercise_days_per_week": 1,
    "iron_level": 75.0,
    "cortisol": 22.1,
    "family_history": ["diabetes", "hypertension"]
}

print("=" * 60)
print("PRESAGE ORCHESTRATOR DEBUG TEST")
print("=" * 60)
print(f"\nTesting with sample patient data...")
print(f"Patient Age: {test_patient['age']}, Sex: {test_patient['sex']}")

try:
    print("\nStarting pipeline execution...")
    result = run_presage_pipeline(test_patient)
    print("\n✓ Pipeline completed successfully!")
    print(f"\nHealth Score: {result.get('overall_health_score', 'N/A')}")
    print(f"Risk Scores: {result.get('risk_scores', {})}")
except Exception as e:
    print(f"\n✗ PIPELINE ERROR: {str(e)}")
    print("\nFull Traceback:")
    traceback.print_exc()
    sys.exit(1)
