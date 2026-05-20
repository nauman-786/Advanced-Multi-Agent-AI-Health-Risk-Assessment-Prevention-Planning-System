from core.llm import ask_claude

def process_data(patient_dict: dict) -> dict:
    """
    Validates patient data against realistic clinical ranges, 
    flags abnormalities, and generates an AI summary of the baseline profile.
    """
    flags = []
    
    # 1. Clinical Boundary Validation & Flagging
    if patient_dict["blood_pressure_systolic"] >= 130 or patient_dict["blood_pressure_diastolic"] >= 80:
        flags.append("Elevated or High Blood Pressure (Hypertension Risk)")
    if patient_dict["blood_sugar_fasting"] >= 100:
        flags.append("Elevated Fasting Blood Glucose (Prediabetes/Diabetes Risk)")
    if patient_dict["bmi"] >= 25.0:
        flags.append("BMI indicates Overweight or Obese range")
    if patient_dict["cholesterol_total"] >= 200:
        flags.append("High Total Cholesterol")
    if patient_dict["hdl_cholesterol"] < 40 and patient_dict["sex"].lower() == "male":
        flags.append("Low HDL (Good) Cholesterol for Males")
    if patient_dict["hdl_cholesterol"] < 50 and patient_dict["sex"].lower() == "female":
        flags.append("Low HDL (Good) Cholesterol for Females")
    if patient_dict["sleep_hours"] < 6:
        flags.append("Suboptimal sleep duration (Chronic sleep deprivation risk)")
    if patient_dict["stress_level"].lower() == "high":
        flags.append("High perceived stress levels affecting cortisol balance")
    if patient_dict["cortisol"] > 20:
        flags.append("Elevated cortisol levels (Potential chronic stress marker)")

    # 2. Package the clean profile data
    clean_profile = patient_dict.copy()
    clean_profile["flags"] = flags
    
    # 3. Use LLM to write a plain English medical summary
    system_prompt = (
        "You are an expert clinical triage assistant. Review the provided patient vital signs "
        "and lifestyle metrics. Write a professional, plain English 3-sentence summary of their "
        "current baseline health status. Highlight any severe metrics or explicit combinations "
        "of risk factors (like smoking alongside elevated blood pressure) without diagnosing them."
    )
    
    user_msg = f"Patient Health Metrics:\n{clean_profile}"
    
    # Generate summary using our OpenRouter wrapper
    summary = ask_claude(system_prompt, user_msg)
    clean_profile["profile_summary"] = summary
    
    return clean_profile