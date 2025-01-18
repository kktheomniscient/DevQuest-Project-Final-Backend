from feature_extraction import extract_features
from ayurvedic_integration import map_to_ayurvedic_principles

def main():
    face_image_path = input("Enter the path to the face image: ")
    nail_image_path = input("Enter the path to the nail image: ")
    
    # Ask for nail region (x1, y1, x2, y2) coordinates
    nail_region = tuple(map(int, input("Enter the nail region (x1, y1, x2, y2) as comma-separated values: ").split(',')))
    
    # Extract features from both face and nails
    features = extract_features(face_image_path, nail_image_path, nail_region)
    
    if features is None:
        return
    
    # Map the extracted features to Ayurvedic principles and get recommendations
    ayurvedic_recommendations = map_to_ayurvedic_principles(features)
    
    # Print recommendations
    for rec in ayurvedic_recommendations:
        print(f"Feature: {rec['feature']}")
        print(f"Imbalance: {rec['imbalance']}")
        print(f"Suggestion: {rec['suggestion']}")
        print()

if __name__ == "__main__":
    main()
