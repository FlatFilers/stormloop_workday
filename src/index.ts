import {
  Sheet,
  Workbook,
  TextField,
  Message,
  ReferenceField,
  OptionField,
  NumberField,
  SpaceConfig,
} from '@flatfile/configure'

import { ListCountriesFragment } from './fragments/countries'
import { ListTimeZoneFragment } from './fragments/timezones'
import { SmartDateField } from './SmartDateField'

/*
 * Types
 */

type Nil = null | undefined

type Falsy = null | undefined | false | '' | 0

/*
 * Guards
 */

/**
 * Helper function to determine if a value is null.
 * Useful in if/else statements or ternaries.
 *
 * @param {*} x - Any object/value
 *
 * @example
 * if (isNull(x)) {
 *   ...
 * } else {
 *   ...
 * }
 */
const isNull = (x: unknown): x is null => x === null

/**
 * Helper function to determine if a value is undefined.
 * Useful in if/else statements or ternaries.
 *
 * @param {*} x - Any object/value
 *
 * @example
 * if (isUndefined(x)) {
 *   ...
 * } else {
 *   ...
 * }
 */
const isUndefined = (x: unknown): x is undefined => x === undefined

/**
 * Helper function to determine if a value is null, undefined or an empty string.
 * Useful in if/else statements or ternaries.
 *
 * @param {*} x - Any object/value
 *
 * @example
 * if (isNil(x)) {
 *   ...
 * } else {
 *   ...
 * }
 */
const isNil = (x: unknown): x is Nil =>
  isNull(x) || isUndefined(x) || (isString(x) && x === '')

/**
 * Helper function to determine if a value is NOT null or undefined.
 * Useful in if/else statements or ternaries.
 *
 * @param {*} x - Any object/value
 *
 * @example
 * if (isNotNil(x)) {
 *   ...
 * } else {
 *   ...
 * }
 */
const isNotNil = <T>(x: T | Nil): x is T => !isNil(x)

/**
 * Helper function to determine if a value is falsy.
 * Useful in if/else statements or ternaries.
 *
 * @param {*} x - Any object/value
 *
 * @example
 * if (isFalsy(x)) {
 *   ...
 * } else {
 *   ...
 * }
 */
const isFalsy = (x: unknown): x is Falsy =>
  x === 0 || Number.isNaN(x) || x === false || isNil(x)

/**
 * Helper function to determine if a value is truthy.
 * Useful in if/else statements or ternaries.
 *
 * @param {*} x - Any object/value
 *
 * @example
 * if (isTruthy(x)) {
 *   ...
 * } else {
 *   ...
 * }
 */
const isTruthy = (x: unknown): x is true => !isFalsy(x)

/**
 * Helper function to determine if a value is a string.
 * Useful in if/else statements or ternaries.
 *
 * @param {*} x - Any object/value
 *
 * @example
 * if (isString(x)) {
 *   ...
 * } else {
 *   ...
 * }
 */
const isString = (x: unknown): x is string => typeof x === 'string'

/**
 * Helper function to determine if a value is a number.
 * Useful in if/else statements or ternaries.
 *
 * @param {*} x - Any object/value
 *
 * @example
 * if (isNumber(x)) {
 *   ...
 * } else {
 *   ...
 * }
 */
const isNumber = (x: unknown): x is number => typeof x === 'number'

/*
 * Field Validations
 */

const validateEmail = (value: string) => (): void | Message => {
  if (!value.includes('@')) {
    return new Message('Invalid email address.', 'error', 'validate')
  }

  return
}

const validateRegex =
  (regex: RegExp) => (value: string) => (): void | Message => {
    if (isFalsy(regex.test(value))) {
      return new Message(
        'Value does not meet required format.',
        'error',
        'validate'
      )
    }

    return
  }

/**
 * Allows us to combine multiple validations in a quick and easy way.
 *
 * @example
 * runValidations(fn1, fn2, fn3, ...);
 */
const runValidations = (...fns: Array<any>): Array<Message> => {
  return fns.reduce((acc, fn) => [...acc, fn()], []).filter(isNotNil)
}

/*
 * Main
 */

