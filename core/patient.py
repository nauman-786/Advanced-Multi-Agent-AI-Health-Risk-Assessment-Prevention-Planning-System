import numpy as np
from dataclasses import dataclass, asdict
from typing import List, Dict, Any

@dataclass
class PatientProfile:
    age: int
    sex: str
    blood_pressure_systolic: int
    blood_pressure_diastolic: int
    blood_sugar_fasting: float
    cholesterol_total: float
    hdl_cholesterol: float
    bmi: float
    sleep_hours: float
    stress_level: str
    smoking: bool
    alcohol: str
    exercise_days_per_week: int
    iron_level: float
    cortisol: float
    family_history: List[str]

    def to_dict(self) -> Dict[str, Any]:
        """Returns the patient profile as a standard dictionary."""
        return asdict(self)

    def to_ml_features(self) -> List[float]:
        """
        Converts the raw patient data into a purely numeric feature vector 
        (18 features) for the scikit-learn Machine Learning models.
        """
        # 1. Encode Sex (0 = male, 1 = female, 2 = other)
        sex_map = {"male": 0, "female": 1, "other": 2}
        encoded_sex = sex_map.get(self.sex.lower().strip(), 2)
        
        # 2. Encode Stress Level (0 = low, 1 = medium, 2 = high)
        stress_map = {"low": 0, "medium": 1, "high": 2}
        encoded_stress = stress_map.get(self.stress_level.lower().strip(), 1)
        
        # 3. Encode Alcohol Consumption (0 = none, 1 = moderate, 2 = heavy)
        alcohol_map = {"none": 0, "moderate": 1, "heavy": 2}
        encoded_alcohol = alcohol_map.get(self.alcohol.lower().strip(), 0)
        
        # 4. Encode Boolean Smoking
        encoded_smoking = 1 if self.smoking else 0
        
        # 5. One-Hot Encode Family History
        fh_lower = [condition.lower().strip() for condition in self.family_history]
        fh_diabetes = 1 if "diabetes" in fh_lower else 0
        fh_hypertension = 1 if "hypertension" in fh_lower else 0
        fh_cardiovascular = 1 if "cardiovascular" in fh_lower else 0

        # Compile the final 18-element feature vector
        features = [
            float(self.age),
            float(encoded_sex),
            float(self.blood_pressure_systolic),
            float(self.blood_pressure_diastolic),
            float(self.blood_sugar_fasting),
            float(self.cholesterol_total),
            float(self.hdl_cholesterol),
            float(self.bmi),
            float(self.sleep_hours),
            float(encoded_stress),
            float(encoded_smoking),
            float(encoded_alcohol),
            float(self.exercise_days_per_week),
            float(self.iron_level),
            float(self.cortisol),
            float(fh_diabetes),
            float(fh_hypertension),
            float(fh_cardiovascular)
        ]
        
        return features