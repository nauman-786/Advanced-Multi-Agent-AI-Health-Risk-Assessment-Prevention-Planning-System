from core.llm import ask_claude

def generate_plan(patient_profile: dict, risk_data: dict, literature_data: dict) -> str:
    """
    Synthesizes patient metrics, objective risk percentages, and medical literature
    to create a personalized, time-bounded 90-day health intervention plan.
    """
    system_prompt = (
        "You are an expert preventative health clinician specializing in chronic disease prevention. "
        "Your task is to draft a comprehensive, highly structured, 100% personalized prevention plan based on "
        "the patient's exact biometric numbers, their calculated machine learning risks, and recent medical literature. "
        "Do not use generic clinical statements. Your response must address the specific metrics driving their risk.\n\n"
        "You must structure your response with the following explicit sections:\n"
        "1. **CRITICAL INTERVENTION PRIORITIES**: Rank the top 3 changes needed by urgency. For each, provide the 'Why' (biometric link) and the 'How' (specific action).\n"
        "2. **NUTRITIONAL PRECISION STRATEGY**: Provide specific dietary adjustments based on their biomarkers (e.g., if iron is low, specify heme-iron sources; if glucose is high, specify low-glycemic indexing).\n"
        "3. **LIFESTYLE & CIRCADIAN OPTIMIZATION**: Address sleep, stress, and exercise specifically. Include 'micro-habits' (e.g., '10-minute walk after largest meal').\n"
        "4. **90-DAY GRADUATED ROADMAP**: \n"
        "   - Phase 1 (Weeks 1-4): Focus on stabilization and baseline habits.\n"
        "   - Phase 2 (Weeks 5-8): Focus on intensification and biometric modification.\n"
        "   - Phase 3 (Weeks 9-12): Focus on sustainability and long-term integration.\n"
        "5. **BIOMETRIC TARGETS & RETESTING**: Specify exactly which numbers we want to see change and the retesting schedule (Day 30, 60, 90)."
    )

    user_msg = (
        f"--- PATIENT BIOMETRICS & LIFESTYLE PROFILE ---\n{patient_profile}\n\n"
        f"--- CALCULATED MACHINE LEARNING RISK METRICS ---\n{risk_data['risk_scores']}\n"
        f"Risk Drivers: {risk_data['risk_explanations']}\n\n"
        f"--- MEDICAL LITERATURE FINDINGS (Targeting {literature_data['highest_risk_disease']}) ---\n"
        f"{literature_data['evidence']}"
    )

    plan = ask_claude(system_prompt, user_msg)
    return plan