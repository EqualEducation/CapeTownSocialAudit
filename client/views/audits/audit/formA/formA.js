//SUB SECTIONS
var school_demographics_general =  {
  type: 'sub_section',
  name: 'formA.school_demographics.general',
  id: 'formA_school_demographics_general',
  display_name: '1.1 General',
  index: 0,
  questions:

            [
              {
                id: 'name_of_auditor',
                type: 'text',
                label: 'Name of Auditor'
              },
              {
                id: 'survey_date',
                type: 'date',
                label: 'Date of Survey'
              },
              {
                id: 'interviewee_position',
                type: 'dropdown',
                label: 'Position of person being interviewed',
                options: ['Principal', 'Dep. Principal', 'Secretary', 'Other']
              },
              {
                id: 'school_type',
                type: 'dropdown',
                label: 'Type of school',
                options: ['Primary', 'Secondary', 'Combined']
              },
              {
                id: 'school_has_disabeled_learners',
                type: 'dropdown',
                label: 'Does the school have learners with disabilities?',
                options: ['Yes', 'No']
              }
            ]
};

var grades = {
  type: 'sub_section',
  subtype: 'grades',
  name: 'formA.school_demographics.grades',
  id: 'formA_school_demographics_grades',
  display_name: '1.2 Grades',
  index: 1,
  columns: [
            {
              id: 'grade',
              name: 'Grade',
              index: 0,
              type: 'label'
            },
            {
              id: 'numberOfBoys',
              name: 'Boys',
              index: 1,
              type: 'number'
            },
            {
              id: 'numberOfGirls',
              name: 'Girls',
              index: 2,
              type: 'number'
            },
            {
              id: 'total',
              name: 'Total',
              index: 3,
              type: 'number'
            },
            {
              id: 'calculated',
              name: 'Calculated',
              index: 4,
              type: 'calculated',
              operator: 'sum',
              fields: ['numberOfGirls', 'numberOfBoys'],
            },
            {
              id: 'difference',
              name: 'Difference',
              index: 5,
              type: 'difference'
            },
  ],
  rows:
           [
            {
              type: 'label',
              id: 'gradeR',
              name: 'Grade R',
            },
            {
              type: 'label',
              id: 'grade1',
              name: 'Grade 1'
            },
            {
              type: 'label',
              id: 'grade2',
              name: 'Grade 2'
            },
            {
              type: 'label',
              id: 'grade3',
              name: 'Grade 3'
            },
            {
              type: 'label',
              id: 'grade4',
              name: 'Grade 4'
            },
            {
              type: 'label',
              id: 'grade5',
              name: 'Grade 5'
            },
            {
              type: 'label',
              id: 'grade6',
              name: 'Grade 6'
            },
            {
              type: 'label',
              id: 'grade7',
              name: 'Grade 7'
            },
            {
              type: 'label',
              id: 'grade8',
              name: 'Grade 8'
            },
            {
              type: 'label',
              id: 'grade9',
              name: 'Grade 9'
            },
            {
              type: 'label',
              id: 'grade10',
              name: 'Grade 10'
            },
            {
              type: 'label',
                id: 'grade11',
                name: 'Grade 11'
            },
            {
              type: 'label',
                id: 'grade12',
                name: 'Grade 12'
            },
            {
              type: 'label',
                id: 'total',
                name: 'Total'
            }
          ]
};

var staff = {
  type: 'sub_section',
  subtype: 'staff',
  name: 'formA.school_demographics.staff',
  id: 'formA_school_demographics_staff',
  display_name: '1.3 Staff',
  index: 2,
  columns: [
            {
              id: 'position',
              name: 'Position',
              index: 0,
              type: 'label'
            },
            {
              id: 'male',
              name: 'Male',
              index: 1,
              type: 'number'
            },
            {
              id: 'female',
              name: 'Female',
              index: 2,
              type: 'number'
            },
            {
              id: 'total',
              name: 'Total',
              index: 3,
              type: 'number'
            },
            {
              id: 'calculated',
              name: 'Calculated',
              index: 4,
              type: 'calculated',
              operator: 'sum',
              fields: ['male', 'female'],
            },
            {
              id: 'difference',
              name: 'Difference',
              index: 5,
              type: 'difference'
            },
  ],
  rows:
            [
              {
                type: 'label',
                id: 'total_number_of_teachers',
                name: 'Total number of teachers'
              },
              {
                type: 'label',
                id: 'number_of_permanent_teachers',
                name: 'Number of permanent teachers'
              },
              {
                type: 'label',
                id: 'number_of_administrative_staff',
                name: 'Number of adminstrative staff'
              },
              {
                type: 'label',
                id: 'number_of_security_guards',
                name: 'Number of security guards'
              },
              {
                type: 'label',
                id: 'number_of_maintenance_staff',
                name: 'Number of maintenance/cleaning/cooking staff'
              }
            ]
}

