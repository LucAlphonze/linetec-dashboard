export class RegistroFiltrado {
  _id!: string;
  respuesta!: number;
  min!: number;
  avg!: number;

  constructor(_id: string, respuesta: number, min: number, avg: number) {
    this._id = _id;
    this.respuesta = respuesta;
    this.min = min;
    this.avg = avg;
  }
}

export class Variable {
  _id!: string;
  nombre!: string;
  id_maquina?: IDMaquina;
  id_proceso?: IDProceso;
  id_trigger?: IDTrigger;
  trigger_valor!: string;
  constructor(
    _id: string,
    nombre: string,
    id_maquina: IDMaquina,
    id_proceso: IDProceso,
    id_trigger: IDTrigger,
    trigger_valor: string
  ) {
    this._id = _id;
    this.nombre = nombre;
    this.id_maquina = id_maquina;
    this.id_proceso = id_proceso;
    this.id_trigger = id_trigger;
    this.trigger_valor = trigger_valor;
  }
}

export interface IDMaquina {
  _id: string;
  nombre: string;
  modelo: string;
}

export interface IDProceso {
  _id: string;
  descripcion: string;
}

export interface IDTrigger {
  _id: string;
  nombre: string;
  descripcion: string;
}
