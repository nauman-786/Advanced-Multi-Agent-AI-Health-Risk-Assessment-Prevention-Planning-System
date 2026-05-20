import axios from 'axios';

// Configure axios to connect to FastAPI backend
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  timeout: 180000, // 3 minute timeout for analysis
});

export interface PatientData {
  age: number;
  sex: string;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  blood_sugar_fasting: number;
  cholesterol_total: number;
  hdl_cholesterol: number;
  bmi: number;
  sleep_hours: number;
  stress_level: string;
  smoking: boolean;
  alcohol: string;
  exercise_days_per_week: number;
  iron_level: number;
  cortisol: number;
  family_history: string[];
}

export interface HealthAnalysisResponse {
  overall_health_score: number;
  risk_scores: {
    diabetes: number;
    hypertension: number;
    cardiovascular: number;
  };
  risk_explanations: string;
  profile_summary: string;
  evidence: string;
  intervention_plan: string;
}

export const healthApi = {
  // Check API health
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('API health check failed:', error);
      throw error;
    }
  },

  // Analyze patient profile
  async analyzePatient(patientData: PatientData): Promise<HealthAnalysisResponse> {
    try {
      const response = await apiClient.post('/analyze', patientData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        console.error('Full API Error Context:', JSON.stringify(errorData, null, 2));
        
        let errorMessage = 'Failed to analyze patient data';
        if (errorData?.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        }
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  // Upload medical images (if needed for future enhancement)
  async uploadImage(file: File, patientId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (patientId) {
      formData.append('patient_id', patientId);
    }

    try {
      const response = await apiClient.post('/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  },
};

export default healthApi;
