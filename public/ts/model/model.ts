import { State } from "./cell-state.js";
import { ModelListener } from "./model-listener.js";
import { Indices } from "./indices.js";
import { StateUpdate } from "../generators/algorithms/state-update.js";

export class Model {
    model: State[][];
    begin?: Indices;
    end?: Indices;
    listeners : ModelListener[];

    constructor() {
        this.model = []
        this.listeners = []
    }

    regenerate(state: State[][]) {
        this.model = state
        this.listeners.forEach(listener=>listener.onReset(structuredClone(this.model)))
    }

    updateModel(x: number, y: number, state: State) {
        if (!this.model) {
            return;
        }
        if (this.model[x][y] == State.END || this.model[x][y] == State.BEGIN) {
            return;
        } 
        this.model[x][y] = state;
        if (state == State.END) {
            if (this.end) {
                let end = this.end;
                this.model[end.x][end.y] = State.UNVISITED_CELL
                this.listeners.forEach(listener=>listener.onUpdate(end.x, end.y, State.UNVISITED_CELL))    
            }
            this.end = {x: x, y: y};
        }
        if (state == State.BEGIN) {
            if (this.begin) {
                let begin = this.begin
                this.model[begin.x][begin.y] = State.UNVISITED_CELL
                this.listeners.forEach(listener=>listener.onUpdate(begin.x, begin.y, State.UNVISITED_CELL))
            }
            this.begin= {x: x, y: y};
        }
        this.listeners.forEach(listener=>listener.onUpdate(x, y, state))
    }

    addListener(listener: ModelListener) {
        this.listeners.push(listener);
    }
}