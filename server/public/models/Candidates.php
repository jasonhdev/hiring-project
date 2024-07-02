<?php

namespace App\Models;

use Phalcon\Mvc\Model;
use Phalcon\Validation;
use Phalcon\Validation\Validator\Uniqueness;
use Phalcon\Validation\Validator\Between;

class Candidates extends Model
{
    public function validation()
    {
        $validator = new Validation();

        $validator->add(
            'name',
            new Uniqueness(
                [
                    'field'   => 'name',
                    'message' => 'The candidate name must be unique',
                ]
            )
        );

        $validator->add(
            'age',
            new Between([
                'minimum' => 18,
                'maximum' => 150,
                'message' => 'Candidate must be an adult'
            ])
        );

        // Validate the validator
        return $this->validate($validator);
    }
}
