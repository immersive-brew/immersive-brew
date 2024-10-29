from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Load the saved Random Forest model
model = joblib.load('coffee_rf_classifier_model.pkl')

# Define the data structure for user preferences
class CoffeeData(BaseModel):
    moisture_percentage: float
    altitude: float
    country_encoded: int
    aroma: float
    flavor: float
    aftertaste: float
    acidity: float
    body: float
    balance: float
    sweetness: float

# Initialize FastAPI app
app = FastAPI()

# Define a helper function to calculate similarity between user preferences and coffee profile
def calculate_similarity(user_prefs, coffee_profile):
    user_vector = np.array(list(user_prefs.values())).reshape(1, -1)
    coffee_vector = np.array(coffee_profile).reshape(1, -1)
    return cosine_similarity(user_vector, coffee_vector)[0][0]

# Endpoint for quality prediction based on coffee attributes
@app.post("/predict/")
async def predict_quality(data: CoffeeData):
    features = np.array([[data.moisture_percentage, data.altitude, data.country_encoded, 
                          data.aroma, data.flavor, data.aftertaste, data.acidity, 
                          data.body, data.balance, data.sweetness]])
    prediction = model.predict(features)
    return {"quality": prediction[0]}

# Endpoint for personalized recommendations based on user preferences
@app.post("/recommend/")
async def recommend_coffees(user_prefs: dict):
    coffee_data = [
        {"id": 1, "aroma": 8.0, "flavor": 7.5, "acidity": 6.0, "body": 7.0, "sweetness": 8.0, "moisture_percentage": 12.0, "altitude": 1500, "country_encoded": 1},
        # Add additional coffee profiles here
    ]

    recommendations = []
    for coffee in coffee_data:
        coffee_features = np.array([[coffee["moisture_percentage"], coffee["altitude"], coffee["country_encoded"], coffee["aroma"], coffee["flavor"], coffee["aftertaste"], coffee["acidity"], coffee["body"], coffee["balance"], coffee["sweetness"]]])
        quality = model.predict(coffee_features)
        
        if quality == "High Quality":
            coffee_vector = [coffee["aroma"], coffee["flavor"], coffee["acidity"], coffee["body"], coffee["sweetness"]]
            similarity = calculate_similarity(user_prefs, coffee_vector)
            recommendations.append({"coffee_id": coffee["id"], "similarity_score": similarity})
    
    recommendations.sort(key=lambda x: x["similarity_score"], reverse=True)
    return {"recommendations": recommendations[:5]}  # Return top 5 recommendations