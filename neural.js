class Neural {
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
                weights[i][j] = Math.random() * 2 - 1; // Initialize with random values -1 to 1
            }
        }
        return weights;
    }
    
    initializeBiases(size) {
        const biases = [];
        for (let i = 0; i < size; i++) {
            biases[i] = Math.random() * 2 - 1; // Initialize with random values 
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

    train(input, target) {
        const output = this.feedForward(input);
        const outputError = this.calculateOutputError(output, target);
        const hiddenError = this.calculateHiddenError(outputError);

        this.updateWeightsAndBiases(input, output, outputError, hiddenError);
    }

    calculateOutputError(output, target) {
        const outputError = [];
        for (let i = 0; i < this.outputSize; i++) {
            outputError[i] = output[i] * (1 - output[i]) * (target[i] - output[i]);
        }
        return outputError;
    }

    calculateHiddenError(outputError) {
        const hiddenError = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.outputSize; j++) {
                sum += outputError[j] * this.weightsHiddenOutput[i][j];
            }
            hiddenError[i] = this.feedForwardSigmoidDerivative(i) * sum;
        }
        return hiddenError;
    }

    updateWeightsAndBiases(input, output, outputError, hiddenError) {
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weightsHiddenOutput[i][j] += outputError[j] * this.feedForwardSigmoid(i) * this.learningRate;
            }
        }

        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.hiddenSize; j++) {
                this.weightsInputHidden[i][j] += hiddenError[j] * input[i] * this.learningRate;
            }
        }

        for (let i = 0; i < this.outputSize; i++) {
            this.biasOutput[i] += outputError[i] * this.learningRate;
        }

        for (let i = 0; i < this.hiddenSize; i++) {
            this.biasHidden[i] += hiddenError[i] * this.learningRate;
        }
    }

    feedForwardSigmoidDerivative(index) {
        const output = this.feedForwardSigmoid(index);
        return output * (1 - output);
    }

    feedForwardSigmoid(index) {
        return 1 / (1 + Math.exp(-index));
    }
}

const neuralObject = new Neural(5, 2, 1); // Create random neural network for getter

function getNeuralObject() {
    return neuralObject;
}

const input = [0, 0, 0, 0, 0];
output = neuralObject.feedForward(input);
console.log(output);

const dataset = [
    { input: [0, 0, 0, 0, 0], output: [0] },
    { input: [1, 0, 1, 0, 1], output: [1] },
    { input: [1, 1, 0, 1, 0], output: [1] },
    { input: [0, 1, 1, 0, 1], output: [0] },
    { input: [1, 1, 1, 1, 1], output: [1] }
];

const learningRate = 0.1;

for (let i = 0; i < dataset.length; i++) {
    const data = dataset[i];
    neuralObject.train(data.input, data.output);
}

output = neuralObject.feedForward(input);
console.log(output);