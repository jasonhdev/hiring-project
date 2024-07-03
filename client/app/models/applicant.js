import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default class ApplicantModel extends Model {
  @attr('string') name;
  @attr('number') age;

  @computed('age', 'name.length')
  get isValid() {
    return this.name.length > 0 && this.age >= 18;
  }

  @computed('age', 'name.length')
  get validationErrors() {
    let errors = [];
    if (!this.name || this.name.length === 0) {
      errors.push('Candidate name is required');
    }

    if (!this.age) {
      errors.push('Candidate age is required');
    } else if (this.age < 18) {
      errors.push('Candidate age must be 18 or older');
    }
    return errors;
  }
}
