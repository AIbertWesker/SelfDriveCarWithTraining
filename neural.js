class Neural {
    constructor(inputSize, hiddenSize, outputSize) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.hiddenLayer = [];
        
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
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputSize; j++) {
                sum += input[j] * this.weightsInputHidden[j][i];
            }
            sum += this.biasHidden[i];
            this.hiddenLayer[i] = this.bipolar(sum);
        }

        // Calculate output layer values
        const outputLayer = [];
        for (let i = 0; i < this.outputSize; i++) {
            let sum = 0;
            for (let j = 0; j < this.hiddenSize; j++) {
                sum += this.hiddenLayer[j] * this.weightsHiddenOutput[j][i];
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

    train() {
        const dataset = [
            [0, 0, 0, 0, 0, 0],
            [0.5, 0, 0, 0, 0.5, 0],
            [0.7, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0.7, -1],
            [0.5, 0, 0, 0, 0.5, 0],
            [0.5, 0, 0, 0, 0.5, 0],
            [0, 0, 0.7, 0, 0, -1],
            [0, 0.4, 0.5, 0, 0, 1],
            [0, 0, 0, 0.5, 0, -1],
            [0, 0, 0, 0.5, 0.4, -1],
            [0.5, 0, 0.7, 0, 0, 1],
            [0, 0, 0.7, 0, 0.5, -1],
            [0, 0.4, 0, 0.4, 0, 0],
            [0, 0.4, 0, 0.4, 0.4, 0],
            [0, 0.5, 0, 0.2, 0.5, 0],
            [0.5, 0.2, 0, 0.2, 0, 0],
            [0, 0.1, 0.4, 0.1, 0.4, -1],
            [0.4, 0.1, 0.4, 0.1, 0, 1],
            [0.3, 0.4, 0.5, 0.3, 0, 1],
            [0, 0.3, 0.5, 0.4, 0.3, -1],

        ];

        const epoch = 100000; //powtorzenia
        for (let i = 0; i < epoch; i++) {
            const losowanko = Math.floor(Math.random() * dataset.length);
            const input = dataset[losowanko].slice(0, 5); //losowanie inputu z datasetu
            const target = dataset[losowanko].slice(5, ); // ten target  z datasetu
            const output = this.feedForward(input);
            const outputError = this.calculateOutputError(output, target);
            const hiddenError = this.calculateHiddenError(outputError);
    
            this.updateWeightsAndBiases(0.1, outputError, hiddenError, output, input);
        }
    }

    calculateOutputError(output, target) {  //δ
        const outputError = [];
        for (let i = 0; i < this.outputSize; i++) {
            outputError[i] = (target[0] - output[i])*this.bipolarSigmoidDerivative(output[i]); 
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
            hiddenError[i] = this.bipolarSigmoidDerivative(this.hiddenLayer[i]) * sum;
        }
        return hiddenError;
    }

    updateWeightsAndBiases(learningRate, outputError, hiddenError, output, input) {
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weightsHiddenOutput[i][j] += learningRate * outputError[j] * this.bipolarSigmoidDerivative(output[j]) * this.hiddenLayer[i];
            } 
        }

        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.hiddenSize; j++) {
                this.weightsInputHidden[i][j] += learningRate * hiddenError[j] * this.bipolarSigmoidDerivative(this.hiddenLayer[j]) * input[i];
            }
        }

        for (let i = 0; i < this.outputSize; i++) {
            this.biasOutput[i] += learningRate * outputError[i] * this.bipolarSigmoidDerivative(output[i]);
        }

        for (let i = 0; i < this.hiddenSize; i++) {
            this.biasHidden[i] += learningRate * hiddenError[i] * this.bipolarSigmoidDerivative(this.hiddenLayer[i]);
        }

    }
}

const neuralObject = new Neural(5, 2, 1); // Create random neural network for getter

function getNeuralObject() {
    return neuralObject;
}

const input = [0.2, 0.4, 0.7, 0, 0];

console.log("Wylosowanie wagi schowane: "+neuralObject.weightsInputHidden);
console.log("Wylosowanie wagi wyjsciowe: "+neuralObject.weightsHiddenOutput);
console.log("Wylosowanie bias schowane: "+neuralObject.biasHidden);
console.log("Wylosowanie bias wyjsciowe: "+neuralObject.biasOutput);
output = neuralObject.feedForward(input);
console.log("Warstwa ukryta: "+neuralObject.hiddenLayer);
console.log("Output: "+output);

// const dataset = [
//     [0, 0, 0, 0, 0, 1],
//     [1, 1, 0, 1, 0, 0],
//     [1, 1, 1, 0, 0, 1]
// ];

// console.log("Error warstwy wyjsciowej: "+neuralObject.calculateOutputError(output, dataset[0]));
// chuj = neuralObject.calculateOutputError(output, dataset[0]);
// fiut = neuralObject.calculateHiddenError(chuj);
// console.log("Error warstwy ukrytej: "+fiut);
// neuralObject.updateWeightsAndBiases(0.1, chuj, fiut, output, input);

// console.log("Nowe wagi schowane: "+neuralObject.weightsInputHidden);
// console.log("Nowe wagi wyjsciowe: "+neuralObject.weightsHiddenOutput);
// console.log("Nowe bias schowane: "+neuralObject.biasHidden);
// console.log("Nowe bias wyjsciowe: "+neuralObject.biasOutput);
// output = neuralObject.feedForward(input);
// console.log("Warstwa ukryta: "+neuralObject.hiddenLayer);
// console.log("Output: "+output);


function train() {
    neuralObject.train();
}

console.log("Nowe wagi schowane: "+neuralObject.weightsInputHidden);
console.log("Nowe wagi wyjsciowe: "+neuralObject.weightsHiddenOutput);
console.log("Nowe bias schowane: "+neuralObject.biasHidden);
console.log("Nowe bias wyjsciowe: "+neuralObject.biasOutput);
console.log("Warstwa ukryta: "+neuralObject.hiddenLayer);
output = neuralObject.feedForward(input);
console.log("Output: "+output);