const bindings = {};

const app = () => {
    bindings.first = new Observable("");
    bindings.last = new Observable("");
    bindings.full = new Computed(() => `${bindings.first.value} ${bindings.last.value}`.trim(), [bindings.first, bindings.last]);
    applyBindings();
};

setTimeout(app, 0);

const applyBindings = () => {
    document.querySelectorAll("[data-bind]").forEach(elem => {
        const obs = bindings[elem.getAttribute("data-bind")];
        bindValue(elem, obs);
    });
}

const bindValue = (input, observable) => {
    input.value = observable.value;
    observable.subscribe(() => input.value = observable.value);
    input.onkeyup = () => observable.value = input.value;
};

class Observable {

    constructor(value) {
        this._listeners = [];
        this._value = value;
    }

    notify() {
        this._listeners.forEach(listener => listener(this._value));
    }

    subscribe(listener) {
        this._listeners.push(listener);
    }

    get value() {
        return this._value;
    }

    set value(val) {
        if (val !== this._value) {
            this._value = val;
            this.notify();
        }
    }
}

class Computed extends Observable {
    constructor(value, deps) {
        super(value());
        const listener = () => {
            this._value = value();
            this.notify();
        }
        deps.forEach(dep => dep.subscribe(listener));
    }

    get value() {
        return this._value;
    }

    set value(_) {
        throw "Cannot set computed property";
    }
}
