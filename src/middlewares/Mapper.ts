import { Request, Response } from "express";
import { isObject } from "util";

// Esta función se encarga de cambiar el nombre de todos los
// campos de un objeto que se encuentren dentro de el objeto m (map)
// por el valor de los mismos, esto se hace de forma recursiva en cada
// objeto y los objetos anidados, esta función no funciona si el objeto
// no tiene arreglos

export const mapear = (object: any[]) => {
    const mapped: any = [];
    if (!isObject(object)) {
        for (const item of object) {
            if (item.idAppMovil === undefined) {
                mapped.push({
                    clave_institucion: item.clave_institucion,
                    nombreCorto: item.nombreCorto,
                    idAppMovil: null,
                });
            } else {
                mapped.push(item);
            }
          }
    }
    return mapped;
};


export function Mapper(req: Request, res: Response, next: () => void) {
    const newBody = mapear(req.body);
    req.body = newBody;
    next();
}
