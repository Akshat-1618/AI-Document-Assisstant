from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.upload_router import router as upload_router
from routers.qa_router import router as qa_router
from routers.summary_router import router as summary_router
from routers.planner_router import router as planner_router

from routers.lecture_planner_router import router as lecture_router
from routers.lab_planner_router import router as lab_router



app = FastAPI()


# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "AI Document Intelligence Backend Running"}


app.include_router(upload_router)
app.include_router(qa_router)
app.include_router(summary_router)
app.include_router(planner_router)
app.include_router(lecture_router)
app.include_router(lab_router)