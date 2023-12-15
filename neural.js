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
            hiddenLayer[i] = this.bipolar(sum);
        }

        // Calculate output layer values
        const outputLayer = [];
        for (let i = 0; i < this.outputSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenSize; j++) {
                sum += hiddenLayer[j] * this.weightsHiddenOutput[j][i];
            }
            sum += this.biasOutput[i];
            outputLayer[i] = this.bipolar(sum);
        }

        return outputLayer;
    }

    bipolar(x) {
        return (2 / (1 + Math.exp(-x))) - 1;
    }

    bipolarSigmoidDerivative(x) { //pochodna jakby co, wzor na discordzie
        const fx = this.bipolar(x);
        return 0.5 * (1 + fx) * (1 - fx);
    }

    train(input, target) {
        const output = this.feedForward(input);
        const outputError = this.calculateOutputError(output, target);
        const hiddenError = this.calculateHiddenError(outputError);

        this.updateWeightsAndBiases(input, output, outputError, hiddenError);
    }

    calculateOutputError(output, target) {  //δ
        const outputError = [];
        for (let i = 0; i < this.outputSize; i++) {
            outputError[i] = (target[5] - output[i])*this.bipolarSigmoidDerivative(output[i]); //te 5 w target to zmienic na cos ludzkiego
        }
        return outputError;
    }
    //tu skonczylem
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

}

const neuralObject = new Neural(5, 2, 1); // Create random neural network for getter

function getNeuralObject() {
    return neuralObject;
}

const input = [0, 0, 0, 0, 0];
output = neuralObject.feedForward(input);
console.log(output);
console.log(neuralObject.weightsInputHidden);
console.log(neuralObject.weightsHiddenOutput);


const dataset = [
    [0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 0, 1]
];

console.log(neuralObject.calculateOutputError(output, dataset[0]));
console.log(dataset[0])

// const learningRate = 0.1;

// for (let i = 0; i < dataset.length; i++) {
//     const data = dataset[i];
//     neuralObject.train(data.input, data.output);
// }

// output = neuralObject.feedForward(input);
// console.log(output);
// trening do wyjebania
// dataset moze byc ale troche do chuja
// NaN value po treningu z chuja