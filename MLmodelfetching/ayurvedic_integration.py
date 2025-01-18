import numpy as np  # Ensure numpy is imported

# Function to map extracted features to Ayurvedic dosha imbalances and suggestions
def map_to_ayurvedic_principles(features):
    recommendations = []
    
    # *Skin Tone*
    # Pitta imbalance may cause hyperpigmentation or redness
    if features is not None and features.get('skin_tone') is not None and features['skin_tone'][0] > 150:# Hypothetical threshold for Pitta imbalance (reddish skin tone)
        recommendations.append({
            "feature": "Skin Tone",
            "imbalance": "Pitta",
            "explanation": "Pitta imbalance can lead to redness, inflammation, and pigmentation issues.",
            "suggestion": "Use cooling, soothing herbs like aloe vera and sandalwood. Reduce spicy, oily foods and excess heat. Opt for a cooling lifestyle and practices."
        })
    
    # *Skin Texture*
    # Dry and flaky skin is commonly associated with Vata imbalance
    if features is not None and features.get('skin_texture') is not None:
        if np.sum(features['skin_texture']) > 0.3:  # Hypothetical threshold for dry, flaky skin (Vata imbalance)
            recommendations.append({
                "feature": "Skin Texture",
                "imbalance": "Vata",
                "explanation": "Vata imbalance often leads to dry, flaky, or rough skin. It is essential to restore moisture and warmth.",
                "suggestion": "Apply warm oil massage, preferably with sesame or coconut oil. Drink warm herbal teas and consume moist, grounding foods like soups and stews."
            })
    
    # *Dark Circles*
    # Dark circles can indicate both Vata (due to lack of sleep, stress) and Kapha imbalances (due to stagnation)
    if features is not None and features.get('dark_circles') is not None:
        if features['dark_circles'] < 120:  # Darker circles might indicate Vata imbalance (dryness, stress, lack of sleep)
            recommendations.append({
                "feature": "Dark Circles",
                "imbalance": "Vata",
                "explanation": "Vata imbalances may cause under-eye dryness and stress, leading to dark circles.",
                "suggestion": "Ensure proper rest, hydration, and calming activities. Apply cooling eye masks with cucumber or rose water. Avoid stress-inducing activities."
            })
        else:  # Lighter circles might indicate Kapha imbalance (fluid retention, sluggishness)
            recommendations.append({
                "feature": "Dark Circles",
                "imbalance": "Kapha",
                "explanation": "Kapha imbalances may cause sluggish circulation and fluid retention, leading to puffiness and dark circles.",
                "suggestion": "Increase movement and physical activity. Reduce dairy and salty foods. Try herbal remedies such as Triphala to promote circulation."
            })
    
    # *Nail Color*
    # Pale nails could be a sign of Vata or even a Pitta imbalance (Pitta governs color and pigmentation)
    # if features['nail_color'][0] < 120:  # Pale nails might indicate Vata imbalance (cold, dry qualities)
    #     recommendations.append({
    #         "feature": "Nail Color",
    #         "imbalance": "Vata",
    #         "explanation": "Pale or discolored nails are often associated with Vata imbalances, which cause dryness and poor circulation.",
    #         "suggestion": "Increase iron-rich foods like spinach, lentils, and sesame seeds. Regular oil massage on nails can also enhance circulation. Consider using Triphala or Ashwagandha to balance Vata."
    #     })
    
    # *Nail Texture*
    # Brittle nails are often linked to Vata imbalances, which cause dryness and fragility
    # if np.sum(features['nail_texture']) > 0.3:  # Hypothetical threshold for brittle nails (Vata imbalance)
    #     recommendations.append({
    #         "feature": "Nail Texture",
    #         "imbalance": "Vata",
    #         "explanation": "Brittle nails are a common sign of Vata imbalances, as the dosha causes fragility and dryness.",
    #         "suggestion": "Apply warm oils like almond or sesame oil to the nails regularly. Incorporate more healthy fats (avocados, ghee) and drink warm liquids to nourish the body."
    #     })
    
    return recommendations