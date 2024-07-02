import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CandidatesController extends Controller {
  @tracked showCandidateForm = false;
  @tracked candidateFormErrors = "";
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
    // TODO: Remove after testing
    if (!this.candidate.name) {
      this.candidate.name = 'Tester';
    }
    if (!this.candidate.age) {
      this.candidate.age = 12;
    }

    if (!this.candidate.name) {
      this.candidateFormErrors = 'Candidate name is required';
      return;
    }
    if (!this.candidate.age) {
      this.candidateFormErrors = 'Candidate age is required';
      return;
    }

    let newCandidate = this.store.createRecord('applicant', {
      name: this.candidate.name,
      age: this.candidate.age,
    });

    newCandidate
      .save()
      .then(() => {
        this.model = this.store.query('applicant', {});
        this.clearForm();
      })
      .catch((e) => {
        this.candidateFormErrors = e.errors.toArray().join(". ");
        console.log(e.errors);
      });
  }

  @action
  clearForm() {
    this.candidate = {
      name: '',
      age: '',
    };
    this.showCandidateForm = false;
    this.candidateFormErrors = "";
  }
}
