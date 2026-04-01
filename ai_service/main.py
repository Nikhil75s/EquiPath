from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import match, skill_gap, employer

app = FastAPI(
    title="EquiPath AI Service",
    description="AI/ML microservice for ability-based job matching, skill gap analysis, and employer readiness scoring",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(match.router, tags=["Job Matching"])
app.include_router(skill_gap.router, tags=["Skill Gap Analysis"])
app.include_router(employer.router, tags=["Employer Readiness"])

@app.get("/")
def root():
    return {
        "service": "EquiPath AI Service",
        "version": "1.0.0",
        "endpoints": [
            "POST /match — Ability-based job matching",
            "POST /skill-gap — Skill gap analysis",
            "POST /employer-score — Employer readiness scoring"
        ]
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "equipath-ai"}
