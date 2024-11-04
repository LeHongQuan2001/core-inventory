import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'replaceLineBreak'
})
export class ReplaceLineBreakPipe implements PipeTransform {

    transform(value: string, separator = '<br />'): string {
        return value.replace(/\\n/g, separator);
    }
}
