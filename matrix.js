/*
 * Matrix class
 * Tyrel Hiebert
 * 
 * Inspiration and guidence from
 * Daniel Shiffman
 * thecodingtrain.com
 * natureofcode.com
 * github.com/CodingTrain/
 * youtube.com/user/shiffman
 */

class Matrix {

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        // this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        // initialize matrix to all zeros
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.cols; j++) {
                // maybe initialize to 1?
                this.data[i][j] = 0;
            }
        }
    }

    static subtract(a, b) {
        // CHECK SIZES OF MATRICES, ERROR IF WRONG
        let result = new Matrix(a.rows, a.cols);
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                result.data[i][j] = a.data[i][j] - b.data[i][j];
            }
        }
        return result;
    }

    add(n) {
        // matrix addition
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n.data[i][j];
                }
            }
        }
        // scalar addition
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] += n;
                }
            }
        }
    }

    // transpose a given Matrix object
    static transpose(m) {
        let result = new Matrix(m.cols, m.rows);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                result.data[j][i] = m.data[i][j];
            }
        }
        return result;
    }

    // transpose this Matrix object
    transpose() {
        let result = new Matrix(this.cols, this.rows);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                result.data[j][i] = this.data[i][j];
            }
        }
        return result;
    }

    // matrix product
    static multiply(a, b) {
        if (a.cols !== b.rows) {
            console.log("Columns of A must match rows of B.");
            return undefined;
        }
        let result = new Matrix(a.rows, b.cols);
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                let sum = 0;
                for (let k = 0; k < b.rows; k++) {
                    sum += a.data[i][k] * b.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }
        return result;
    }

    // multiplication
    multiply(n) {
        // hadamard product
        if (n instanceof Matrix) {
            // CHECK SIZES OF MATRICES, ERROR IF WRONG
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n.data[i][j];
                }
            }
        }
        // scalar product
        else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= n;
                }
            }
        }
    }

    // convert a given array to an equivalent Matrix object
    static fromArray(arr) {
        let m = new Matrix(arr.length, 1);
        for (let i = 0; i < arr.length; i++) {
            m.data[i][0] = arr[i];
        }
        return m;
    }

    // flatten and return a Matrix object's data as an array
    toArray() {
        let arr = [];
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                arr.push(this.data[j][i]);
            }
        }
        return arr;
    }

    // apply fn to every element of given matrix and return resulting matrix
    static map(m, fn) {
        let result = new Matrix(m.rows, m.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                result.data[i][j] = fn(m.data[i][j]);
            }
        }
        return result;
    }

    // apply fn to every element of matrix
    map(fn) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = fn(this.data[i][j]);
            }
        }
    }

    // copy this Matrix
    copy() {
        let m = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                m.data[i][j] = this.data[i][j];
            }
        }
        return m;
    }

    // convert this Matrix object to JSON
    serialize() {
        return JSON.stringify(this);
    }

    // create a new Matrix object from JSON
    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let matrix = new Matrix(data.rows, data.cols);
        matrix.data = data.data;
        return matrix;
    }

    // debugging functions
    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }
    log() {
        console.table(this.data);
    }
}