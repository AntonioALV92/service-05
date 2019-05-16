import { CatalogoInstituciones } from "./controllers";

export const respuestaErrorBanxico = {
    edoPet: -1,
};

export const registroInicialRequest = {
    appIdentifier: "string",
    deviceInfo: {
        manufacturer: "string",
        model: "string",
        osName: "string",
        osVersion: "string",
    },
    numeroCelular: 0,
};

export const registroInicialRequestBanxico = {
    idH: "string",
    ia: {
        fab: "string",
        mod: "string",
        so: "string",
        vSO: "string",
    },
    nc: 0,
};

export const mappedRequest = [{
    clave_institucion: 333,
    nombreCorto: "string",
}];

export const mappedResponse = [{
    clave_institucion: 333,
    nombreCorto: "string",
    idAppMovil: null ,
}];

///////////