const Employees = new Sheet('Employees', {
  id: TextField({
    label: 'Id',
    required: true,
    primary: true,
    unique: true,
    description: 'Every entry must be unique',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Do we want a record compute here to split names?

  FirstName: TextField({
    label: 'FirstName',
    required: true,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Do we want a record compute here to split names?

  LastName: TextField({
    label: 'LastName',
    required: true,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Free text field

  Salutation: TextField({
    label: 'Salutation',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Do we want a record compute here to split addresses? Do we need a full address field in addition to the individual address fields?  Are any of these field conditionally required?

  Address: TextField({
    label: 'Address',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  SuiteNumber: TextField({
    label: 'Suite Number',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  City: TextField({
    label: 'City',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Need list of two digit Codes validated by Country

  Province: TextField({
    label: 'Province',
    required: false,
    primary: false,
    unique: false,
    description:
      'Must be a valid Provincial/State/Subdivision ISO3166-2 Code of Country in Column [Country]',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Will all country codes be available for each customer?

  Country: OptionField({
    label: 'Country',
    required: false,
    primary: false,
    unique: false,
    description: 'Must be a valid ISO3166 Country Code',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
    options: {
      ...ListCountriesFragment,
    },
  }),

  //Do Postal Codes need to be validated by country and/or for format?

  PostalCode: TextField({
    label: 'Postal Code',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Does formatting and/or country impact these fields?

  MainPhoneNumber: TextField({
    label: 'Main Phone Number',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Does formatting and/or country impact these fields?

  PersonalPhoneNumber: TextField({
    label: 'Personal Phone Number',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Does formatting and/or country impact these fields?

  OtherPhoneNumber: TextField({
    label: 'Other Phone Number',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Does formatting and/or country impact these fields?

  FaxNumber: TextField({
    label: 'Fax Phone Number',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Free text field

  JobTitle: TextField({
    label: 'Job Title',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Are there system rules for email address format?

  EmailAddress: TextField({
    label: 'Email Address',
    required: true,
    primary: false,
    unique: true,
    description: 'Every entry must be unique. Must be a valid e-mail address',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
    validate: (value) => {
      const ensureValidEmail = validateEmail(value)

      return runValidations(ensureValidEmail)
    },
  }),

  //How is password formatted / generated?

  Password: TextField({
    label: 'Password',
    required: true,
    primary: false,
    unique: false,
    description:
      'Password: Required minimum of 8 characters and maximum 72 characters',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
    validate: (value) => {
      const ensureValidChars = validateRegex(/^.{8,72}$/)(value)

      return runValidations(ensureValidChars)
    },
  }),

  //Are there any validations needed for this field?

  DateOfBirth: SmartDateField({
    label: 'Date Of Birth',
    fString: 'yyyy-MM-dd',
    required: false,
    primary: false,
    unique: false,
    description: 'Must be a valid ISO8601 formatted date (YYYY-MM-DD)',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //For the picklist values - does Male = M, Female = F - can we consolidate?

  Gender: OptionField({
    label: 'Gender',
    required: false,
    primary: false,
    unique: false,
    description:
      'Entries must only be one of the following: [Male, Female, M, F, Other]',
    options: {
      Male: 'Male',
      Female: 'Female',
      M: 'M',
      F: 'F',
      Other: 'Other',
    },
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Are there any validations needed for this field?

  EmploymentDate: SmartDateField({
    label: 'Employment Date',
    fString: 'yyyy-MM-dd',
    required: false,
    primary: false,
    unique: false,
    description: 'Must be a valid ISO8601 formatted date (YYYY-MM-DD)',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Are there any validations needed for this field?

  TerminationDate: SmartDateField({
    label: 'Termination Date',
    fString: 'yyyy-MM-dd',
    required: false,
    primary: false,
    unique: false,
    description: 'Must be a valid ISO8601 formatted date (YYYY-MM-DD)',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //For the picklist values - are these consistent across customers?

  Status: OptionField({
    label: 'Status',
    required: true,
    primary: false,
    unique: false,
    description:
      'Entries must only be one of the following: [Active, Terminated, Suspended, Hold, On Hold, Pending, Applicant, Rejected]',
    options: {
      Active: 'Active',
      Terminated: 'Terminated',
      Suspended: 'Suspended',
      Hold: 'Hold',
      OnHold: 'On Hold',
      Pending: 'Pending',
      Applicant: 'Applicant',
      Rejected: 'Rejected',
    },
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Check for Alpha Numeric

  PayrollId: TextField({
    label: 'Payroll Id',
    required: false,
    primary: false,
    unique: false,
    description: 'Alpha Numeric Field',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
    validate: (value) => {
      const ensureValidChars = validateRegex(/^[a-zA-Z0-9]+$/)(value)

      return runValidations(ensureValidChars)
    },
  }),

  //Look-Up Field against sheet / API

  EmploymentType: TextField({
    label: 'Employment Type',
    required: false,
    primary: false,
    unique: false,
    description:
      'Every entry in this column must also be in the [Name] Column in the sheet [EmploymentTypes]',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Look up field in AC DB

  OvertimeRule: TextField({
    label: 'Overtime Rule',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Check for Alpha Numeric

  SINNumber: TextField({
    label: 'SIN Number',
    required: false,
    primary: false,
    unique: false,
    description: 'Alpha Numeric Field',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
    validate: (value) => {
      const ensureValidChars = validateRegex(/^[a-zA-Z0-9]+$/)(value)

      return runValidations(ensureValidChars)
    },
  }),

  //Check for Alpha Numeric

  CertificationNumber: TextField({
    label: 'Certification Number',
    required: false,
    primary: false,
    unique: false,
    description: 'Alpha Numeric Field',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
    validate: (value) => {
      const ensureValidChars = validateRegex(/^[a-zA-Z0-9]+$/)(value)

      return runValidations(ensureValidChars)
    },
  }),

  //Look up field in AC DB

  Designation: TextField({
    label: 'Designation',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Look up field/validation in AC DB

  SeniorityRank: TextField({
    label: 'Seniority Rank',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Look up field/validation in AC DB

  SeniorityNumber: TextField({
    label: 'Seniority Number',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Are there any validations needed for this field?

  SeniorityDate: SmartDateField({
    label: 'Seniority Date',
    fString: 'yyyy-MM-dd',
    required: false,
    primary: false,
    unique: false,
    description: 'Must be a valid ISO8601 formatted date (YYYY-MM-DD)',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Look Up Field - what are we looking up against?

  SalaryBase: TextField({
    label: 'Salary Base',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  MinDailyCapacity: NumberField({
    label: 'Min Daily Capacity',
    required: false,
    primary: false,
    unique: false,
    description: 'Numeric in hours',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  MaxDailyCapacity: NumberField({
    label: 'Max Daily Capacity',
    required: false,
    primary: false,
    unique: false,
    description: 'Numeric in hours',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  MinWeeklyCapacity: NumberField({
    label: 'Min Weekly Capacity',
    required: false,
    primary: false,
    unique: false,
    description: 'Numeric in hours',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  MaxWeeklyCapacity: NumberField({
    label: 'Max Weekly Capacity',
    required: false,
    primary: false,
    unique: false,
    description: 'Numeric in hours',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  MaxCaseload: NumberField({
    label: 'Max Caseload',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //For the picklist values - is the empty value necessary?

  DefaultEmployeeAvailability: OptionField({
    label: 'Default Employee Availability',
    required: false,
    primary: false,
    unique: false,
    description:
      'Entries must only be one of the following: [Available, Unavailable, empty value]',
    options: {
      Available: 'Available',
      Unavailable: 'Unavailable',
    },
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Options are Yes and No - would it make sense to turn this into a Boolean field?

  SubmitVisitAttachments: OptionField({
    label: 'Submit Visit Attachments',
    required: false,
    primary: false,
    unique: false,
    description: 'Answers can either be [yes] or [no]',
    options: {
      Yes: 'Yes',
      No: 'No',
    },
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //For the picklist values - is the empty value necessary?

  TravelMode: OptionField({
    label: 'Travel Mode',
    required: false,
    primary: false,
    unique: false,
    description:
      'Entries must only be one of the following: [Driving, Biking, Walking, Transit, empty value]',
    options: {
      Driving: 'Driving',
      Biking: 'Biking',
      Walking: 'Walking',
      Transit: 'Transit',
    },
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Need list of valid language codes - Mapping can facilitate the need for multiple entries

  preferred_language: TextField({
    label: 'Preferred Language',
    required: false,
    primary: false,
    unique: false,
    description:
      'Must be a valid ISO639 Language Code. For English you can enter either "en" or "eng"',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  Remarks: TextField({
    label: 'Remarks',
    required: false,
    primary: false,
    unique: false,
    description: 'Free text field',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Look-Up Field against sheet / API

  CostCentreNumber: TextField({
    label: 'Cost Centre Number',
    required: false,
    primary: false,
    unique: false,
    description:
      'Every entry in this column must also be in the [Number] Column in the sheet [CostCentres]',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Look-Up Field against sheet / API

  SupplierCode: TextField({
    label: 'Supplier Code',
    required: false,
    primary: false,
    unique: false,
    description:
      'Every entry in this column must also be in the [Code] Column in the sheet [Suppliers]',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Look-Up Field against IANA Time Zone Database or Option Field

  Timezone: OptionField({
    label: 'Timezone',
    required: false,
    primary: false,
    unique: false,
    description:
      'Must be a valid time zone name from the IANA Time Zone Database, e.g. America/Toronto or Australia/Sydney',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
    options: {
      ...ListTimeZoneFragment,
    },
  }),
})

const EmployeeRoles = new Sheet('Employee Roles', {
  //Lookup Field against Employees

  EmployeeId: ReferenceField({
    label: 'Employee Id',
    sheetKey: 'Employees',
    foreignKey: 'id',
    relationship: 'has-many',
    required: true,
    primary: true,
    unique: false,
    description:
      'Every entry in this column must also be in the [Id] Column in the sheet [Employees]. The contents of this sheet will be merged into any of the sheets [Employees, EmployeeUpdates] and only migrated when those sheets are migrated. It is not possible to migrate this data by itself.',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //AC DB Lookup Field

  Role: TextField({
    label: 'Role',
    required: true,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),
})
const EmployeeDepartments = new Sheet('Employee Departments', {
  //Lookup Field against Departments

  DepartmentCode: TextField({
    label: 'DepartmentCode',
    required: true,
    primary: false,
    unique: false,
    description:
      'Every entry in this column must also be in the [Code] Column in the sheet [Departments]. The contents of this sheet will be merged into any of the sheets [Employees, EmployeeUpdates] and only migrated when those sheets are migrated. It is not possible to migrate this data by itself.',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Lookup Field against Employees

  EmployeeId: TextField({
    label: 'Employee Id',
    sheetKey: 'Employees',
    foreignKey: 'id',
    relationship: 'has-many',
    required: true,
    primary: false,
    unique: false,
    description:
      'Every entry in this column must also be in the [Id] Column in the sheet [Employees]. The contents of this sheet will be merged into any of the sheets [Employees, EmployeeUpdates] and only migrated when those sheets are migrated. It is not possible to migrate this data by itself.',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),
})

const EmployeeGroups = new Sheet('Employee Groups', {
  //Lookup Field against Employees

  EmployeeId: TextField({
    label: 'Employee Id',
    sheetKey: 'Employees',
    foreignKey: 'id',
    relationship: 'has-many',
    required: true,
    primary: false,
    unique: false,
    description:
      'Every entry in this column must also be in the [Id] Column in the sheet [Employees]. The contents of this sheet will be merged into any of the sheets [Employees, EmployeeUpdates] and only migrated when those sheets are migrated. It is not possible to migrate this data by itself.',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Lookup Field against Groups

  GroupName: TextField({
    label: 'Group Name',
    required: true,
    primary: false,
    unique: false,
    description:
      'Every entry in this column must also be in the [Name] Column in the sheet [Groups]',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),
})

const AssociatedEmployees = new Sheet('Associated Employees', {
  //Lookup Field against Clients

  ClientId: TextField({
    label: 'Client Id',
    required: true,
    primary: true,
    unique: false,
    description:
      'Every entry in this column must also be in the [Id] Column in the sheet [Clients].',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Lookup Field against Employees

  EmployeeId: TextField({
    label: 'Employee Id',
    sheetKey: 'Employees',
    foreignKey: 'id',
    relationship: 'has-many',
    required: true,
    primary: false,
    unique: false,
    description:
      'Every entry in this column must also be in the [Id] Column in the sheet [Employees]',
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),

  //Free text field

  Description: TextField({
    label: 'Description',
    required: false,
    primary: false,
    unique: false,
    stageVisibility: {
      mapping: true,
      review: true,
      export: true,
    },
  }),
})

export default new SpaceConfig({
  name: 'Employees',
  slug: 'Employeessc',
  workbookConfigs: {
    basic: new Workbook({
      name: 'Employees',
      slug: 'Employeesworkbook',
      namespace: 'Employees',
      sheets: {
        Employees,
        EmployeeRoles,
        EmployeeDepartments,
        EmployeeGroups,
        AssociatedEmployees,
      },
    }),
  },
})

/*
currency_conversion: NumberField({
  label: 'Currency Conversion',
  required: false,
  primary: true,
  unique: true,
  description: 'Currency Conversion at the time of upload.',
  annotations: {
    default: true,
    defaultMessage: 'This field was automatically given a default value of',
    compute: true,
    //Message displayed in UI when Currency Conversion field is computed.  No message will show if field is not computed.
    computeMessage: 'This value was automatically reformatted to two decimal places. Original value was: ',
  },
  stageVisibility: {
    mapping: true,
    review: true,
    export: true
  },
  default: 1,
  //Currency Conversion field will be rounded to two decimal places
  compute: (v: number) => {return Number(v.toFixed(2))},
}),
*/
