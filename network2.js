class NeuralNetwork2 {
    constructor(inputSize, hiddenSize, outputSize) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        
        // Initialize weights and biases
        this.weightsInputHidden = this.initializeWeights(inputSize, hiddenSize);
        this.weightsHiddenOutput = this.initializeWeights(hiddenSize, outputSize);
        
        this.biasHidden = this.initializeBiases(hiddenSize);
        this.biasOutput = this.initializeBiases(outputSize);
    }
    
    initializeWeights(rows, cols) {
        const weights = [];
        for (let i = 0; i < rows; i++) {
            weights[i] = [];
            for (let j = 0; j < cols; j++) {
                weights[i][j] = Math.random() - 0.5; // Initialize with random values between -0.5 and 0.5
            }
        }
        return weights;
    }
    
    initializeBiases(size) {
        const biases = [];
        for (let i = 0; i < size; i++) {
            biases[i] = Math.random() - 0.5; // Initialize with random values between -0.5 and 0.5
        }
        return biases;
    }

    feedForward(input) {
        // Calculate hidden layer values
        const hiddenLayer = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputSize; j++) {
                sum += input[j] * this.weightsInputHidden[j][i];
            }
            sum += this.biasHidden[i];
            hiddenLayer[i] = this.sigmoid(sum);
        }

        // Calculate output layer values
        const outputLayer = [];
        for (let i = 0; i < this.outputSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenSize; j++) {
                sum += hiddenLayer[j] * this.weightsHiddenOutput[j][i];
            }
            sum += this.biasOutput[i];
            outputLayer[i] = this.sigmoid(sum);
        }

        return outputLayer;
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    train(inputs, targets, learningRate) {
        // Feed forward
        const output = this.feedForward(inputs);

        // Calculate output layer errors
        const outputErrors = [];
        for (let i = 0; i < this.outputSize; i++) {
            outputErrors[i] = targets[i] - output[i];
        }

        // Calculate output layer gradients
        const outputGradients = [];
        for (let i = 0; i < this.outputSize; i++) {
            outputGradients[i] = outputErrors[i] * this.sigmoidDerivative(output[i]);
        }

        // Adjust output layer weights and biases
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weightsHiddenOutput[i][j] += learningRate * outputGradients[j] * this.sigmoid(hiddenLayer[i]);
            }
        }
        for (let i = 0; i < this.outputSize; i++) {
            this.biasOutput[i] += learningRate * outputGradients[i];
        }

        // Calculate hidden layer errors
        const hiddenErrors = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let error = 0;
            for (let j = 0; j < this.outputSize; j++) {
                error += outputGradients[j] * this.weightsHiddenOutput[i][j];
            }
            hiddenErrors[i] = error;
        }

        // Calculate hidden layer gradients
        const hiddenGradients = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            hiddenGradients[i] = hiddenErrors[i] * this.sigmoidDerivative(hiddenLayer[i]);
        }

        // Adjust hidden layer weights and biases
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.hiddenSize; j++) {
                this.weightsInputHidden[i][j] += learningRate * hiddenGradients[j] * inputs[i];
            }
        }
        for (let i = 0; i < this.hiddenSize; i++) {
            this.biasHidden[i] += learningRate * hiddenGradients[i];
        }
    }

    sigmoidDerivative(x) {
        const sigmoidX = this.sigmoid(x);
        return sigmoidX * (1 - sigmoidX);
    }
}
