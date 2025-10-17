class IrisClassifier {
    constructor() {
        this.apiUrl = '/predict';
        this.history = JSON.parse(localStorage.getItem('predictionHistory')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadHistory();
    }

    bindEvents() {
        const form = document.getElementById('prediction-form');
        const sampleButtons = document.querySelectorAll('.sample-btn');
        
        form.addEventListener('submit', (e) => this.handlePrediction(e));
        
        sampleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.loadSample(e));
        });
    }

    loadSample(event) {
        const sampleType = event.target.dataset.sample;
        const samples = {
            setosa: [5.1, 3.5, 1.4, 0.2],
            versicolor: [6.0, 2.7, 5.1, 1.6],
            virginica: [6.3, 3.3, 6.0, 2.5]
        };

        const sample = samples[sampleType];
        document.getElementById('sepal-length').value = sample[0];
        document.getElementById('sepal-width').value = sample[1];
        document.getElementById('petal-length').value = sample[2];
        document.getElementById('petal-width').value = sample[3];
    }

    async handlePrediction(event) {
        event.preventDefault();
        
        const features = this.getInputFeatures();
        if (!features) return;

        this.setLoading(true);
        
        try {
            const prediction = await this.makePrediction(features);
            this.displayResult(features, prediction);
            this.addToHistory(features, prediction);
        } catch (error) {
            this.displayError(error);
        } finally {
            this.setLoading(false);
        }
    }

    getInputFeatures() {
        const features = [
            'sepal-length',
            'sepal-width', 
            'petal-length',
            'petal-width'
        ].map(id => {
            const value = parseFloat(document.getElementById(id).value);
            if (isNaN(value)) {
                alert(`Please enter a valid number for ${id.replace('-', ' ')}`);
                return null;
            }
            return value;
        });

        return features.includes(null) ? null : features;
    }

    async makePrediction(features) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: features
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    displayResult(features, prediction) {
        const resultDiv = document.getElementById('result');
        const species = this.getSpeciesName(prediction.predictions[0]);
        
        resultDiv.innerHTML = `
            <div>
                <h3>Prediction: ${species}</h3>
                <p><strong>Class:</strong> ${prediction.predictions[0]}</p>
                <p><strong>Features:</strong> ${features.join(', ')}</p>
            </div>
        `;
        resultDiv.className = 'result-box success';
    }

    displayError(error) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <div style="color: #dc3545;">
                <h3>Error</h3>
                <p>${error.message}</p>
            </div>
        `;
        resultDiv.className = 'result-box';
    }

    getSpeciesName(classId) {
        const species = {
            0: 'Setosa 🌸',
            1: 'Versicolor 🌺', 
            2: 'Virginica 💮'
        };
        return species[classId] || 'Unknown';
    }

    addToHistory(features, prediction) {
        const historyItem = {
            timestamp: new Date().toLocaleString(),
            features: features,
            prediction: prediction.predictions[0],
            species: this.getSpeciesName(prediction.predictions[0])
        };

        this.history.unshift(historyItem);
        this.history = this.history.slice(0, 10); // Keep last 10 items
        localStorage.setItem('predictionHistory', JSON.stringify(this.history));
        this.loadHistory();
    }

    loadHistory() {
        const historyDiv = document.getElementById('history');
        
        if (this.history.length === 0) {
            historyDiv.innerHTML = '<p>No prediction history yet.</p>';
            return;
        }

        historyDiv.innerHTML = this.history.map(item => `
            <div class="history-item">
                <strong>${item.species}</strong><br>
                <small>Features: [${item.features.join(', ')}]</small><br>
                <small>Time: ${item.timestamp}</small>
            </div>
        `).join('');
    }

    setLoading(loading) {
        const button = document.getElementById('predict-btn');
        const form = document.getElementById('prediction-form');
        
        if (loading) {
            button.innerHTML = 'Predicting...';
            button.disabled = true;
            form.classList.add('loading');
        } else {
            button.innerHTML = 'Predict Species';
            button.disabled = false;
            form.classList.remove('loading');
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new IrisClassifier();
});