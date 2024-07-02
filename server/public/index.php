<?php

use Phalcon\Loader;
use Phalcon\Mvc\Micro;
use Phalcon\Di\FactoryDefault;
use Phalcon\Db\Adapter\Pdo\Mysql as PdoMysql;
use Phalcon\Http\Response;
use App\Models\Candidates;

$loader = new Loader();
$loader->registerNamespaces(
  [
    'App\Models' => __DIR__ . '/models/',
  ]
);
$loader->register();


$container = new FactoryDefault();
$container->set(
  'db',
  function () {
    return new PdoMysql(
      [
        'host'     => 'db',
        'username' => 'dev',
        'password' => 'plokijuh',
        'dbname'   => 'hiring',
      ]
    );
  }
);

$app = new Micro($container);

$app->get(
  '/',
  function () {
    header('Content-type: application/json');
    echo json_encode([
      'available REST endpoints:',
      'GET /api/applicants',
      'GET /api/applicants/{id}',
      'POST /api/applicants',
    ]);
  }
);

$app->get(
  '/api/applicants',
  function () use ($app) {
    $phql = "SELECT id, name, age FROM App\Models\Candidates ORDER BY age";
    $candidates = $app
      ->modelsManager
      ->executeQuery($phql);

    $data = [];

    foreach ($candidates as $cand) {
      $data[] = [
        'type' => 'applicant',
        'id'   => $cand->id,
        'attributes' => [
          'name' => $cand->name,
          'age' => $cand->age,
        ]
      ];
    }

    header('Content-type: application/vnd.api+json'); // JSON API
    echo json_encode(['data' => $data]);
  }
);

$app->post(
  '/api/applicants',
  function () use ($app) {

    $payload = $app->request->getJsonRawBody();

    $response = new Response();

    try {
      $candidate = new Candidates();
      $candidate->name = $payload->data->attributes->name;
      $candidate->age = $payload->data->attributes->age;

      if ($candidate->create()) {
        $response
          ->setStatusCode(201)
          ->setJsonContent([
            'data' => [
              'type' => 'applicant',
              'attributes' => $candidate->toArray([
                'name',
                'age',
              ]),
            ]
          ]);
      } else {
        $response
          ->setStatusCode(422)
          ->setJSONContent([
            'errors' => $candidate->getMessages()
          ]);
      }
    } catch (Exception $e) {
      $response
        ->setStatusCode(400)
        ->setJSONContent([
          'errors' => $e->getMessage()
        ]);
    }

    return $response;
  }
);

$app->handle($_SERVER['REQUEST_URI']);
