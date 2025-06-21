from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

model = pickle.load(open('models/model.pkl', 'rb'))
features = pickle.load(open('models/features.pkl', 'rb'))

@app.route('/')
def fraud():
    return render_template('fraud.html')

@app.route('/recommend.html')
def recommend():
    return render_template('recommend.html')

@app.route('/predict_fraud', methods=['POST'])
def predict_fraud():
    data = request.get_json()
    try:
        input_data = [data.get(f, 0) for f in features]
        input_array = np.array(input_data).reshape(1, -1)
        prediction = model.predict(input_array)[0]
        probability = model.predict_proba(input_array)[0][1]
        return jsonify({
            "fraud_prediction": "Fraudulent" if prediction else "Legit",
            "confidence": round(probability * 100, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)
