import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Route | candidates', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:candidates');
    assert.ok(route);
  });

  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('applicant', {});
    assert.ok(model);
  });

  test('creating a candidate with name and age', function (assert) {
    let store = this.owner.lookup('service:store');
    let candidate = run(() =>
      store.createRecord('applicant', {
        name: 'John Doe',
        age: 30,
      })
    );

    assert.equal(candidate.name, 'John Doe', 'Name is set correctly');
    assert.equal(candidate.age, 30, 'Age is set correctly');
  });

  test('validation fails when both age and name are invalid', function (assert) {
    let store = this.owner.lookup('service:store');
    let candidate = run(() =>
      store.createRecord('applicant', {
        name: '',
        age: 11,
      })
    );

    assert.notOk(candidate.isValid, 'Candidate is invalid');
    assert.equal(candidate.validationErrors.length, 2, 'Two validation errors');
    assert.ok(
      candidate.validationErrors.includes('Candidate name is required'),
      'Candidate name is required'
    );
    assert.ok(
      candidate.validationErrors.includes('Candidate age must be 18 or older'),
      'Correct validation error message for age'
    );

    candidate = run(() =>
      store.createRecord('applicant', {
        name: 'John',
        age: '',
      })
    );

    assert.notOk(candidate.isValid, 'Candidate is invalid');
    assert.equal(candidate.validationErrors.length, 1, 'One validation error');
    assert.ok(
      candidate.validationErrors.includes('Candidate age is required'),
      'Candidate name is required'
    );
  });
});
