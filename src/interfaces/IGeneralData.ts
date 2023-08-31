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

export class Node<T> {
    public next: Node<T> | null = null;
    public prev: Node<T> | null = null;

    constructor(public data: T) { }
};

export class LinkedList<T> implements ILinkedList<T> {
    private head: Node<T> | null = null;
    public size: number = 0;

    public insertInBegin(data: T): Node<T> {
        /**
         * Insert node in the beginning of the list
         * 
         * @param {T} data - data to insert
         */
        const node: Node<T> | null = new Node(data);

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
        /**
         * Insert node at the end of the list
         * 
         * @param {T} data - data to insert
         */
        const node: Node<T> | null = new Node(data);

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
        /**
         * Move node one spot up in the list
         * 
         * @param {Node<T>} data - node to move
         */
        let node: Node<T> | null = this.head;

        while (node) {
            if (node === data) {
                if (node.prev) {
                    const prevNode: Node<T> = node.prev;
                    const prevPrevNode: Node<T> | null = prevNode.prev;
                    const nextNode: Node<T> | null = node.next;

                    prevNode.prev = node;
                    prevNode.next = nextNode;
                    node.prev = prevPrevNode;
                    node.next = prevNode;

                    if (prevPrevNode) {
                        prevPrevNode.next = node;
                    } else {
                        this.head = node;
                    };

                    if (nextNode) {
                        nextNode.prev = prevNode;
                    };
                };
                break;
            };
            node = node.next;
        };
    };

    public moveOneSpotDown(data: Node<T>): void {
        /**
         * Move node one spot down in the list
         * 
         * @param {Node<T>} data - node to move
         */
        let node: Node<T> | null = this.head;

        while (node) {
            if (node === data) {
                if (node.next) {
                    const nextNode: Node<T> = node.next;
                    const nextNextNode: Node<T> | null = nextNode.next;
                    const prevNode: Node<T> | null = node.prev;

                    nextNode.prev = prevNode;
                    nextNode.next = node;
                    node.prev = nextNode;
                    node.next = nextNextNode;

                    if (prevNode) {
                        prevNode.next = nextNode;
                    } else {
                        this.head = nextNode;
                    };
                    if (nextNextNode) {
                        nextNextNode.prev = node;
                    };
                };
                break;
            };
            node = node.next;
        };
    };

    public traverseNodes(): T[] {
        /**
         * Traverse nodes and return array of its data
         */
        const nodes: T[] = [];
        let node: Node<T> | null = this.head;

        while (node) {
            nodes.push(node.data);
            node = node.next;
        };

        return nodes;
    };

    public searchForNode(comparator: (data: T) => boolean): Node<T> | null {
        /**
         * Search for node in the list
         * 
         * @param {Function} comparator - function to compare data
         */
        let node: Node<T> | null = this.head;

        while (node) {
            if (comparator(node.data)) {
                return node;
            };
            node = node.next;
        };

        return null;
    };

    public deleteNode(data: Node<T>): void {
        /**
         * Delete node from the list
         * 
         * @param {Node<T>} data - node to delete
         */
        let node: Node<T> | null = this.head;

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
        /**
         * Clear list
         */
        this.head = null;
        this.size = 0;
    };
};