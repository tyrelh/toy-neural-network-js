/*
 * Toy Neural Network in JS
 * Tyrel Hiebert
 * 
 * Inspiration and guidence from
 * Daniel Shiffman
 * thecodingtrain.com
 * natureofcode.com
 * github.com/CodingTrain/
 * youtube.com/user/shiffman
 */

class NeuralNetwork {

    constructor(input_nodes, hidden_nodes, output_nodes) {

        // copy nn if passed reference
        if (input_nodes instanceof NeuralNetwork) {

            let nn_parent = input_nodes;

            // copy number of neurons
            this.input_nodes = nn_parent.input_nodes;
            this.hidden_nodes = nn_parent.hidden_nodes;
            this.output_nodes = nn_parent.output_nodes;

            // copy weights
            this.weights_ih = nn_parent.weights_ih.copy();
            this.weights_ho = nn_parent.weights_ho.copy();

            // copy biases
            this.bias_h = nn_parent.bias_h.copy();
            this.bias_o = nn_parent.bias_o.copy();

            // copy learning rate
            this.learning_rate = nn_parent.learning_rate;
        }

        // create new neural network if passed size params
        else {

            // initialize number of neurons
            this.input_nodes = input_nodes;
            this.hidden_nodes = hidden_nodes;
            this.output_nodes = output_nodes;

            // initialize weights
            this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
            this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
            this.weights_ih.randomize();
            this.weights_ho.randomize();

            // initialize biases
            this.bias_h = new Matrix(this.hidden_nodes, 1);
            this.bias_o = new Matrix(this.output_nodes, 1);
            this.bias_h.randomize();
            this.bias_o.randomize();

            // initialize learning rate
            this.learning_rate = 0.15;
        }
    }


    predict(input_arr) {

        // generate hidden outputs
        let inputs = Matrix.fromArray(input_arr);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        // add bias at hidden layer
        hidden.add(this.bias_h);
        // activation function
        hidden.map(sigmoid);

        // generate output
        let output = Matrix.multiply(this.weights_ho, hidden);
        // add bias at output layer
        output.add(this.bias_o);
        // activation function
        output.map(sigmoid);

        return output.toArray();
    }

    // recieve and input and target output
    train(input_arr, target_arr) {

        // generate hidden outputs
        let inputs = Matrix.fromArray(input_arr);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        // add bias
        hidden.add(this.bias_h);
        // activation function
        hidden.map(sigmoid);

        // generate output
        let outputs = Matrix.multiply(this.weights_ho, hidden);
        // add bias
        outputs.add(this.bias_o);
        // activation function
        outputs.map(sigmoid);

        // convert targets to Matrix object
        let targets = Matrix.fromArray(target_arr);

        // calculate output error
        // error = targets - outputs
        let output_errors = Matrix.subtract(targets, outputs);
        // calculate gradient
        let gradients = Matrix.map(outputs, dSigmoid);
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);
        // calculate deltas
        let hidden_t = Matrix.transpose(hidden);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_t);
        // change output weights by output deltas
        this.weights_ho.add(weight_ho_deltas);
        // change output bias by gradients
        this.bias_o.add(gradients);

        // calculate hidden error
        let weights_ho_t = Matrix.transpose(this.weights_ho);
        let hidden_errors = Matrix.multiply(weights_ho_t, output_errors);
        // calculate hidden gradient
        let hidden_gradients = Matrix.map(hidden, dSigmoid);
        hidden_gradients.multiply(hidden_errors);
        hidden_gradients.multiply(this.learning_rate);
        // calculate hidden deltas
        let inputs_t = Matrix.transpose(inputs);
        let weight_ih_deltas = Matrix.multiply(hidden_gradients, inputs_t);
        // change hidden weights by hidden deltas
        this.weights_ih.add(weight_ih_deltas);
        // change hidden bias by hidden gradients
        this.bias_h.add(hidden_gradients);
    }

    setLearningRate(r) {
        this.learning_rate = r;
    }

    // turn this.nn object into JSON
    serialize() {
        return JSON.stringify(this);
    }

    // turn a saved NeuralNetwork JSON into a new NeuralNetwork object
    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
        nn.weights_ih = Matrix.deserialize(data.weights_ih);
        nn.weights_h0 = Matrix.deserialize(data.weights_ho);
        nn.bias_h = Matrix.deserialize(data.bias_h);
        nn.bias_o = Matrix.deserialize(data.bias_o);
        nn.setLearningRate(data.learning_rate);
        return nn;
    }

    // NEUROEVOLUTION FUNCTIONS

    // copy this nn
    copy() {
        return new NeuralNetwork(this);
    }

    // mutate this nn by given rate 0 < rate < 1;
    mutate(rate) {

        // function to mutate each value by
        function mutate_fn(val) {
            let x = Math.random();
            if (x < rate) {
                return x * 2 - 1;
            }
            return val;
        }
        // mutate weights
        this.weights_ih.map(mutate_fn);
        this.weights_ih.map(mutate_fn);
        // mutate biases
        this.bias_h.map(mutate_fn);
        this.bias_o.map(mutate_fn);
    }

}


// HELPER FUNCTIONS

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dSigmoid(y) {
    // return sigmoid(x) * (1 - sigmoid(x));
    // y already has sigmoid applied
    return y * (1 - y);
}