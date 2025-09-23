class Nodo:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None


class ListaPendientes:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, data):
        nuevo = Nodo(data)
        if not self.head:
            self.head = self.tail = nuevo
        else:
            self.tail.next = nuevo
            nuevo.prev = self.tail
            self.tail = nuevo

    def recorrer_forward(self):
        actual = self.head
        while actual:
            yield actual.data
            actual = actual.next

    def recorrer_backward(self):
        actual = self.tail
        while actual:
            yield actual.data
            actual = actual.prev

    def sort_by_prioridad(self):
        if not self.head or not self.head.next:
            return
        
        cambiado = True
        while cambiado:
            cambiado = False
            actual = self.head
            while actual and actual.next:
                if actual.data["prioridad"] < actual.next.data["prioridad"]:
                    actual.data, actual.next.data = actual.next.data, actual.data
                    cambiado = True
                actual = actual.next
