import 'reflect-metadata';

export const formMetadataKey = Symbol('FormMetadata');

/**
 * Marks a fields as data belonging to a reactive form.
 *
 * @param formFieldName The name of the field in the reactive form.
 * @param formFieldData The data associated with the form field.
 */
export function FormField(formFieldName: string, formFieldData: any[], formFielType: any = null,  isFormArray = false) {

    return (proto, memberName) => {
        const fieldMetadata = {
            formFieldName: formFieldName,
            formFieldData: formFieldData,
            propertyName: memberName,
            isFormArray: isFormArray,
            type: formFielType
        };

        if (Reflect.hasMetadata(formMetadataKey, proto)) {
            const formMetadata = Reflect.getMetadata(formMetadataKey, proto);
            formMetadata.push(fieldMetadata);
        } else {
            const formMetadata = [fieldMetadata];
            Reflect.defineMetadata(formMetadataKey, formMetadata, proto);
        }
    };
}
