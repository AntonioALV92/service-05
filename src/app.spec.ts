import http from 'http';
import nock from 'nock';
import supertest from 'supertest';
import packageJson from '../package.json';
import routes from '../routes.json';
import app from './app';
import * as fixtures from './fixtures';


describe(`al ejecutar el servidor`, () => {

  let server: http.Server;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
  });

  afterAll((done) => {
    server.close(done);
  });


  describe('Al ejecutar un GET /version', () => {
    test(`Debería retornar un JSON con la versión del package.json`, async () => {
      const response = await request
        .get('/version');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.version).toEqual(packageJson.version);
    });
  });

  describe('al ejecutar un GET /general/catalogoInstituciones', () => {
    describe(`al hacer una petición correcta`, () => {

      afterEach(() => {
        nock.cleanAll();
        nock.recorder.clear();
      });

      test(`si el servicio de banxico responde correctamente`, async () => {

        let contentTypeRequestBanxico: string = '';
        nock(routes.catalogoInstituciones)
          .matchHeader('content-type', (val) => {
            // Obtenemos el contentType enviado hacia banxico
            contentTypeRequestBanxico = val;
            return true;
          })
          .get('')
          .reply(200, [{
            clave_institucion: 455,
            nombreCorto: "SSSS",
            idAppMovil: null || "ssss",
          }]);

        const response = await request
          .get('/general/catalogoInstituciones');
        // El body que va hacia el servicio de Banxico debe ser text/plain con
        expect(contentTypeRequestBanxico).toBe('text/plain');

        // Si todo es correcto Banxico retorna un 200
        expect(response.header['content-type']).toContain('application/json');
        expect(response.status).toBe(200);
        // Debería de mapear la respuesta del servicio de banxico
        expect(response.body).toEqual([{
          clave_institucion: 455,
          nombreCorto: "SSSS",
          idAppMovil: null || "ssss",
        }]);
      });


      test(`si el servicio de banxico no responde json`, async () => {
        nock(routes.catalogoInstituciones)
          .get('')
          .reply(200, 'error banxico string');

        const response = await request
          .get('/general/catalogoInstituciones');
        // Este servicio si debe responder con JSON
        expect(response.header['content-type']).toContain('application/json');
        // Status 503 para indicar que hay error en Banxico
        expect(response.status).toBe(503);
        expect(response.body.code).toEqual(-1);
        expect(response.body.message).toContain('Error al procesar respuesta');
        expect(response.body.message).toContain('error banxico string');
      });



      test(`si el servicio de banxico responde error`, async () => {
        nock(routes.catalogoInstituciones)
          .get('')
          .reply(404, fixtures.respuestaErrorBanxico);

        const response = await request
          .get('/general/catalogoInstituciones');
        expect(response.status).toBe(503);
        expect(response.body.code).toBe(-404);
        expect(response.body.details)
          .toBe(JSON.stringify(fixtures.respuestaErrorBanxico));
      });
    });
  });

});