var infrastructure =  {
  type: 'sub_section',
  name: 'formA.security.infrastructure',
  id: 'formA_security_infrastructure',
  display_name: '2.1 Security Infrastructure',
  index: 0,
  questions: [
              {
                id: 'cctv',
                type: 'dropdown',
                label: '2.1.1 Does the school have CCTV?',
                options: ['Yes, and it works', 'Yes, but it doesn\'t work', 'No', 'Don\'t know'],
                hasComment: true,
              },
              {
                id: 'alarm',
                type: 'dropdown',
                label: '2.1.2 Does the school have an alarm?',
                options: ['Yes, and it works', 'Yes, but it doesn\'t work', 'No', 'Don\'t know'],
                hasComment: true,
              }]
};

var planning = {
  type: 'sub_section',
  name: 'formA.security.planning',
  id: 'formA_security_planning',
  display_name: '2.2 Security Planning',
  index: 1,
  questions:
            [
              {
                id: 'safety_committee',
                type: 'dropdown',
                label: '2.2.1 Does the school have a "Safety Committee?"',
                options: ['Yes', 'No', 'Don\'t know'],
                hasComment: true,
              },
              {
                id: 'safety_committee_activities',
                type: 'dropdown',
                label: '2.2.2 Is the "Safety Committee" active at the school?',
                options: ['Yes (please describe in comments)', 'No, no committee exists', 'I don\'t know what they do'],
                hasComment: true,
              },
              {
                id: 'safety_plan',
                type: 'dropdown',
                label: '2.2.3 Does the school have a safety plan?',
                options: ['Yes', 'No', 'Don\'t know'],
                hasComment: true
              },
              {
                id: 'safety_plan_policy',
                type: 'dropdown',
                label: '2.2.4 Do you know the policies of the safety plan?',
                options: ['Yes (please describe in comments)', 'No, no plan exists', 'No, a plan exists, but I don\'t know what it is', 'Don\'t know'],
                hasComment: true,
              },
              {
                id: 'safety_officer',
                type: 'dropdown',
                label: '2.2.5 Does the school have a school safety officer?',
                options: ['Yes', 'No', 'Don\'t know'],
                hasComment: true,
              },
              {
                id: 'safety_officer_activities',
                type: 'dropdown',
                label: '2.2.6 Do you know what the "School Safety Officer" does?',
                options: ['Yes (please describe in comments)', 'No, there is no school safety officer', 'I don\'t know what they do'],
                hasComment: true,
              },
              {
                id: 'conduct_code',
                type: 'dropdown',
                label: '2.2.7 Does the school have a code of conduct"?',
                options: ['Yes', 'No', 'Don\'t know'],
                hasComment: true,
              },
              {
                id: 'code_policies',
                type: 'dropdown',
                label: '2.2.8 Are you aware of the policies of the code of conduct?',
                options: ['Yes (please describe in comments)', 'No, no code exists', 'No, a code exists, but I don\'t know what it is', 'Don\'t know'],
                hasComment: true,
              }]
}

var violence = {
  type: 'sub_section',
  name: 'formA.security.violence',
  id: 'formA_security_violence',
  display_name: '2.3 Violence and Crime in the School',
  index: 2,
  questions: [
    {
      id: 'violence_3months',
      type: 'checkbox',
      label: '2.3.1 In the last 3 months, which of the following events have taken place at the school and been reported to the administration?',
      options: ['Theft of personal property', 'Gang violence', 'Sexual harassment', 'Alcohol use', 'Drug use', 'Physical violence against an educator', 'Physical violence against a learner', 'Other', 'Not answered'],
      hasComment: true,
    },
    {
      id: 'violence_1year',
      type: 'checkbox',
      label: '2.3.2 In the last year, which of the following events have taken place at the school and been reported to the administration?',
      options: ['Physical violence resulting in significant injury of an educator', 'Physical violence resulting in signficant injury of a learner', 'A rape', 'A shooting', 'A stabbing', 'Significant vandalism', 'Burglary', 'Not answered'],
      hasComment: true,
    },
    {
      id: 'reported',
      type: 'dropdown',
      label: '2.3.3 How regularly are there reported cases of burglaries and significant vandalism?',
      options: ['Never', 'Almost Never', 'Once a year', 'Every 6 months', 'Once a month', 'Weekly', 'Daily', 'Don\’t know'],
      hasComment: true,
    }]
}

