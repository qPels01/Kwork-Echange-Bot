from fastapi import FastAPI, Body

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/projects")
async def create_order(order: str = Body(media_type="text/plain")):
    print(order)
    
    return {
        "status": 200,
    }