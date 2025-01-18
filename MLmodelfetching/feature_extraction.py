import cv2
import numpy as np
from skimage.feature import local_binary_pattern
from skimage import color
import matplotlib.pyplot as plt

# Function to extract skin tone from the face
def extract_skin_tone(image):
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_skin = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin = np.array([20, 255, 255], dtype=np.uint8)
    skin_mask = cv2.inRange(hsv_image, lower_skin, upper_skin)
    skin_region = cv2.bitwise_and(image, image, mask=skin_mask)
    skin_avg_color = np.mean(skin_region, axis=(0, 1))
    return skin_avg_color

# Function to extract skin texture using Local Binary Patterns (LBP)
def extract_skin_texture(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    lbp = local_binary_pattern(gray_image, P=8, R=1, method='uniform')
    lbp_hist, _ = np.histogram(lbp.ravel(), bins=np.arange(0, 59), range=(0, 58))
    lbp_hist = lbp_hist.astype(np.float32)
    lbp_hist /= (lbp_hist.sum() + 1e-6)
    return lbp_hist

# Function to extract dark circles from the face
def extract_dark_circles(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    for (x, y, w, h) in faces:
        face_region = gray_image[y:y+h, x:x+w]
        eyes = eye_cascade.detectMultiScale(face_region)
        for (ex, ey, ew, eh) in eyes:
            under_eye_region = face_region[ey + eh//2:ey + eh + 20, ex:ex + ew]
            mean_intensity = np.mean(under_eye_region)
            return mean_intensity
    return None





# Main function to extract features from both face and nails
def extract_features(face_image_path):
    face_image = cv2.imread(face_image_path)
    
    if face_image is None:
        print("Error: Face image path is incorrect.")
        return None

    # Extract features from the face image
    skin_tone = extract_skin_tone(face_image)
    skin_texture = extract_skin_texture(face_image)
    dark_circles_intensity = extract_dark_circles(face_image)

    # Return features as a dictionary
    return {
        'skin_tone': skin_tone,
        'skin_texture': skin_texture,
        'dark_circles': dark_circles_intensity
    }