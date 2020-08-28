import { FormGroup } from '@angular/forms';

export class FormUtils {
  static toFormGroup(fg: FormGroup, model: any, mapper: any = null, pascalCase = true): void {
    const formModel = fg.value;
    const tModel = {};
    for (const key in formModel) {
      if (
        !formModel.hasOwnProperty(key) &&
        !(typeof formModel[key] === 'function')
      ) {
        continue;
      }

      // const capitalized = pascalCase ? (key.charAt(0).toUpperCase() + key.slice(1)) : key;
      const capitalized = pascalCase ? (key.charAt(0) + key.slice(1)) : key;

      if (mapper && mapper.hasOwnProperty(key)) {
        if (typeof mapper[key] === 'function') {
          tModel[key] = mapper[key](model);
        }
        continue;
      }

      if (!(typeof model[capitalized] === 'function')) {
        tModel[key] = model[capitalized];
      }
    }

    fg.patchValue(tModel);
  }

  static toModel(fg: FormGroup, model: any, mapper: any = null, pascalCase = true): void {
    const formModel = fg.value;
    for (const key in formModel) {
      if (
        !formModel.hasOwnProperty(key) &&
        !(typeof formModel[key] === 'function')
      ) {
        continue;
      }

      const capitalized = pascalCase ? (key.charAt(0).toUpperCase() + key.slice(1)) : key;
      // const capitalized = pascalCase ? (key.charAt(0) + key.slice(1)) : key;
      if (mapper && mapper.hasOwnProperty(capitalized)) {
        if (typeof mapper[capitalized] === 'function') {
          model[capitalized] = mapper[capitalized](formModel);
        }
        continue;
      }

      if (!(typeof model[capitalized] === 'function')) {
        model[capitalized] = formModel[key];
      }
    }
    delete model.Id;
  }
}
