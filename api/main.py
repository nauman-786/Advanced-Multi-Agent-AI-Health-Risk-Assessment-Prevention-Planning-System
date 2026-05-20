import sys
import os
from pathlib import Path

# Add parent directory to sys.path to allow imports from root level modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from agents.orchestrator import run_presage_pipeline
import logging
from datetime import datetime

# Setup logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PRESAGE Multi-Agent AI Health Prediction System",
    version="1.0.0",
    description="Backend analysis engine utilizing parallel medical agents and ML inference."
)

# Enable CORS so your React frontend can communicate with the backend smoothly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the Pydantic data schema for incoming API requests to ensure strict validation
class PatientInputSchema(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Age of the patient")
    sex: str = Field(..., description="Biological sex (male/female/other)")
    blood_pressure_systolic: int = Field(..., ge=50, le=250, description="Systolic blood pressure in mmHg")
    blood_pressure_diastolic: int = Field(..., ge=30, le=150, description="Diastolic blood pressure in mmHg")
    blood_sugar_fasting: float = Field(..., ge=40.0, le=500.0, description="Fasting blood sugar in mg/dL")
    cholesterol_total: float = Field(..., ge=80.0, le=500.0, description="Total cholesterol in mg/dL")
    hdl_cholesterol: float = Field(..., ge=10.0, le=150.0, description="HDL cholesterol in mg/dL")
    bmi: float = Field(..., ge=10.0, le=60.0, description="Body Mass Index")
    sleep_hours: float = Field(..., ge=0.0, le=24.0, description="Average sleep hours per night")
    stress_level: str = Field(..., description="Perceived stress level (low/medium/high)")
    smoking: bool = Field(..., description="True if current smoker, False otherwise")
    alcohol: str = Field(..., description="Alcohol consumption tier (none/moderate/heavy)")
    exercise_days_per_week: int = Field(..., ge=0, le=7, description="Number of exercise days per week")
    iron_level: float = Field(..., ge=5.0, le=300.0, description="Serum iron level in mcg/dL")
    cortisol: float = Field(..., ge=1.0, le=60.0, description="Cortisol level in mcg/dL")
    family_history: List[str] = Field(default=[], description="List of conditions present in family history")

    class Config:
        json_schema_extra = {
            "example": {
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
        }

@app.get("/health")
def health_check():
    """Returns the operational status of the PRESAGE backend engine."""
    return {"status": "healthy", "engine": "PRESAGE Multi-Agent Pipeline"}

@app.post("/analyze")
def analyze_patient_profile(patient_data: PatientInputSchema):
    """
    Accepts a validated patient profile, routes it through the multi-agent execution pipeline,
    and returns a comprehensive risk evaluation and customized 90-day intervention strategy.
    """
    try:
        logger.info("Starting patient analysis pipeline...")
        # Convert the validated Pydantic object directly into a standard Python dict
        raw_input_dict = patient_data.model_dump()
        
        # Execute the pipeline via our orchestrator
        logger.info("Executing orchestrator pipeline...")
        pipeline_output = run_presage_pipeline(raw_input_dict)
        logger.info("Pipeline completed successfully")
        
        return pipeline_output
    except Exception as e:
        logger.error(f"Pipeline error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Pipeline Processing Error: {str(e)}")

@app.post("/upload-image")
async def upload_medical_image(file: UploadFile = File(...), patient_id: str = None):
    """
    Accepts medical images (X-rays, lab reports, etc.) and stores them for future analysis.
    Supports: JPEG, PNG, PDF, and common medical image formats.
    """
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.path.dirname(__file__), "..", "data", "patient_images")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Validate file type
        allowed_extensions = {'jpg', 'jpeg', 'png', 'pdf', 'dicom', 'dcm', 'gif'}
        file_ext = file.filename.split('.')[-1].lower() if file.filename else ""
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type: {file_ext}. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Validate file size (max 50MB)
        max_size = 50 * 1024 * 1024
        file_content = await file.read()
        
        if len(file_content) > max_size:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size: 50MB, Received: {len(file_content) / (1024*1024):.2f}MB"
            )
        
        # Generate unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        patient_prefix = f"{patient_id}_" if patient_id else ""
        filename = f"{patient_prefix}{timestamp}_{file.filename}"
        filepath = os.path.join(upload_dir, filename)
        
        # Save file
        with open(filepath, "wb") as f:
            f.write(file_content)
        
        logger.info(f"Medical image uploaded: {filename} ({len(file_content) / 1024:.2f}KB)")
        
        return {
            "status": "success",
            "message": "Medical image uploaded successfully",
            "filename": filename,
            "filepath": filepath,
            "size_kb": len(file_content) / 1024,
            "patient_id": patient_id
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Image upload error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")