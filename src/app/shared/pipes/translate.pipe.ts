import { Pipe, PipeTransform } from "@angular/core";
import { Translatable } from "../modals/translate.modal";
import { LanguageService } from "../services/language/language.service";

@Pipe({
  name: "translates",
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}

  transform(translation: any, attributeName: string): string {
    const currentLanaguage = localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE");

    return currentLanaguage == "ar"
      ? translation.translation[currentLanaguage][attributeName]
      : translation[attributeName];
  }
}
