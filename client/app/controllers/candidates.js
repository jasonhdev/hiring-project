import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CandidatesController extends Controller {
  @tracked showCandidateForm = false;
  @tracked candidateFormErrors = '';
  @tracked successMessage = '';
  @tracked candidate = {
    name: '',
    age: '',
  };

  @action
  addNew() {
    this.showCandidateForm = true;
  }

  @action
  submitCandidate() {
    let newCandidate = this.store.createRecord('applicant', {
      name: this.candidate.name,
      age: this.candidate.age,
    });

    if (newCandidate.isValid) {
      newCandidate
        .save()
        .then((newCandidate) => {
          this.model = this.store.query('applicant', {});
          this.successMessage =
            'Successfully added Candidate ' + newCandidate.name;

          setTimeout(() => {
            this.successMessage = '';
          }, 4500);
        })
        .catch((e) => {
          // Catch validation errors from server
          this.candidateFormErrors = e.errors.toArray().join('. ');
          console.log(e.errors);
        });
    } else {
      this.candidateFormErrors = newCandidate.validationErrors
        .toArray()
        .join('. ');
    }
  }

  @action
  clearForm() {
    this.candidate = {
      name: '',
      age: '',
    };
    this.showCandidateForm = false;
    this.candidateFormErrors = '';
  }
}
