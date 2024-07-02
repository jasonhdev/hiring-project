import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CandidatesController extends Controller {
  @tracked showCandidateForm = false;
  @tracked candidateFormErrors = "";
  @tracked successMessage = "";
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
      .then((newCandidate) => {
        this.model = this.store.query('applicant', {});
        this.successMessage = "Successfully added Candidate " + newCandidate.name;

        setTimeout(() => {
          this.successMessage = "";
        }, 4500);
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
