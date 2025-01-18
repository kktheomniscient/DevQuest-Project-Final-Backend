import cv2
import matplotlib.pyplot as plt

def visualize_results(face_image, features):
    # Display the face image with skin mask (highlighting skin regions)
    skin_mask = cv2.inRange(face_image, np.array([0, 20, 70]), np.array([20, 255, 255]))
    skin_region = cv2.bitwise_and(face_image, face_image, mask=skin_mask)
    cv2.imshow("Skin Region", skin_region)
    
    # Add other visualizations as needed, e.g., dark circles, nail regions, etc.
    plt.imshow(face_image)
    plt.title(f"Dark Circles Intensity: {features['dark_circles']}")
    plt.show()
