"""
PRESAGE Risk Agent - Clinical Risk Assessment Module
Uses evidence-based risk calculations for diabetes, hypertension, and cardiovascular disease
"""

from core.llm import ask_claude

def calculate_clinical_risk(patient_dict: dict) -> dict:
    """
    Calculate disease risk based on clinical guidelines and patient metrics.
    Uses evidence-based risk factors rather than ML models.
    """
    risks = {}
    
    # ===== DIABETES RISK =====
    diabetes_risk = 0.0
    
    # Blood glucose is primary driver (normal <100, prediabetes 100-125, diabetes >125)
    if patient_dict.get('blood_sugar_fasting', 0) >= 126:
        diabetes_risk += 40
    elif patient_dict.get('blood_sugar_fasting', 0) >= 100:
        diabetes_risk += 25
    elif patient_dict.get('blood_sugar_fasting', 0) >= 90:
        diabetes_risk += 10
    
    # BMI contribution (overweight/obesity)
    bmi = patient_dict.get('bmi', 0)
    if bmi >= 30:
        diabetes_risk += 25  # Obese
    elif bmi >= 25:
        diabetes_risk += 15  # Overweight
    
    # Family history
    if 'diabetes' in str(patient_dict.get('family_history', '')).lower():
        diabetes_risk += 20
    
    # Sleep (poor sleep increases diabetes risk)
    if patient_dict.get('sleep_hours', 8) < 6:
        diabetes_risk += 10
    
    # Physical activity (lack of exercise)
    if patient_dict.get('exercise_days_per_week', 0) < 3:
        diabetes_risk += 10
    
    # Stress and cortisol
    if patient_dict.get('cortisol', 0) > 20:
        diabetes_risk += 5
    
    risks['diabetes'] = min(100, diabetes_risk)
    
    # ===== HYPERTENSION RISK =====
    hypertension_risk = 0.0
    
    # Blood pressure is primary driver
    systolic = patient_dict.get('blood_pressure_systolic', 0)
    diastolic = patient_dict.get('blood_pressure_diastolic', 0)
    
    if systolic >= 160 or diastolic >= 100:
        hypertension_risk += 50  # Stage 2 hypertension
    elif systolic >= 140 or diastolic >= 90:
        hypertension_risk += 40  # Stage 1 hypertension
    elif systolic >= 130 or diastolic >= 80:
        hypertension_risk += 25  # Elevated/Stage 1
    elif systolic >= 120 or diastolic >= 75:
        hypertension_risk += 15  # At-risk
    
    # Family history
    if 'hypertension' in str(patient_dict.get('family_history', '')).lower():
        hypertension_risk += 15
    
    # BMI (obesity increases hypertension risk)
    bmi = patient_dict.get('bmi', 0)
    if bmi >= 30:
        hypertension_risk += 15
    elif bmi >= 25:
        hypertension_risk += 8
    
    # Smoking
    if patient_dict.get('smoking', False):
        hypertension_risk += 10
    
    # Alcohol
    alcohol = patient_dict.get('alcohol', 'none').lower()
    if alcohol == 'heavy':
        hypertension_risk += 15
    elif alcohol == 'moderate':
        hypertension_risk += 5
    
    # Sleep (poor sleep worsens hypertension)
    if patient_dict.get('sleep_hours', 8) < 6:
        hypertension_risk += 10
    
    # Stress
    stress = patient_dict.get('stress_level', 'low').lower()
    if stress == 'high':
        hypertension_risk += 10
    
    # Exercise (protective)
    if patient_dict.get('exercise_days_per_week', 0) >= 5:
        hypertension_risk -= 10
    
    risks['hypertension'] = max(0, min(100, hypertension_risk))
    
    # ===== CARDIOVASCULAR DISEASE RISK =====
    cardiovascular_risk = 0.0
    
    # Blood pressure (major CV risk factor)
    systolic = patient_dict.get('blood_pressure_systolic', 0)
    if systolic >= 160:
        cardiovascular_risk += 35
    elif systolic >= 140:
        cardiovascular_risk += 25
    elif systolic >= 130:
        cardiovascular_risk += 15
    
    # Cholesterol (major CV risk factor)
    total_chol = patient_dict.get('cholesterol_total', 0)
    if total_chol >= 240:
        cardiovascular_risk += 35
    elif total_chol >= 200:
        cardiovascular_risk += 20
    elif total_chol >= 180:
        cardiovascular_risk += 10
    
    # HDL (low HDL increases risk)
    hdl = patient_dict.get('hdl_cholesterol', 0)
    if hdl < 40:
        cardiovascular_risk += 20
    elif hdl < 50:
        cardiovascular_risk += 10
    
    # Family history
    if 'cardiovascular' in str(patient_dict.get('family_history', '')).lower():
        cardiovascular_risk += 20
    
    # Smoking (major risk factor)
    if patient_dict.get('smoking', False):
        cardiovascular_risk += 25
    
    # BMI (obesity)
    bmi = patient_dict.get('bmi', 0)
    if bmi >= 30:
        cardiovascular_risk += 15
    elif bmi >= 25:
        cardiovascular_risk += 8
    
    # Diabetes risk (diabetes increases CV risk)
    blood_sugar = patient_dict.get('blood_sugar_fasting', 0)
    if blood_sugar >= 126:
        cardiovascular_risk += 20
    elif blood_sugar >= 100:
        cardiovascular_risk += 10
    
    # Physical activity (protective)
    if patient_dict.get('exercise_days_per_week', 0) >= 5:
        cardiovascular_risk -= 15
    
    risks['cardiovascular'] = max(0, min(100, cardiovascular_risk))
    
    return risks

def assess_risk(patient_dict: dict) -> dict:
    """
    Calculates disease risk and uses the LLM to interpret the driving factors.
    """
    # Remove metadata keys added by previous stages
    clean_keys = {k: v for k, v in patient_dict.items() if k not in ["flags", "profile_summary"]}
    
    # Calculate clinical risks
    risks = calculate_clinical_risk(clean_keys)

    # Use LLM to analyze the risk numbers alongside the actual patient metrics
    system_prompt = (
        "You are an expert clinical risk interpreter. Review the patient's objective data and "
        "the calculated disease risk percentages. Write a highly analytical, deep-dive interpretation "
        "of the risk profile. \n\n"
        "Your interpretation MUST be structured as follows:\n"
        "1. **Primary Risk Drivers**: Identify the top 3 biometric or lifestyle factors pushing risks higher. Explain the clinical mechanism (e.g., how high cortisol affects insulin sensitivity).\n"
        "2. **Secondary Contributors**: Mention other factors that are adding to the risk profile.\n"
        "3. **Protective Factors**: Highlight what the patient is doing well that is keeping their scores from being even higher.\n"
        "4. **Clinical Correlation**: Briefly explain how these risks (Diabetes, Hypertension, CV) are interlinked for this specific patient profile.\n\n"
        "Be objective, professional, and thorough. Aim for 8-10 sentences in total."
    )
    
    user_msg = (
        f"Patient Profile Metrics:\n{clean_keys}\n\n"
        f"Calculated Clinical Risk Assessment:\n"
        f"- Diabetes Risk: {risks['diabetes']}%\n"
        f"- Hypertension Risk: {risks['hypertension']}%\n"
        f"- Cardiovascular Risk: {risks['cardiovascular']}%"
    )
    
    explanation = ask_claude(system_prompt, user_msg)
    
    return {
        "risk_scores": risks,
        "risk_explanations": explanation
    }
