class NeuralNetwork {
    constructor(neuronCounts) {                            //liczba neuronów na warstwę
        this.levels = [];                                  //tablice poziomów: 0[wej-ukr] 1[ukr-wyj]  
        for (let i = 0; i < neuronCounts.length-1; i++) {
            this.levels.push(new Level(                    //output poziomu 0 = input poziomu 1
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    static feedForward(givenInputs, network) {             //propagacja w przód
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i]);
        }
        return outputs;
    }


    static mutate(network, amount=1) {                      //algorytm genetyczny
        network.levels.forEach(level => {
            for(let i =0; i<level.biases.length; i++) {
                level.biases[i]=lerp(
                    level.biases[i], 
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0; i<level.weights.length;i++) {
                for(let j=0; j < level.weights[i].length; j++) {
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        })

    static backpropagation(givenInputs, expectedOutputs, network, learningRate) {
        // Perform feed forward to get the outputs
        let outputs = NeuralNetwork.feedForward(givenInputs, network);

        // Calculate the output layer error
        let outputLayer = network.levels[network.levels.length - 1];
        let outputErrors = new Array(outputLayer.outputs.length);
        for (let i = 0; i < outputLayer.outputs.length; i++) {
            outputErrors[i] = expectedOutputs[i] - outputs[i];
        }

        // Update the output layer weights and biases
        for (let i = 0; i < outputLayer.inputs.length; i++) {
            for (let j = 0; j < outputLayer.outputs.length; j++) {
                outputLayer.weights[i][j] += learningRate * outputErrors[j] * outputLayer.inputs[i];
            }
        }
        for (let i = 0; i < outputLayer.biases.length; i++) {
            outputLayer.biases[i] += learningRate * outputErrors[i];
        }

        // Calculate the hidden layer errors and update weights and biases
        for (let l = network.levels.length - 2; l >= 0; l--) {
            let currentLayer = network.levels[l];
            let nextLayer = network.levels[l + 1];

            let errors = new Array(currentLayer.outputs.length);
            for (let i = 0; i < currentLayer.outputs.length; i++) {
                let error = 0;
                for (let j = 0; j < nextLayer.outputs.length; j++) {
                    error += nextLayer.weights[i][j] * outputErrors[j];
                }
                errors[i] = error;
            }

            for (let i = 0; i < currentLayer.inputs.length; i++) {
                for (let j = 0; j < currentLayer.outputs.length; j++) {
                    currentLayer.weights[i][j] += learningRate * errors[j] * currentLayer.inputs[i];
                }
            }
            for (let i = 0; i < currentLayer.biases.length; i++) {
                currentLayer.biases[i] += learningRate * errors[i];
            }

            outputErrors = errors;
        }
    }
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level) {                                  //losowe wagi i odchylenia
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {                    //propagacja w przód
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum > level.biases[i]) {                        //aktywacja (do zmiany)
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
            // Apply bipolar activation
            level.outputs[i] = Math.tanh(sum);
        }
        return level.outputs;
    }
}
