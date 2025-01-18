import os
from feature_extraction import extract_features
from ayurvedic_integration import map_to_ayurvedic_principles

# face_image_path = os.path.abspath('../pics/pic_mid.png')
face_image_path = 'C:\\Users\\Aspire\\Desktop\\my_code\\devquest_full\\backend\\pics\\pic_mid.png'

features = extract_features(face_image_path)

# Map the extracted features to Ayurvedic principles and get recommendations
ayurvedic_recommendations = map_to_ayurvedic_principles(features)

# Print recommendations
for rec in ayurvedic_recommendations:
    print(f"Feature: {rec['feature']}")
    print(f"Imbalance: {rec['imbalance']}")
    print(f"Suggestion: {rec['suggestion']}")
    # print("Features dictionary:", features)