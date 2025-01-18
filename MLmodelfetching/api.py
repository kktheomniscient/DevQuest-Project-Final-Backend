from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Import Flask-CORS
from feature_extraction import extract_features
from ayurvedic_integration import map_to_ayurvedic_principles

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Default nail region (standard value)
DEFAULT_NAIL_REGION = (10, 20, 50, 60)  # Example coordinates [x1, y1, x2, y2]

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Parse JSON payload
        data = request.json
        face_image_path = data.get('./pics')
        nail_image_path = data.get('./pics')

        if not (face_image_path and nail_image_path):
            return jsonify({"error": "Invalid input. Please provide both face and nail image paths."}), 400

        # Use the default nail region
        nail_region = DEFAULT_NAIL_REGION

        # Extract features
        features = extract_features(face_image_path, nail_image_path, nail_region)
        if features is None:
            return jsonify({"error": "Error extracting features. Check image paths and nail region."}), 400

        # Map features to Ayurvedic recommendations
        recommendations = map_to_ayurvedic_principles(features)

        # Return recommendations as JSON
        return jsonify({"recommendations": recommendations})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
