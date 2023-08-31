export interface ILinkedList<T> {
    size: number;
    insertInBegin(data: T): Node<T>;
    insertAtEnd(data: T): Node<T>;
    moveOneSpotUp(data: Node<T>): void;
    moveOneSpotDown(data: Node<T>): void;
    deleteNode(data: Node<T>): void;
    traverseNodes(): T[];
    searchForNode(comparator: (data: T) => boolean): Node<T> | null;
    clear(): void;
};

class Node<T> {
    public next: Node<T> | null = null;
    public prev: Node<T> | null = null;
    constructor(public data: T) { }
};

export class LinkedList<T> implements ILinkedList<T> {
    private head: Node<T> | null = null;
    public size: number = 0;

    public insertInBegin(data: T): Node<T> {
        const node = new Node(data);
        if (!this.head) {
            this.head = node;
        } else {
            node.next = this.head;
            this.head.prev = null;
            this.head = node;
        };

        this.size++;
        return node;
    };

    public insertAtEnd(data: T): Node<T> {
        const node = new Node(data);
        if (!this.head) {
            this.head = node;
        } else {
            let tail = this.head;
            while (tail.next) {
                tail = tail.next;
            };
            tail.next = node;
            node.prev = tail;
        };

        this.size++;
        return node;
    };

    public moveOneSpotUp(data: Node<T>): void {
        const node = this.head;
        while (node) {
            if (node === data) {
                if (node.prev) {
                    const prevNode = node.prev;
                    const prevPrevNode = prevNode.prev;
                    const nextNode = node.next;

                    prevNode.prev = node;
                    prevNode.next = nextNode;
                    node.prev = prevPrevNode;
                    node.next = prevNode;
                    if (prevPrevNode) {
                        prevPrevNode.next = node;
                    };
                    if (nextNode) {
                        nextNode.prev = prevNode;
                    };
                };
                break;
            };
        };
    };

    public moveOneSpotDown(data: Node<T>): void {
        const node = this.head;
        while (node) {
            if (node === data) {
                if (node.next) {
                    const nextNode = node.next;
                    const nextNextNode = nextNode.next;
                    const prevNode = node.prev;

                    nextNode.prev = prevNode;
                    nextNode.next = node;
                    node.prev = nextNode;
                    node.next = nextNextNode;
                    if (prevNode) {
                        prevNode.next = nextNode;
                    };
                    if (nextNextNode) {
                        nextNextNode.prev = node;
                    };
                };
                break;
            };
        };
    };

    public traverseNodes(): T[] {
        const nodes: T[] = [];
        let node = this.head;
        while (node) {
            nodes.push(node.data);
            node = node.next;
        };
        return nodes;
    };

    public searchForNode(comparator: (data: T) => boolean): Node<T> | null {
        let node = this.head;
        while (node) {
            if (comparator(node.data)) {
                return node;
            };
            node = node.next;
        };
        return null;
    };

    public deleteNode(data: Node<T>): void {
        let node = this.head;
        while (node) {
            if (node === data) {
                if (!node.prev) {
                    this.head = node.next;
                } else {
                    node.prev.next = node.next;
                };
                if (node.next) {
                    node.next.prev = node.prev;
                };

                this.size--;
                break;
            };
            node = node.next;
        };
    };

    public clear(): void {
        this.head = null;
        this.size = 0;
    };
};