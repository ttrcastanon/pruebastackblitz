import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { formMetadataKey } from './decorators/reactive-form-decorators';

import 'reflect-metadata';

/**
 * Implements a base form that allows for more complex reactive form models
 * to be created on top of it.
 */
export abstract class BaseView {

    /**
     * A reference to an instance of FormBuilder. Used to create FormGroup
     * objects from form metadata.
     */
    public fb: FormBuilder;
    /**
     * A map to link form field names to property names.
     */
    private fieldMap: any;

    /**
     * The FormGroup associated to this form.
     */
    private _formGroup: FormGroup;

    /**
     * A list of fields belonging to the BaseForm class that should not be
     * included in the DTO.
     */
    private _ignoredFields = ['fb', 'fieldMap', '_formGroup', '_ignoredFields'];

    /**
     * Allows read-only access to the FormGroup object that describes this
     * form.
     */
    get formGroup(): FormGroup {
        return this._formGroup;
    }


    /**
     * Initializes a new instance of the BaseForm class.
     *
     * @param fb A reference to an instance of FormBuilder.
     */
    constructor(fb: FormBuilder) {
        this.fb = fb;
        this.fieldMap = {};
    }

    /**
     * Creates and populates an instance of FormGroup using the field
     * information in this form instance.
     */
    public buildFormGroup(): FormGroup {

        const metadata = Reflect.getMetadata(formMetadataKey, this);
        const groupData = {};

        for (let i = 0; i < metadata.length; i++) {
            this.fieldMap[metadata[i].propertyName] = metadata[i].formFieldName;
            if (metadata[i].isFormArray) {
                const model = new metadata[i].type(this.fb);
                const data: any[] = [];
                data.push(model.buildFormGroup());
                groupData[metadata[i].formFieldName] = this.fb.array(data);
            } else {
                groupData[metadata[i].formFieldName] = metadata[i].formFieldData;
            }
        }
        this._formGroup = this.fb.group(groupData);
        return this._formGroup;
    }

    /**
     * Fills out this form using an object of any type.
     *
     * @param o A reference to an instance of the object containing the
     * data with which to fill out this form.
     */
    public fromObject(o: any) {

        for (const propertyName of Object.getOwnPropertyNames(this)) {
            if (o.hasOwnProperty(propertyName)) {
                const value = o[propertyName];
                const fieldName = this.fieldMap[propertyName];

                // If it's a form property, set it.
                if (fieldName !== undefined) {
                    this.formGroup.get(fieldName).setValue(value);
                }
                this[propertyName] = value;
            }
        }
    }

    /**
     * Builds a DTO from the data contained in this model.
     */
    public toDto(formGroup = this.formGroup): any {

        const dto = {};

        for (const propertyName of Object.getOwnPropertyNames(this)) {
            const fieldName = this.fieldMap[propertyName];
            if (fieldName === undefined) {
                if (this._ignoredFields.indexOf(propertyName) === -1) {
                    dto[propertyName] = this[propertyName];
                }
            } else {
                if (this.constructor.name === 'PhoneNumber' && fieldName === 'number') {
                    dto[propertyName] = formGroup.get(fieldName).value.replace(/-/g, '');
                } else {
                    dto[propertyName] = formGroup.get(fieldName).value;
                }
            }
        }

        return dto;
    }
    public toFormData(entity: any, form: FormData = null): FormData {
        const form_data = form === null ? new FormData() : form;
        for (const propertyName of Object.keys(entity)) {
            if (typeof (entity[propertyName]) === 'object' && !Array.isArray(entity[propertyName]) && entity[propertyName] != null) {
                this.toFormData(entity[propertyName], form_data);
            } else if (Array.isArray(entity[propertyName]) && entity[propertyName] != null) {
                form_data.append(propertyName, JSON.stringify(entity[propertyName]));
            } else if (entity[propertyName] != null) {
                form_data.append(propertyName, entity[propertyName].toString());
            }
        }
        return form_data;
    }

    /**
     * Fills out an instance of a model using the currently available
     * information in this form.
     *
     * @param model An instance of an object used as a model.
     */
    public fillModel(model: any) {

        // Iterate through the list of data fields in this form and populate
        // those fields in model that are present in both form and model.
        for (const propertyName of Object.keys(this.fieldMap)) {
            if (model.hasOwnProperty(propertyName)) {
                const fieldName = this.fieldMap[propertyName];
                model[propertyName] = this.formGroup.get(fieldName).value;
            }
        }
    }

    /**
     * Updates this class using data from the form group.
     */
    public updateModel() {
        this.fillModel(this);
    }

    /**
     * Updates the form group using the model fields.
     */
    public updateForm() {
        for (const propertyName of Object.keys(this.fieldMap)) {
            if (this.hasOwnProperty(propertyName)) {
                const fieldName = this.fieldMap[propertyName];
                const value = this[propertyName];
                this.formGroup.get(fieldName).setValue(value);
            }
        }
    }

    public enableControls() {
        for (const propertyName of Object.keys(this.fieldMap)) {
            if (this.hasOwnProperty(propertyName)) {
                const fieldName = this.fieldMap[propertyName];
                this.formGroup.get(fieldName).enable()
            }
        }
    }

    public disableControls() {
        for (const propertyName of Object.keys(this.fieldMap)) {
            if (this.hasOwnProperty(propertyName)) {
                const fieldName = this.fieldMap[propertyName];
                this.formGroup.get(fieldName).disable()
            }
        }
    }
}
