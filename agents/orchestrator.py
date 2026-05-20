import concurrent.futures
from agents.data_agent import process_data
from agents.risk_agent import assess_risk
from agents.literature_agent import search_literature
from agents.intervention_agent import generate_plan

def calculate_overall_health_score(clean_profile: dict, risk_scores: dict) -> int:
    """
    Calculates a baseline health score from 0-100 based on objective metrics
    and calculated risk scores. Higher is better.
    """
    score = 100
    
    # Penalize based on risk scores
    # Max penalty here is 30 points (if all risk scores are 100%)
    avg_risk = sum(risk_scores.values()) / len(risk_scores)
    score -= (avg_risk * 0.3)
    
    # Penalize based on physical biomarkers
    if clean_profile["blood_pressure_systolic"] > 130: score -= 10
    if clean_profile["blood_sugar_fasting"] > 100: score -= 10
    if clean_profile["bmi"] >= 25.0: score -= 5
    if clean_profile["bmi"] >= 30.0: score -= 5
    
    # Penalize based on lifestyle markers
    if clean_profile["smoking"]: score -= 15
    if clean_profile["alcohol"].lower() == "heavy": score -= 10
    if clean_profile["exercise_days_per_week"] < 3: score -= 5
    if clean_profile["sleep_hours"] < 6: score -= 5

    # Ensure boundaries stay between 0 and 100
    return max(0, min(100, int(score)))

def run_presage_pipeline(raw_patient_data: dict) -> dict:
    """
    Orchestrates the entire multi-agent pipeline sequentially and concurrently.
    """
    # Step 1: Run the Data Agent to clean and validate raw inputs
    clean_profile = process_data(raw_patient_data)
    
    # Step 2: Execute Risk Assessment
    # We need the risk scores to know which disease to search for in literature
    risk_results = assess_risk(clean_profile)
    
    # Step 3: Search Literature for the highest risk disease found
    lit_results = search_literature(risk_results["risk_scores"])

    # Step 4: Call the Intervention Agent with all combined data
    intervention_plan = generate_plan(clean_profile, risk_results, lit_results)
    
    # Step 5: Compute the composite health score
    health_score = calculate_overall_health_score(clean_profile, risk_results["risk_scores"])
    
    # Step 6: Assemble the final reports exactly matching specs
    final_report = {
        "profile_summary": clean_profile["profile_summary"],
        "risk_scores": risk_results["risk_scores"],
        "risk_explanations": risk_results["risk_explanations"],
        "evidence": lit_results["evidence"],
        "intervention_plan": intervention_plan,
        "overall_health_score": health_score
    }
    
    return final_report