var security_staff = {
  type: 'sub_section',
  name: 'formA.security.security_staff',
  id: 'formA_security_security_staff',
  display_name: '2.4 Security Staff',
  index: 3,
  questions:[
    {
      id: 'teacher_training',
      type: 'dropdown',
      label: '2.4.1 When did teachers last receive safety training?',
      options: ['In the last 6 months',
                'In the last year',
                'In the last 2 years',
                'More than 2 years ago',
                'Never',
                'Don\'t know'
              ],
      hasComment: true,
    },
    {
      id: 'hired_guards',
      type: 'dropdown',
      label: '2.4.2 Who hires the security guard(s)?',
      options: ['There is no security guard', 'WCED', 'SGB', 'Principal', 'Don\'t know', 'Other'],
      hasComment: true,
    },
    {
      id: 'guard_trained',
      type: 'dropdown',
      label: '2.4.3 Are the security guards trained?',
      options: ['There is no security guard', 'Yes', 'No', 'Don\'t know'],
      hasComment: true,
    },
    {
      id: 'defensive_instrument',
      type: 'checkbox',
      label: '2.4.4 What type of defensive instrument does the security guard have?',
      options: ['There is no security guard', 'The security guard does not have a defensive instrument', 'Gun', 'Baton', 'Knobkerrie', 'Sjambok', 'Don\t know', 'Other'],
      hasComment: true,
    },
    {
      id: 'body_search',
      type: 'dropdown',
      label: '2.4.5 Does the school conduct body searches?',
      options: ['Yes, they are conducted by police with police dogs', 'Yes, they are conducted by police without dogs', 'Yes, they are conducted by staff', 'No', 'Don\’t know'],
      hasComment: true,
    },
    {
      id: 'body_search_gender',
      type: 'dropdown',
      label: '2.4.6 If body searches are conducted, is it required that they are they done by an official of the same gender as the learner being searched (e.g. men search boys and women search girls)?',
      options: ['Yes, it is required and searches are always done by the same gender', 'Yes, it is required but searches are not always done by the same gender', 'No, it is not required', 'No, we do not conduct body searches', 'Don\’t know'],
      hasComment: true,
    },
    {
      id: 'bag_search',
      type: 'dropdown',
      label: '2.4.7 Does the school conduct bag searches?',
      options: ['Yes, they are conducted by police with police dogs', 'Yes, they are conducted by police without dogs', 'Yes, they are conducted by staff', 'No', 'Don\’t know'],
      hasComment: true,
    }]
}

var sense_of_security = {
  type: 'sub_section',
  name: 'formA.security.sense_of_security',
  id: 'formA_security_sense_of_security',
  display_name: '2.5 Sense of Security',
  index: 4,
  questions: [
    {
      id: 'safe_feel',
      type: 'dropdown',
      label: '2.5.1 How safe do you feel learners and educators are at the school?',
      options: ['Very Safe','Safe', 'Neither Safe Nor Unsafe', 'Unsafe', 'Very Unsafe'],
      hasComment: true,
    },
    {
      id: 'safety_challenges',
      type: 'textarea',
      label: '2.5.2 Please discuss what you [the adminstrator] think the challenges to safety are at the school. Record their answer below'
    }]
}

//SECTIONS
var school_demographics = {
  type: 'section',
  name: 'formA.school_demographics',
  index: 0,
  display_name: '1. School Demographics',
  sub_sections: [school_demographics_general, grades, staff]
};

var security = {
  type: 'section',
  name: 'formA.security',
  display_name: '2. Security',
  index: 1,
  sub_sections: [infrastructure, planning, violence, security_staff, sense_of_security]
};

formA = {
          type: 'form',
          name: 'formA',
          index: 0,
          display_name: 'Form A: Administrator Interview',
          sections:[school_demographics, security]
        };
