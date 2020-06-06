
class Bird {
  constructor(brain) {
    // position and size of bird
    this.x = 32;
    this.y = height / 2;
    this.r = 8;

    // Gravity, lift and velocity
    this.gravity = .8;
    this.lift = -2;
    this.velocity = 0;

    // Is this a copy of another Bird or a new one?
    // The Neural Network is the bird's "brain"
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutateWeight);
    } else {
      this.brain = new NeuralNetwork();
    }

    // Score is how many frames it's been alive
    this.score = 0;
    // Fitness is normalized version of score
    this.fitness = 0;
  }

  // Create a copy of this bird
  copy() {
    return new Bird(this.brain);
  }

  dispose() {
    this.brain.dispose();
  }

  // Display the bird
  show() {
    fill(255, 100);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  save() {
    this.brain.save();
  }

  // This is the key function now that decides
  // if it should jump or not jump!
  think(pipes) {
    // First find the closest pipe
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // Now create the inputs to the neural network
      let inputs = [];
      // x position of closest pipe
      inputs[0] = map(closest.x, this.x, width, 0, 1);
      // top of closest pipe opening
      inputs[1] = map(closest.top, 0, height, 0, 1);
      // bottom of closest pipe opening
      inputs[2] = map(closest.bottom, 0, height, 0, 1);
      // bird's y position
      inputs[3] = map(this.y, 0, height, 0, 1);
      // bird's y velocity
      inputs[4] = map(this.velocity, -5, 5, 0, 1);

      // Get the outputs from the network
      let action = this.brain.predict(inputs);
      // Decide to jump or not!
      if (action[1] > action[0]) {
        this.up();
      }
    }
  }

  // Jump up
  up() {
    this.velocity += this.lift;
  }

  bottomTop() {
    // Bird dies when hits bottom?
    return this.y > height || this.y < 0;
  }

  // Update bird's position based on velocity, gravity, etc.
  update() {
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;

    // Every frame it is alive increases the score
    this.score++;
  }
}
