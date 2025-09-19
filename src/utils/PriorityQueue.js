export default class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(solicitud) {
    this.queue.push(solicitud);
    this.queue.sort((a, b) => {
      if (b.prioridad === a.prioridad) {
        return a.timestamp - b.timestamp;
      }
      return b.prioridad - a.prioridad;
    });
  }

  dequeue() {
    return this.queue.shift();
  }
}
