class Node {
  constructor(element, key) {
    // element would be the bubble component
    this.element = element
    // key is used for react lists
    this.key = key
    this.next = null
  }
}

class BubbleList {
  constructor() {
    this.size = 0
    this.head = null
    this.tail = null
    // previousKey is used to keep track of a serial of key values
    this.previousKey = -1
  }

  get getHead() {
    return this.head
  }

  get getSize() {
    return this.size
  }

  push(element) {
    var newKey = this.previousKey + 1
    this.previousKey = newKey
    var node = new Node(element, newKey)
    if (this.size == 0) {
      this.head = node
      this.tail = node
    }
    else {
      this.tail.next = node
      this.tail = this.tail.next
    }
    this.size += 1
  }

  deleteFront() {
    if (this.size == 0) {}
    else if (this.size == 1) {
      this.head = null
      this.tail = null
      this.size = 0
    }
    else {
      this.head = this.head.next
      this.size -= 1
    }
  }

}

export default BubbleList
