from fastapi import FastAPI
from routers.upload_router import router as upload_router
from routers.qa_router import router as qa_router
from routers.summary_router import router as summary_router

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AI Document Intelligence Backend Running"}

app.include_router(upload_router)
app.include_router(qa_router)
app.include_router(summary_router)