import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {


  escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
  }

  transform(value: string, search: string): string {
    if (!search) {
      return value;
    }
    const escapedSearch = this.escapeRegExp(search.trim());
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    return value.replace(regex, '<span class="highlight">$1</span>');
  }

}
