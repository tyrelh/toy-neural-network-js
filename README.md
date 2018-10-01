# Toy Neural Network JS Library

This is a basic JavaScript neural network library. It can be trained in the browser and the resulting network can be saved to JSON for later deployment. It utelized a scratch-written matrix math class mostly for learning purposes and is by no means effiecient or fast.

## Usage

A network can be initialized by creating a new *NeuralNetwork* object with 3 parameters: number of input nodes, hidden nodes, and output nodes.
```js
brain = new NeuralNetwork(784, 64, 4);
```
The network can be trained using the *train()* function and passing it an array of input values and the label (also passed as an array with one-hot). The input values should be normalized to the range 0-1.
```js
inputs = [0.23512, 0.8982053, ..., 0.123452];
target = [0, 0, 1, 0];
brain.train(inputs, target);
```
This training should be done many times. I found it best to pass all of the training data, randomize the order of the training data, and then pass it again. Around 5 of these epochs seemed to yeild good results.

After training, a prediction can be made on new data using the *predict()* function.
```js
let prediction = brain.predict(input);
```
This will return an array of values between 0 and 1 corresponding to the labels. The highest value corresponds to the highest likely class given that input.

## Saving and Using a Trained Network

Once trained, the network can be exported to JSON using the *serialize()* function. I belive this will trigger a download prompt in most browsers to save the JSON file.
```js
brain.serialize();
```
Later on when you would like to utilize this saved network, simply load the JSON file in your preload, and in your setup call the static function *deserialize()* passing the JSON.
```js
let brain = NeuralNetwork.deserialize(nn_json_object);
```

## Future of Project

The main thing I would like to do next with this library is encorporate cpu/gpu parallelization for the matrix math. This would increase training performance greatly. Currently training performance is prohibitively poor. Encorporating a small library like [gpu.js](https://github.com/gpujs/gpu.js) would be interesting and a great way to boost performance.

I would like to learn more about encorporating convolutional layers into the network for using images as input.

Any questions or comments send them my way!